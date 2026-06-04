"use client";

import { useState } from "react";
import {
  loginAction,
  logoutAction,
  syncInstagramAction,
  getCurrentLinks,
} from "./actions";
import { useEffect } from "react";

// ─── Login Form ──────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginAction(formData);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] px-4">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative about-glass-card w-full max-w-md p-8 rounded-2xl space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              Panel
            </span>
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to manage your portfolio links
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="space-y-2">
          <label htmlFor="admin-username" className="text-gray-400 text-sm font-medium">
            Username
          </label>
          <input
            id="admin-username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/15 text-white placeholder:text-gray-600 outline-none focus:border-purple-500/40 focus:shadow-[0_0_20px_rgba(112,66,248,0.1)] transition-all text-sm"
            placeholder="Enter username"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-gray-400 text-sm font-medium">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/15 text-white placeholder:text-gray-600 outline-none focus:border-purple-500/40 focus:shadow-[0_0_20px_rgba(112,66,248,0.1)] transition-all text-sm"
            placeholder="Enter password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-sm transition-all hover:shadow-[0_4px_24px_rgba(112,66,248,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [instagramUrl, setInstagramUrl] = useState<string>("Loading...");
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load current links on mount
  useEffect(() => {
    getCurrentLinks().then((links) => {
      setInstagramUrl(links.instagram);
    });
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const result = await syncInstagramAction();
      if (result.success && result.url) {
        setInstagramUrl(result.url);
        setSyncResult({
          success: true,
          message: `Synced! Updated to: ${result.url}`,
        });
      } else {
        setSyncResult({
          success: false,
          message: result.error || "Failed to sync",
        });
      }
    } catch {
      setSyncResult({
        success: false,
        message: "Something went wrong",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
      onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] px-4 py-8">
      {/* Background glows */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Link{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                Manager
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sync your social media links dynamically
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-all disabled:opacity-50"
          >
            {isLoggingOut ? "..." : "Logout"}
          </button>
        </div>

        {/* Instagram Sync Card */}
        <div className="about-glass-card p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Instagram</h2>
              <p className="text-gray-500 text-xs">
                Sync your profile URL from Instagram API
              </p>
            </div>
          </div>

          {/* Current URL */}
          <div className="space-y-2">
            <p className="text-gray-400 text-sm font-medium">Current URL</p>
            <div className="px-4 py-3 rounded-xl bg-white/5 border border-purple-500/10">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-purple-400 text-sm hover:text-purple-300 transition-colors break-all"
              >
                {instagramUrl}
              </a>
            </div>
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm transition-all hover:shadow-[0_4px_24px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSyncing ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Instagram
              </>
            )}
          </button>

          {/* Result */}
          {syncResult && (
            <div
              className={`px-4 py-3 rounded-xl text-sm text-center ${
                syncResult.success
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {syncResult.message}
            </div>
          )}
        </div>

        {/* Info */}
        <p className="text-gray-600 text-xs text-center mt-6">
          This fetches your Instagram username via the API and updates all
          portfolio links in real-time.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginForm onSuccess={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
}
