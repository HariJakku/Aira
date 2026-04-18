"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";

/* ─────────────────────────────────────────────
   DATA — each row is a category with N items
───────────────────────────────────────────── */
const rows = [
  {
    section: "🎂 Birthday Celebrations",
    items: [
      { title: "Classic Cake Hamper",       image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop" },
      { title: "Balloon Bonanza",            image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop" },
      { title: "Personalised Gift Box",      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop" },
      { title: "Spa & Wellness Kit",         image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop" },
      { title: "Luxury Chocolate Box",       image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop" },
      { title: "Flower & Candle Set",        image: "https://images.unsplash.com/photo-1487530811015-780c3f90eed0?q=80&w=800&auto=format&fit=crop" },
      { title: "Memory Scrapbook",           image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&auto=format&fit=crop" },
    ],
  },
  {
    section: "💍 Wedding Collections",
    items: [
      { title: "Bridal Welcome Hamper",      image: "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?q=80&w=800&auto=format&fit=crop" },
      { title: "Couple's Keepsake Box",      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" },
      { title: "Floral Centrepiece",         image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop" },
      { title: "Honeymoon Essentials",       image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop" },
      { title: "Gold Ring Tray Set",         image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop" },
      { title: "Wedding Favour Boxes",       image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop" },
      { title: "Champagne & Treats",         image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop" },
    ],
  },
  {
    section: "🏡 Housewarming Gifts",
    items: [
      { title: "Home Essentials Kit",        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
      { title: "Candle & Diffuser Set",      image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?q=80&w=800&auto=format&fit=crop" },
      { title: "Succulent Plant Box",        image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=800&auto=format&fit=crop" },
      { title: "Kitchen Starter Pack",       image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop" },
      { title: "Artisan Tea Collection",     image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop" },
      { title: "Woven Basket Hamper",        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop" },
      { title: "Personalised Door Sign",     image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop" },
    ],
  },
  {
    section: "🏢 Corporate Events",
    items: [
      { title: "Executive Gift Set",         image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop" },
      { title: "Team Appreciation Box",      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop" },
      { title: "Branded Merchandise Kit",    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop" },
      { title: "Conference Welcome Pack",    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop" },
      { title: "Premium Pen & Diary",        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop" },
      { title: "Client Thank You Hamper",    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800&auto=format&fit=crop" },
      { title: "Year-End Celebration Box",   image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop" },
    ],
  },
  {
    section: "🪔 Festive Hampers",
    items: [
      { title: "Diwali Premium Hamper",      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800&auto=format&fit=crop" },
      { title: "Christmas Delight Box",      image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop" },
      { title: "Eid Mubarak Collection",     image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop" },
      { title: "Pongal Harvest Hamper",      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&auto=format&fit=crop" },
      { title: "Navratri Sweet Box",         image: "https://images.unsplash.com/photo-1487530811015-780c3f90eed0?q=80&w=800&auto=format&fit=crop" },
      { title: "New Year Glow Set",          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop" },
      { title: "Holi Colour Hamper",         image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?q=80&w=800&auto=format&fit=crop" },
    ],
  },
];

/* ─────────────────────────────────────────────
   ROW component — one Netflix-style shelf
───────────────────────────────────────────── */
function GalleryRow({ section, items }: { section: string; items: { title: string; image: string }[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* entrance observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("gc--visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!stripRef.current) return;
    stripRef.current.scrollBy({ left: dir === "right" ? 600 : -600, behavior: "smooth" });
  };

  return (
    <div className="mb-10 group/row">
      {/* Section heading */}
      <h2
        className="px-8 mb-4 text-lg font-semibold tracking-wide"
        style={{ color: "var(--aira-gold)" }}
      >
        {section}
      </h2>

      {/* Strip wrapper — extra py so zoom isn't clipped */}
      <div className="relative" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>

        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:scale-110"
          style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ChevronLeft size={18} color="white" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:scale-110"
          style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ChevronRight size={18} color="white" />
        </button>

        {/* Scrollable strip */}
        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto no-scrollbar px-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const anyHovered = hoveredIndex !== null;
            let stateClass = "";
            if (anyHovered) stateClass = isHovered ? "gc--active" : "gc--rest";

            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`gallery-card gc--visible flex-shrink-0 rounded-xl cursor-pointer ${stateClass}`}
                style={{
                  width: "210px",
                  height: "300px",
                  scrollSnapAlign: "start",
                  willChange: "transform, opacity, filter",
                  position: "relative",
                  animationDelay: `${i * 60}ms`,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="210px"
                    className="gc-img object-cover"
                  />
                  {/* overlay */}
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background: isHovered
                        ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 70%)",
                    }}
                  />
                  {/* title */}
                  <div
                    className="gc-title absolute bottom-3 left-3 right-3"
                  >
                    <p className="text-white text-sm font-semibold leading-tight drop-shadow">{item.title}</p>
                    <div className="gc-bar mt-1 h-[2px] rounded-full" style={{ background: "var(--aira-gold)" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function GalleryPage() {
  return (
    <>
      <style>{`
        /* Entrance */
        @keyframes gcFadeUp {
          from { opacity: 0; transform: translateY(36px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .gallery-card {
          opacity: 0;
          transform: translateY(36px) scale(0.95);
          transition:
            transform  0.42s cubic-bezier(0.22, 1, 0.36, 1),
            opacity    0.42s ease,
            filter     0.42s ease,
            box-shadow 0.42s ease;
        }
        .gc--visible {
          animation: gcFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Netflix states */
        .gc--rest {
          transform: scale(0.87) !important;
          opacity: 0.5 !important;
          filter: brightness(0.65) !important;
        }
        .gc--active {
          transform: scale(1.22) translateY(-12px) !important;
          opacity: 1 !important;
          filter: brightness(1.08) !important;
          z-index: 20;
          box-shadow: 0 28px 60px rgba(0,0,0,0.65), 0 6px 20px rgba(0,0,0,0.4) !important;
        }

        /* Inner zoom */
        .gc-img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .gc--active .gc-img { transform: scale(1.1); }

        /* Title + bar */
        .gc-title { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1); }
        .gc--active .gc-title { transform: translateY(-5px); }
        .gc-bar { width: 1.25rem; transition: width 0.4s cubic-bezier(0.22,1,0.36,1); }
        .gc--active .gc-bar { width: 3.5rem; }

        /* Scrollbar hide */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen" style={{ background: "var(--aira-dark)" }}>

        {/* ── Top nav bar ── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between px-8 h-16"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link href="/" className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--aira-gold)" }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="font-display text-lg font-semibold tracking-widest" style={{ color: "var(--aira-gold)" }}>
            AIRA Gallery
          </span>
          <Link
            href="/customer/login"
            className="text-xs font-semibold px-4 py-2 rounded-full"
            style={{ background: "var(--aira-gold)", color: "var(--aira-dark)" }}
          >
            Request Gifting →
          </Link>
        </div>

        {/* ── Hero banner ── */}
        <div
          className="relative flex items-end px-8 pb-12 overflow-hidden"
          style={{ height: "38vh", minHeight: "240px" }}
        >
          {/* blurred bg */}
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop"
            alt="Hero"
            fill
            className="object-cover"
            style={{ filter: "blur(2px) brightness(0.35)", transform: "scale(1.05)" }}
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--aira-dark) 10%, transparent 70%)" }} />
          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: "var(--aira-gold)" }}>
              Curate Your Joy
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight" style={{ color: "var(--aira-gold-light)" }}>
              Our Gift Gallery
            </h1>
            <p className="mt-2 text-sm max-w-md" style={{ color: "var(--aira-text)", opacity: 0.65 }}>
              Discover handpicked collections for every occasion — birthdays, weddings, festive seasons and more.
            </p>
          </div>
        </div>

        {/* ── Rows ── */}
        <div className="py-6">
          {rows.map((row, i) => (
            <GalleryRow key={i} section={row.section} items={row.items} />
          ))}
        </div>

        {/* ── Footer strip ── */}
        <div className="text-center py-10 text-xs" style={{ color: "var(--aira-text)", opacity: 0.3, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          © {new Date().getFullYear()} AIRA · Curating joy, one gift at a time.
        </div>

      </div>
    </>
  );
}