"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LoginPageProps {
  portalName: string;
  portalDescription: string;
  accentColor: string;
  dashboardPath: string;
  registerHref?: string;
  iconBg: string;
  icon: React.ReactNode;
}

export default function LoginPage({
  portalName, portalDescription, accentColor, dashboardPath, registerHref, iconBg, icon,
}: LoginPageProps) {
  const router = useRouter();
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // ── Guard: env vars missing ───────────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError(
        "Configuration error: Supabase environment variables are not set. " +
        "Go to Vercel → Project Settings → Environment Variables and add " +
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        // ── Map Supabase errors to friendly messages ──────
        const msg = signInError.message ?? "";
        if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
          setError("Incorrect email or password. Please check and try again.");
        } else if (msg.includes("Email not confirmed") || msg.includes("email_not_confirmed")) {
          setError(
            "Your email is not confirmed yet. " +
            "Please check your inbox (and spam folder) for a confirmation link from AIRA."
          );
        } else if (msg.includes("User not found")) {
          setError("No account found with this email. Please register first.");
        } else if (msg.includes("Too many requests") || msg.includes("rate_limit")) {
          setError("Too many login attempts. Please wait a few minutes and try again.");
        } else {
          setError(`Login failed: ${msg}`);
        }
        setLoading(false);
        return;
      }

      if (!data?.user) {
        setError("Login failed — no session returned. Please try again.");
        setLoading(false);
        return;
      }

      router.push(dashboardPath);
      router.refresh();

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed to fetch")) {
        setError(
          "Network error — cannot reach Supabase. " +
          "Check that NEXT_PUBLIC_SUPABASE_URL is correct in Vercel environment variables."
        );
      } else {
        setError(`Unexpected error: ${msg}`);
      }
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #fafaf8 0%, var(--aira-gold-pale) 100%)" }}>

      <Link href="/" className="fixed top-6 left-6 flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        style={{ color: "var(--aira-gold)" }}>
        <ArrowLeft size={16} /> Back to AIRA
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 sm:p-10"
          style={{ boxShadow: "0 8px 48px rgba(139,115,85,0.12)", border: "1px solid rgba(139,115,85,0.1)" }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <Image src="/aira-logo.jpeg" alt="AIRA" width={72} height={72} className="rounded-xl object-contain" />
            </div>
            <div className="font-display text-2xl font-semibold tracking-widest mb-1" style={{ color: "var(--aira-gold)" }}>AIRA</div>
            <div className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "var(--aira-gold-muted)" }}>Curate Your Joy</div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: iconBg }}>
              {icon}
            </div>
            <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--aira-dark)" }}>{portalName}</h1>
            <p className="text-sm" style={{ color: "var(--aira-text)", opacity: 0.6 }}>{portalDescription}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error message — always shows real reason */}
            {error && (
              <div className="flex items-start gap-2.5 text-sm px-4 py-3 rounded-xl"
                style={{ background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", lineHeight: 1.5 }}>
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Email Address</label>
              <input type="email" className="input-premium" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" disabled={loading} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Password</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} className="input-premium pr-12"
                  placeholder="Enter your password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" disabled={loading} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity" tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs link-underline" style={{ color: accentColor }}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:scale-100 mt-2"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                boxShadow: `0 4px 16px ${accentColor}40`,
              }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign In"}
            </button>
          </form>

          <div className="mt-5 space-y-2">
            {registerHref && (
              <p className="text-center text-xs" style={{ color: "var(--aira-text)", opacity: 0.5 }}>
                New here?{" "}
                <Link href={registerHref} className="link-underline font-medium" style={{ color: accentColor, opacity: 1 }}>
                  Create an account
                </Link>
              </p>
            )}
            <p className="text-center text-xs" style={{ color: "var(--aira-text)", opacity: 0.4 }}>
              Wrong portal?{" "}
              <Link href="/#portals" className="link-underline font-medium" style={{ color: accentColor, opacity: 0.8 }}>
                Choose another
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}