"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

interface LoginPageProps {
  portalName: string;
  portalDescription: string;
  accentColor: string;
  dashboardPath: string;
  iconBg: string;
  icon: React.ReactNode;
}

export default function LoginPage({
  portalName,
  portalDescription,
  accentColor,
  dashboardPath,
  iconBg,
  icon,
}: LoginPageProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    // Simulate auth — replace with Supabase signIn
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push(dashboardPath);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #fafaf8 0%, var(--aira-gold-pale) 100%)",
      }}
    >
      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-70"
        style={{ color: "var(--aira-gold)" }}
      >
        <ArrowLeft size={16} />
        Back to AIRA
      </Link>

      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="bg-white rounded-3xl p-8 sm:p-10"
          style={{
            boxShadow: "0 8px 48px rgba(139,115,85,0.12), 0 1px 4px rgba(139,115,85,0.06)",
            border: "1px solid rgba(139,115,85,0.1)",
          }}
        >
          {/* Logo + Portal badge */}
          <div className="text-center mb-8">
            <div
              className="font-display text-3xl font-semibold tracking-widest mb-1"
              style={{ color: "var(--aira-gold)" }}
            >
              AIRA
            </div>
            <div
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: "var(--aira-gold-muted)" }}
            >
              Curate Your Joy
            </div>

            {/* Portal icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: iconBg }}
            >
              {icon}
            </div>

            <h1
              className="text-xl font-semibold mb-1"
              style={{ color: "var(--aira-dark)" }}
            >
              {portalName}
            </h1>
            <p className="text-sm" style={{ color: "var(--aira-text)", opacity: 0.6 }}>
              {portalDescription}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="text-sm px-4 py-3 rounded-xl"
                style={{ background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2" }}
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--aira-text)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                className="input-premium"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--aira-text)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-premium pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs link-underline"
                style={{ color: accentColor }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                boxShadow: `0 4px 16px ${accentColor}40`,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Back to portals */}
          <p
            className="text-center text-xs mt-6"
            style={{ color: "var(--aira-text)", opacity: 0.5 }}
          >
            Not the right portal?{" "}
            <Link
              href="/#portals"
              className="link-underline font-medium"
              style={{ color: accentColor, opacity: 1 }}
            >
              Choose another
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
