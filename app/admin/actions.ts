"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSocialLinks, setSocialLinks } from "@/lib/social-links";

const INSTAGRAM_USER_ID = "27211583370";
const AUTH_COOKIE = "admin_auth";
const AUTH_TOKEN = "authenticated";

// ─── Auth ────────────────────────────────────────────────────────────

export async function loginAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validUser = process.env.ADMIN_USERNAME ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "admin123";

  if (username !== validUser || password !== validPass) {
    return { success: false, error: "Invalid credentials" };
  }

  // Next.js 14: cookies() is synchronous
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE, AUTH_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours
  });

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === AUTH_TOKEN;
}

// ─── Instagram Sync ──────────────────────────────────────────────────

export async function syncInstagramAction(): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  // Verify auth
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false, error: "Unauthorized" };
  }

  const apiUrl = `https://i.instagram.com/api/v1/users/${INSTAGRAM_USER_ID}/info/`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
      "X-IG-App-ID": "936619743392459",
    },
    signal: AbortSignal.timeout(10000),
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      return {
        success: false,
        error: `Instagram API responded with status ${response.status}`,
      };
    }

    const data = await response.json();
    const username = data?.user?.username;

    if (!username) {
      return { success: false, error: "Could not extract username from response" };
    }

    const profileUrl = `https://www.instagram.com/${username}`;

    // Persist to data file
    setSocialLinks({ instagram: profileUrl });

    // Revalidate all pages so they pick up the new link
    revalidatePath("/", "layout");

    return { success: true, url: profileUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

// ─── Get current links (for admin UI) ────────────────────────────────

export async function getCurrentLinks(): Promise<{ instagram: string }> {
  return getSocialLinks();
}
