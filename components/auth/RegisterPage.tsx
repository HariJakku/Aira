
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2, Plus, X, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const VENDOR_CATEGORIES = ["Lifestyle","Eatable","Accessories","Artifact","Toy","Combo","Others"];

interface RegisterPageProps {
  portalName: string;
  role: "customer" | "employee" | "vendor";
  accentColor: string;
  loginHref: string;
  dashboardPath: string;
  iconBg: string;
  icon: React.ReactNode;
}

export default function RegisterPage({
  portalName, role, accentColor, loginHref, dashboardPath, iconBg, icon,
}: RegisterPageProps) {
  const [loading,      setLoading]      = useState(false);
  const [done,         setDone]         = useState(false);
  const [showPwd,      setShowPwd]      = useState(false);
  const [error,        setError]        = useState("");
  const [fullName,     setFullName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [bizName,      setBizName]      = useState("");
  const [city,         setCity]         = useState("");
  const [address,      setAddress]      = useState("");
  const [gst,          setGst]          = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  function toggleCat(cat: string) {
    setSelectedCats((p) => p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // ── Client-side validation ───────────────────────────
    if (!fullName.trim())  { setError("Full name is required."); return; }
    if (!email.trim())     { setError("Email address is required."); return; }
    if (!password)         { setError("Password is required."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (role === "vendor" && selectedCats.length === 0) {
      setError("Please select at least one product category."); return;
    }
    if (role === "vendor" && !bizName.trim()) {
      setError("Business name is required for vendors."); return;
    }

    // ── Env var guard ────────────────────────────────────
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError(
        "Configuration error: Supabase environment variables are missing. " +
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → " +
        "Project Settings → Environment Variables, then redeploy."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // ── Step 1: Sign up ──────────────────────────────
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,                        // stored in raw_user_meta_data → used by trigger
          },
          emailRedirectTo: `${window.location.origin}${dashboardPath}`,
        },
      });

      if (signUpError) {
        const msg = signUpError.message ?? "";
        if (msg.includes("already registered") || msg.includes("User already registered")) {
          setError("An account with this email already exists. Please sign in instead.");
        } else if (msg.includes("invalid") && msg.toLowerCase().includes("email")) {
          setError("Please enter a valid email address.");
        } else if (msg.includes("Password should be")) {
          setError(msg); // Supabase gives a good message here
        } else {
          setError(`Registration failed: ${msg}`);
        }
        setLoading(false);
        return;
      }

      // ── Step 2: Profile update (upsert to handle race with trigger) ──
      // The trigger may not have fired yet, so use upsert
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: data.user.id,
              full_name: fullName.trim(),   // ✅ correct column name
              phone: phone.trim() || null,
              role,
            },
            { onConflict: "id" }
          );

        // Don't block registration if profile update fails — log it
        if (profileError) {
          console.warn("Profile upsert warning:", profileError.message);
        }

        // ── Step 3: Vendor record ────────────────────────
        if (role === "vendor") {
          const { error: vendorError } = await supabase
            .from("vendors")
            .upsert(
              {
                id: data.user.id,
                business_name: bizName.trim() || fullName.trim(),
                categories: selectedCats,
                city: city.trim() || null,
                address: address.trim() || null,
                gst_number: gst.trim() || null,
                is_verified: false,
              },
              { onConflict: "id" }
            );

          if (vendorError) {
            console.warn("Vendor record warning:", vendorError.message);
          }
        }
      }

      setDone(true);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("fetch") || msg.includes("Failed to fetch") || msg.includes("network")) {
        setError(
          "Network error — cannot reach Supabase. " +
          "Check NEXT_PUBLIC_SUPABASE_URL in Vercel environment variables."
        );
      } else {
        setError(`Unexpected error: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ───────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(135deg, #fafaf8 0%, var(--aira-gold-pale) 100%)" }}>
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl p-10"
            style={{ boxShadow: "0 8px 48px rgba(139,115,85,0.12)", border: "1px solid rgba(139,115,85,0.1)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(61,122,94,0.1)" }}>
              <CheckCircle2 size={32} style={{ color: "#3d7a5e" }} />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--aira-dark)" }}>
              Account Created!
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--aira-text)", opacity: 0.65 }}>
              A confirmation email has been sent to{" "}
              <strong style={{ color: "var(--aira-gold)" }}>{email}</strong>.
            </p>

            {/* Email confirmation notice */}
            <div className="p-4 rounded-xl mb-5 text-left"
              style={{ background: "#fef3c7", border: "1px solid #fcd34d" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#92400e" }}>
                📧 Confirm your email first
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#78350f" }}>
                Check your inbox and click the confirmation link before signing in.
                Check your spam / junk folder if you don&apos;t see it.
              </p>
            </div>

            {role === "employee" && (
              <div className="p-3 rounded-xl mb-5 text-xs"
                style={{ background: "var(--aira-gold-pale)", color: "var(--aira-gold)" }}>
                ⚠️ Employee accounts also require admin approval. Contact your admin after confirming your email.
              </div>
            )}
            {role === "vendor" && (
              <div className="p-3 rounded-xl mb-5 text-xs"
                style={{ background: "var(--aira-gold-pale)", color: "var(--aira-gold)" }}>
                ⚠️ Your vendor account will be reviewed by our admin team before you can access the portal.
              </div>
            )}

            <Link href={loginHref}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-white transition-all duration-200 hover:scale-105"
              style={{ background: accentColor }}>
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #fafaf8 0%, var(--aira-gold-pale) 100%)" }}>

      <Link href="/" className="fixed top-6 left-6 flex items-center gap-2 text-sm font-medium hover:opacity-70"
        style={{ color: "var(--aira-gold)" }}>
        <ArrowLeft size={16} /> Back to AIRA
      </Link>

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl p-8 sm:p-10"
          style={{ boxShadow: "0 8px 48px rgba(139,115,85,0.12)", border: "1px solid rgba(139,115,85,0.1)" }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <Image src="/aira-logo.jpeg" alt="AIRA" width={56} height={56} className="rounded-xl object-contain" />
            </div>
            <div className="font-display text-2xl font-semibold tracking-widest mb-1" style={{ color: "var(--aira-gold)" }}>AIRA</div>
            <div className="text-xs tracking-[0.25em] uppercase mb-5" style={{ color: "var(--aira-gold-muted)" }}>Curate Your Joy</div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: iconBg }}>
              {icon}
            </div>
            <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--aira-dark)" }}>Create {portalName} Account</h1>
            <p className="text-sm" style={{ color: "var(--aira-text)", opacity: 0.6 }}>Join AIRA and get started today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error box — always shows real reason */}
            {error && (
              <div className="flex items-start gap-2.5 text-sm px-4 py-3 rounded-xl"
                style={{ background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", lineHeight: 1.5 }}>
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Full Name *</label>
              <input type="text" className="input-premium" placeholder="Your full name"
                value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Email Address *</label>
              <input type="email" className="input-premium" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Phone Number</label>
              <input type="tel" className="input-premium" placeholder="10-digit mobile number" maxLength={10}
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} disabled={loading} />
            </div>

            {/* ── Vendor-only fields ──────────────────────── */}
            {role === "vendor" && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Business Name *</label>
                  <input type="text" className="input-premium" placeholder="Your shop or business name"
                    value={bizName} onChange={(e) => setBizName(e.target.value)} disabled={loading} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>
                    Categories *{" "}
                    <span className="font-normal normal-case opacity-60">(select one or more)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VENDOR_CATEGORIES.map((cat) => (
                      <button key={cat} type="button" onClick={() => toggleCat(cat)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                        style={{
                          background:   selectedCats.includes(cat) ? accentColor : "hsl(var(--muted))",
                          borderColor:  selectedCats.includes(cat) ? accentColor : "hsl(var(--border))",
                          color:        selectedCats.includes(cat) ? "#fff"       : "var(--aira-text)",
                        }}>
                        {selectedCats.includes(cat) ? <X size={10} /> : <Plus size={10} />}
                        {cat}
                      </button>
                    ))}
                  </div>
                  {selectedCats.length > 0 && (
                    <p className="text-xs mt-1.5" style={{ color: "var(--aira-gold)" }}>
                      Selected: {selectedCats.join(", ")}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>City</label>
                    <input type="text" className="input-premium" placeholder="City"
                      value={city} onChange={(e) => setCity(e.target.value)} disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>GST No.</label>
                    <input type="text" className="input-premium" placeholder="Optional"
                      value={gst} onChange={(e) => setGst(e.target.value)} disabled={loading} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Business Address</label>
                  <textarea className="input-premium" placeholder="Full business address" rows={2}
                    value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} />
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Password *</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} className="input-premium pr-12"
                  placeholder="Min 8 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70" tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Confirm Password *</label>
              <input type="password" className="input-premium" placeholder="Repeat your password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={loading} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:scale-100 mt-2"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                boxShadow: `0 4px 16px ${accentColor}40`,
              }}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Creating account…</>
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "var(--aira-text)", opacity: 0.5 }}>
            Already have an account?{" "}
            <Link href={loginHref} className="link-underline font-medium" style={{ color: accentColor, opacity: 1 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}