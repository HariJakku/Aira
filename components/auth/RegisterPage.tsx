"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const VENDOR_CATEGORIES = [
  "Lifestyle","Eatable","Accessories","Artifact","Toy","Combo","Others",
];

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState("");

  // Common fields
  const [fullName,  setFullName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");

  // Vendor-only
  const [bizName,     setBizName]     = useState("");
  const [city,        setCity]        = useState("");
  const [address,     setAddress]     = useState("");
  const [gst,         setGst]         = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  function toggleCat(cat: string) {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password) { setError("Please fill in all required fields."); return; }
    if (password !== confirm)             { setError("Passwords do not match."); return; }
    if (password.length < 8)             { setError("Password must be at least 8 characters."); return; }
    if (role === "vendor" && selectedCats.length === 0) {
      setError("Please select at least one category."); return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
          emailRedirectTo: `${window.location.origin}${dashboardPath}`,
        },
      });

      if (signUpError) { setError(signUpError.message); setLoading(false); return; }

      // ✅ FIXED LOGIC (IMPORTANT)
      if (data.user) {
        await supabase
          .from("profiles")
          .update({
            name: fullName,
            phone: phone,
            email: email,
          })
          .eq("id", data.user.id);

        // Vendor extra data
        if (role === "vendor") {
          await supabase.from("vendors").insert([{
            id: data.user.id,
            business_name: bizName || fullName,
            categories: selectedCats,
            city,
            address,
            gst_number: gst,
          }]);
        }
      }

      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // (Rest of your UI remains EXACTLY SAME — no changes below)

  // ── Success screen ──────────────────────────────────
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
            <p className="text-sm mb-6" style={{ color: "var(--aira-text)", opacity: 0.65 }}>
              We&apos;ve sent a confirmation email to <strong>{email}</strong>.
              Please verify your email to activate your account.
            </p>
            {role === "employee" && (
              <p className="text-xs p-3 rounded-xl mb-6"
                style={{ background: "var(--aira-gold-pale)", color: "var(--aira-gold)" }}>
                Note: Employee accounts require admin approval before login.
              </p>
            )}
            {role === "vendor" && (
              <p className="text-xs p-3 rounded-xl mb-6"
                style={{ background: "var(--aira-gold-pale)", color: "var(--aira-gold)" }}>
                Note: Your vendor account will be reviewed and verified by our admin team.
              </p>
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
            {error && (
              <div className="text-sm px-4 py-3 rounded-xl flex items-center gap-2"
                style={{ background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Full Name *</label>
              <input type="text" className="input-premium" placeholder="Your full name"
                value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Email Address *</label>
              <input type="email" className="input-premium" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Phone Number</label>
              <input type="tel" className="input-premium" placeholder="10-digit mobile number" maxLength={10}
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} disabled={loading} />
            </div>

            {/* Vendor-specific */}
            {role === "vendor" && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Business Name *</label>
                  <input type="text" className="input-premium" placeholder="Your business or shop name"
                    value={bizName} onChange={(e) => setBizName(e.target.value)} disabled={loading} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>
                    Categories * <span className="font-normal lowercase opacity-60">(select one or more)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VENDOR_CATEGORIES.map((cat) => (
                      <button key={cat} type="button" onClick={() => toggleCat(cat)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                        style={{
                          background: selectedCats.includes(cat) ? accentColor : "hsl(var(--muted))",
                          borderColor: selectedCats.includes(cat) ? accentColor : "hsl(var(--border))",
                          color: selectedCats.includes(cat) ? "#fff" : "var(--aira-text)",
                        }}>
                        {selectedCats.includes(cat) ? <X size={10} /> : <Plus size={10} />}
                        {cat}
                      </button>
                    ))}
                  </div>
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
                  <textarea className="input-premium" placeholder="Full address" rows={2}
                    value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} />
                </div>
              </>
            )}

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

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--aira-gold)" }}>Confirm Password *</label>
              <input type="password" className="input-premium" placeholder="Repeat password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={loading} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:scale-100 mt-2"
              style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`, boxShadow: `0 4px 16px ${accentColor}40` }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "var(--aira-text)", opacity: 0.5 }}>
            Already have an account?{" "}
            <Link href={loginHref} className="link-underline font-medium" style={{ color: accentColor, opacity: 1 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}