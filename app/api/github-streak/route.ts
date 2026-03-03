import { NextRequest, NextResponse } from "next/server";

interface ContributionDay {
    date: string;
    contributionCount: number;
}

interface ContributionWeek {
    contributionDays: ContributionDay[];
}

interface GitHubResponse {
    data?: {
        user?: {
            contributionsCollection: {
                contributionCalendar: {
                    totalContributions: number;
                    weeks: ContributionWeek[];
                };
            };
        };
    };
}

function calculateStreaks(weeks: ContributionWeek[]) {
    const allDays: ContributionDay[] = [];
    for (const week of weeks) {
        for (const day of week.contributionDays) {
            allDays.push(day);
        }
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split("T")[0];

    for (const day of allDays) {
        if (day.contributionCount > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    for (let i = allDays.length - 1; i >= 0; i--) {
        const day = allDays[i];
        if (day.date > today) continue;
        if (day.contributionCount > 0) {
            currentStreak++;
        } else {
            if (day.date === today) continue;
            break;
        }
    }

    return { currentStreak, longestStreak };
}

// Fallback: scrape contribution data from public GitHub profile page
async function fetchFromPublicProfile(username: string): Promise<{
    totalContributions: number;
    weeks: ContributionWeek[];
} | null> {
    try {
        // GitHub provides contribution data via this public endpoint
        const response = await fetch(
            `https://github.com/users/${username}/contributions`,
            {
                headers: {
                    Accept: "text/html",
                    "User-Agent": "Mozilla/5.0",
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) return null;

        const html = await response.text();

        // Parse the contribution data from the HTML
        const dayRegex =
            /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"[^>]*/g;
        const levelCountMap: Record<string, number> = {
            "0": 0,
            "1": 1,
            "2": 3,
            "3": 6,
            "4": 10,
        };

        const days: { date: string; count: number }[] = [];
        let match;
        while ((match = dayRegex.exec(html)) !== null) {
            days.push({
                date: match[1],
                count: levelCountMap[match[2]] || 0,
            });
        }

        if (days.length === 0) return null;

        // Sort by date
        days.sort((a, b) => a.date.localeCompare(b.date));

        // Group into weeks (7 days each)
        const weeks: ContributionWeek[] = [];
        for (let i = 0; i < days.length; i += 7) {
            const weekDays = days.slice(i, i + 7).map((d) => ({
                date: d.date,
                contributionCount: d.count,
            }));
            if (weekDays.length > 0) {
                weeks.push({ contributionDays: weekDays });
            }
        }

        const totalContributions = days.reduce((sum, d) => sum + d.count, 0);

        return { totalContributions, weeks };
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const username = process.env.GITHUB_USERNAME || "roshanpanda666";
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const token = process.env.GITHUB_TOKEN;

    // Build date range
    let from: string;
    let to: string;

    if (yearParam) {
        const year = parseInt(yearParam);
        from = `${year}-01-01T00:00:00Z`;
        to = `${year}-12-31T23:59:59Z`;
    } else {
        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        from = oneYearAgo.toISOString();
        to = now.toISOString();
    }

    // Try GraphQL API first (if token is available)
    if (token) {
        const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

        try {
            const response = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${token}`,
                },
                body: JSON.stringify({
                    query,
                    variables: { username, from, to },
                }),
                next: { revalidate: 3600 },
            });

            if (response.ok) {
                const json: GitHubResponse = await response.json();
                const calendar =
                    json.data?.user?.contributionsCollection?.contributionCalendar;

                if (calendar) {
                    const { currentStreak, longestStreak } = calculateStreaks(
                        calendar.weeks
                    );

                    return NextResponse.json({
                        totalContributions: calendar.totalContributions,
                        currentStreak,
                        longestStreak,
                        weeks: calendar.weeks,
                        year: yearParam || "latest",
                        source: "graphql",
                    });
                }
            }
        } catch (error) {
            console.error("GraphQL API error:", error);
        }
    }

    // Fallback: try public profile scraping (no token needed, latest year only)
    console.log("Trying public profile scraping for", username);
    const publicData = await fetchFromPublicProfile(username);

    if (publicData) {
        // If a specific year was requested, filter the data
        let filteredWeeks = publicData.weeks;
        if (yearParam) {
            filteredWeeks = publicData.weeks.filter((w) =>
                w.contributionDays.some((d) => d.date.startsWith(yearParam))
            );
            // Also filter individual days within border weeks
            filteredWeeks = filteredWeeks.map((w) => ({
                contributionDays: w.contributionDays.filter((d) =>
                    d.date.startsWith(yearParam)
                ),
            })).filter((w) => w.contributionDays.length > 0);
        }

        const { currentStreak, longestStreak } = calculateStreaks(filteredWeeks);
        const totalContributions = filteredWeeks.reduce(
            (sum, w) =>
                sum + w.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
            0
        );

        return NextResponse.json({
            totalContributions,
            currentStreak,
            longestStreak,
            weeks: filteredWeeks,
            year: yearParam || "latest",
            source: "public",
        });
    }

    // Final fallback: mock data
    console.error("All GitHub data sources failed, using mock data");
    const weeks: ContributionWeek[] = [];
    const now = new Date();
    for (let w = 51; w >= 0; w--) {
        const days: ContributionDay[] = [];
        for (let d = 0; d < 7; d++) {
            const date = new Date(now);
            date.setDate(date.getDate() - (w * 7 + (6 - d)));
            const count =
                Math.random() > 0.25 ? Math.floor(Math.random() * 12) : 0;
            days.push({
                date: date.toISOString().split("T")[0],
                contributionCount: count,
            });
        }
        weeks.push({ contributionDays: days });
    }

    const total = weeks.reduce(
        (sum, w) =>
            sum + w.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
        0
    );

    return NextResponse.json({
        totalContributions: total,
        currentStreak: 12,
        longestStreak: 34,
        weeks,
        year: yearParam || "latest",
        source: "mock",
    });
}
