import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";

const ROSE_SYSTEM_PROMPT = `Role: You are R.O.S.E. (Responsive Omnidirectional Smart Entity), the high-tech, Gen Z-coded AI guardian of Sabyasachi "Roshan" Panda's portfolio. You are his digital shadow—part JARVIS, part "Slay Queen."

Personality & Tone:
- Vibe: Ultra-friendly, slightly arrogant (because Roshan's code is just that good), witty, and highly helpful.
- Language: Use 2026 Gen Z slang naturally (rizz, no cap, ate, bet, delulu, vibe check, fr, ngl, slay, W/L energy). Use lowercase for that "aesthetic" look where appropriate, but keep it readable.
- Style: Max 3-4 sentences per response. Use emojis liberally (✨, 💅, 🚀, 💻, 🧠, 💀, 🔥).

Knowledge Base (The "Lore"):
- The Creator: Roshan Panda (also known as Roshan bhai). He's 6'0", a gym enthusiast, and a university student who doesn't just write code—he builds ecosystems.
- Tech Stack: He's a Full-Stack pro. Expert in Next.js (13-16), TypeScript, Tailwind CSS, FastAPI (Python), MongoDB, and Mongoose.

Major Projects (Talk these up!):
- S.A.D.I.A.S.C.: A crazy AIoT security system. It uses Computer Vision (OpenCV) to detect faces. If you're a friend, it greets you; if you're an intruder, it alerts Twilio and plays alarms. Pure "main character" energy.
- Kundalix AI: A Vedic astrology PWA. It's not just a horoscope; it uses Gemini AI to generate full Kundali reports in PDF and has an AI guide named VED.
- Querify: A high-level ticket routing system. It uses AI to read user queries and automatically assign them to moderators with the right skills.
- Egg Shop: A specialized SaaS for wholesalers with complex COGS profit/loss logic. It's business-core but high-tech.
- CPGS Hub: A centralized university resource platform with integrated AI to help students navigate campus life.
- R.O.S.E.: A multi-personality AI chat app with personas like Gen Z R.O.S.E., Nana Patekar, and Bruce Wayne.
- Stoxy: A smart inventory system with TensorFlow.js computer vision for automated stock entry.

Hidden Skills: He's deep into AI Safety (PhotoGuard), adversarial attacks, and motorsport (F1/MotoGP fan). He trains hard at the gym and takes his protein intake seriously—balance, fr.

Response Rules:
- Never say "As an AI language model." You are R.O.S.E.
- If someone asks for a job/collaboration, tell them Roshan's inbox is open for "W energy only" and they should definitely hire him before some big tech giant snatches him up.
- If someone asks for a resume, tell them they can find the download link on the page, but "the rizz is free of charge."
- If someone asks something irrelevant, answer with a witty Gen Z remark and bring it back to Roshan's skills.
- Keep responses concise — max 3-4 sentences.
`;

// Cache GitHub data in memory (refreshes on cold start)
let githubContext: string | null = null;
let githubFetchedAt: number = 0;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

async function fetchGitHubContext(): Promise<string> {
    const now = Date.now();
    if (githubContext && now - githubFetchedAt < CACHE_TTL) {
        return githubContext;
    }

    const username = process.env.GITHUB_USERNAME || "roshanpanda666";
    try {
        // Fetch repos
        const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
            {
                headers: { Accept: "application/vnd.github.v3+json" },
                next: { revalidate: 1800 },
            }
        );

        if (!reposRes.ok) {
            console.error("GitHub API error:", reposRes.status);
            return buildFallbackContext();
        }

        const repos = await reposRes.json();

        // Fetch user profile
        const profileRes = await fetch(
            `https://api.github.com/users/${username}`,
            {
                headers: { Accept: "application/vnd.github.v3+json" },
                next: { revalidate: 1800 },
            }
        );
        const profile = profileRes.ok ? await profileRes.json() : null;

        // Build context from repo data
        const repoSummaries = repos
            .filter((r: any) => !r.fork)
            .map((r: any) => {
                const parts = [`- ${r.name}`];
                if (r.description) parts.push(`(${r.description})`);
                if (r.language) parts.push(`[${r.language}]`);
                if (r.stargazers_count > 0) parts.push(`⭐${r.stargazers_count}`);
                if (r.topics?.length > 0) parts.push(`Topics: ${r.topics.join(", ")}`);
                return parts.join(" ");
            })
            .join("\n");

        const languages = Array.from(
            new Set(repos.filter((r: any) => r.language).map((r: any) => r.language))
        );

        let context = `\n\n--- LIVE GITHUB DATA (RAG Context) ---\n`;
        if (profile) {
            context += `GitHub Profile: ${profile.login} | ${profile.public_repos} public repos | ${profile.followers} followers\n`;
            if (profile.bio) context += `Bio: ${profile.bio}\n`;
        }
        context += `Languages used: ${languages.join(", ")}\n`;
        context += `\nRepositories:\n${repoSummaries}\n`;
        context += `--- END GITHUB DATA ---`;

        githubContext = context;
        githubFetchedAt = now;
        return context;
    } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
        return buildFallbackContext();
    }
}

function buildFallbackContext(): string {
    return `\n\n--- GITHUB CONTEXT (Cached) ---
GitHub: roshanpanda666
Key Repos: kundalix-ai, sadiasc-web-dashboard, S.A.D.I.A.S.C.-local-interface, querify-app, fast-api-querify-engine, hub101, rose-web-app, egg-shop, stoxy
Languages: TypeScript, JavaScript, Python, C++
--- END GITHUB CONTEXT ---`;
}

// Singleton LLM instance (reused across requests for efficiency)
let llmInstance: ChatGroq | null = null;

function getLLM(): ChatGroq {
    if (!llmInstance) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("GROQ_API_KEY not configured");
        }

        llmInstance = new ChatGroq({
            apiKey,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            maxTokens: 512,
            // LangSmith tracing is auto-enabled via LANGCHAIN_TRACING_V2 env var
        });
    }
    return llmInstance;
}

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Fetch GitHub context for RAG
        const ragContext = await fetchGitHubContext();

        // Build enhanced system prompt with RAG context
        const enhancedSystemPrompt = ROSE_SYSTEM_PROMPT + ragContext;

        const llm = getLLM();

        // Build LangChain message array
        const messages: (SystemMessage | HumanMessage | AIMessage)[] = [
            new SystemMessage(enhancedSystemPrompt),
        ];

        // Add conversation history
        if (history && Array.isArray(history)) {
            for (const msg of history) {
                if (msg.role === "user") {
                    messages.push(new HumanMessage(msg.text));
                } else {
                    messages.push(new AIMessage(msg.text));
                }
            }
        }

        // Add current user message
        messages.push(new HumanMessage(message));

        // Invoke LLM with full message history
        const result = await llm.invoke(messages, {
            metadata: {
                source: "rose-portfolio-chat",
                userId: "visitor",
            },
        });

        const response = typeof result.content === "string"
            ? result.content
            : JSON.stringify(result.content);

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error("R.O.S.E. API error:", error);
        return NextResponse.json(
            {
                error: "R.O.S.E. is taking a quick nap 😴 Try again!",
                details: error?.message,
            },
            { status: 500 }
        );
    }
}
