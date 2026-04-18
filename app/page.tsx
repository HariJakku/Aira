"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gift, Users, ShieldCheck, Truck, Sparkles, ArrowRight,
  Star, ChevronRight, Heart, Calendar, Package, CheckCircle2,
} from "lucide-react";

const portals = [
  { id: "customer",  label: "Customer Portal",  description: "Browse, request and track your curated gift experiences.", icon: Heart,       href: "/customer/login",  color: "from-rose-50 to-orange-50",   accent: "#c0706a", badge: "For You"  },
  { id: "employee",  label: "Employee Portal",  description: "Manage orders, process requests and coordinate deliveries.", icon: Users,       href: "/employee/login",  color: "from-amber-50 to-yellow-50",  accent: "#8B7355", badge: "Team"     },
  { id: "vendor",    label: "Vendor Portal",    description: "List products, receive assignments and fulfil orders.",     icon: Package,     href: "/vendor/login",    color: "from-emerald-50 to-teal-50",  accent: "#3d7a5e", badge: "Partner"  },
  { id: "admin",     label: "Admin Portal",     description: "Full platform control — users, orders, vendors and analytics.", icon: ShieldCheck, href: "/admin/login",     color: "from-slate-50 to-blue-50",    accent: "#3b5f8a", badge: "Control"  },
];

const steps = [
  { number: "01", title: "Place Your Request",  description: "Tell us about your event — the occasion, date, budget, and guests. Our team gets to work immediately.", icon: Calendar },
  { number: "02", title: "We Curate for You",   description: "Our gifting specialists handpick products from trusted vendors that perfectly match your event theme.", icon: Sparkles },
  { number: "03", title: "Quality Assured",     description: "Every item is reviewed, quality-checked, and beautifully packaged before it leaves our fulfilment centre.", icon: CheckCircle2 },
  { number: "04", title: "Delivered with Joy",  description: "Your gifts arrive on time, every time. We handle logistics so you can focus entirely on celebrating.", icon: Truck },
];

const stats = [
  { value: "5,000+", label: "Events Curated" },
  { value: "98%",    label: "Client Satisfaction" },
  { value: "200+",   label: "Trusted Vendors" },
  { value: "50+",    label: "Cities Served" },
];

const features = [
  { icon: Gift,        title: "Fully Curated",      description: "Every gift is handpicked by our specialists — never generic, always meaningful." },
  { icon: Star,        title: "Premium Quality",     description: "We work only with verified vendors who meet our strict quality standards." },
  { icon: Calendar,    title: "Event-Tailored",      description: "From birthdays to weddings, each order is designed around your specific occasion." },
  { icon: Truck,       title: "Reliable Delivery",   description: "On-time delivery guaranteed. Our logistics team ensures zero last-minute stress." },
  { icon: Sparkles,    title: "Custom Touches",      description: "Personalised packaging, custom notes, and bespoke arrangements on request." },
  { icon: ShieldCheck, title: "End-to-End Support",  description: "Dedicated support from the moment you request to the moment it's delivered." },
];

export default function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass safe-top">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/aira-logo.jpeg" alt="AIRA Logo" width={36} height={36} className="rounded-md object-contain" />
            <span className="font-display text-xl font-semibold tracking-widest" style={{ color: "var(--aira-gold)" }}>AIRA</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["About", "How It Works", "Portals"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="link-underline text-sm font-medium" style={{ color: "var(--aira-text)" }}>{item}</a>
            ))}
          </div>
          <Link href="/customer/login"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ background: "var(--aira-gold)" }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139,115,85,0.08) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(168,144,96,0.06) 0%, transparent 50%),
            radial-gradient(circle at 60% 80%, rgba(196,175,143,0.07) 0%, transparent 50%)`,
        }} />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Logo hero */}
          <div className="flex justify-center mb-8">
            <Image src="/aira-logo.jpeg" alt="AIRA" width={140} height={140} className="object-contain drop-shadow-sm" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border"
            style={{ background: "var(--aira-gold-pale)", borderColor: "rgba(139,115,85,0.2)", color: "var(--aira-gold)" }}>
            <Sparkles size={12} /> Premium Event Gifting Platform
          </div>
          <h1 className="font-display mb-6 leading-[1.1]"
            style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", color: "var(--aira-dark)" }}>
            Curate Your <span className="text-gradient font-display italic">Joy</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "var(--aira-text)", opacity: 0.7 }}>
            AIRA transforms every celebration into an unforgettable experience. We curate, personalise,
            and deliver premium gift collections for birthdays, weddings, housewarmings and every
            occasion that deserves to be remembered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/customer/login"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, var(--aira-gold) 0%, var(--aira-gold-light) 100%)", boxShadow: "0 4px 24px rgba(139,115,85,0.3)" }}>
              Request Gifting <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-medium border transition-all duration-200 hover:bg-amber-50"
              style={{ borderColor: "rgba(139,115,85,0.3)", color: "var(--aira-gold)" }}>
              See How It Works <ChevronRight size={16} />
            </a>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center animate-on-scroll" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="font-display text-3xl font-semibold" style={{ color: "var(--aira-gold)" }}>{s.value}</div>
                <div className="text-sm mt-1" style={{ color: "var(--aira-text)", opacity: 0.6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6" style={{ background: "var(--aira-gold-pale)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <div className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "var(--aira-gold)" }}>About AIRA</div>
              <h2 className="font-display leading-[1.15] mb-6"
                style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", color: "var(--aira-dark)" }}>
                We don&apos;t just deliver gifts.<br /><span className="italic">We deliver moments.</span>
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "var(--aira-text)", opacity: 0.75 }}>
                AIRA was born from a simple belief — that every celebration deserves to be extraordinary.
                We are a service-first gifting platform that bridges the gap between your vision for a
                perfect event and the reality of executing it flawlessly.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--aira-text)", opacity: 0.75 }}>
                From curating the right products to managing vendors and ensuring on-time delivery,
                our team handles every detail. Customers request, our employees coordinate, vendors
                fulfil — and together we create joy at scale.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Birthdays", "Weddings", "Housewarmings", "Corporate Events"].map((tag) => (
                  <span key={tag} className="px-4 py-1.5 rounded-full text-sm font-medium border"
                    style={{ borderColor: "rgba(139,115,85,0.25)", color: "var(--aira-gold)", background: "rgba(255,255,255,0.6)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="card-premium p-5 animate-on-scroll" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "var(--aira-gold-pale)" }}>
                    <f.icon size={17} style={{ color: "var(--aira-gold)" }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--aira-dark)" }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--aira-text)", opacity: 0.65 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "var(--aira-gold)" }}>The Process</div>
            <h2 className="font-display leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--aira-dark)" }}>How AIRA Works</h2>
            <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: "var(--aira-text)", opacity: 0.65 }}>
              A seamless four-step journey from request to delivery — handled entirely by our team.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="card-premium p-7 h-full animate-on-scroll" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--aira-gold-muted)" }}>{step.number}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--aira-gold-pale)" }}>
                  <step.icon size={18} style={{ color: "var(--aira-gold)" }} />
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: "var(--aira-dark)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--aira-text)", opacity: 0.65 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section id="portals" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #fafaf7 0%, var(--aira-gold-pale) 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "var(--aira-gold)" }}>Access Portals</div>
            <h2 className="font-display leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--aira-dark)" }}>Choose Your Portal</h2>
            <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: "var(--aira-text)", opacity: 0.65 }}>
              Whether you&apos;re a customer, team member, vendor partner, or administrator — AIRA has a dedicated workspace for you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portals.map((portal, i) => (
              <Link key={portal.id} href={portal.href} className="group animate-on-scroll block" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`relative h-full rounded-2xl bg-gradient-to-br ${portal.color} border p-7 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}
                  style={{ borderColor: "rgba(139,115,85,0.12)" }}>
                  <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.8)", color: portal.accent }}>{portal.badge}</span>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(255,255,255,0.85)" }}>
                    <portal.icon size={22} style={{ color: portal.accent }} />
                  </div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: "var(--aira-dark)" }}>{portal.label}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--aira-text)", opacity: 0.65 }}>{portal.description}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: portal.accent }}>
                    Sign In <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6" style={{ background: "var(--aira-dark)", color: "rgba(255,255,255,0.7)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image src="/aira-logo.jpeg" alt="AIRA" width={40} height={40} className="rounded-md object-contain opacity-90" />
                <div>
                  <div className="font-display text-2xl font-semibold tracking-widest" style={{ color: "var(--aira-gold-light)" }}>AIRA</div>
                  <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--aira-gold-muted)" }}>Curate Your Joy</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed opacity-60 max-w-xs mt-3">
                Transforming celebrations into lasting memories through premium, personalised gifting experiences.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--aira-gold-muted)" }}>Platform</div>
              <ul className="space-y-2">
                {portals.map((p) => (
                  <li key={p.id}><Link href={p.href} className="text-sm hover:text-white transition-colors duration-200 link-underline">{p.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--aira-gold-muted)" }}>Get In Touch</div>
              <div className="space-y-2 text-sm opacity-70">
                <p>hello@aira.net.in</p>
                <p>+91 91437 37143</p>
                <p>Available Mon – Sat, 9 AM – 7 PM</p>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-40"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p>© {new Date().getFullYear()} AIRA. All rights reserved.</p>
            <p>Curating joy, one gift at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
