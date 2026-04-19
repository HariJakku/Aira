"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, ChevronRight, ChevronLeft, Search, X,
  Info, ZoomIn, Tag, Package, Ruler, Weight, Box, Share2, Check,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */
interface GalleryImage {
  id: string;
  index: number;
  image: string;
  title: string;
  text: string;
  specs: Record<string, string>;
  category: string;
  hasText: boolean;
  width: number;
  height: number;
}

/* ─── Modal ─────────────────────────────────────────────────── */
function ImageModal({
  item,
  allItems,
  onClose,
  onNavigate,
}: {
  item: GalleryImage;
  allItems: GalleryImage[];
  onClose: () => void;
  onNavigate: (item: GalleryImage) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const currentIdx = allItems.findIndex((x) => x.id === item.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < allItems.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(allItems[currentIdx - 1]);
  }, [hasPrev, allItems, currentIdx, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(allItems[currentIdx + 1]);
  }, [hasNext, allItems, currentIdx, onNavigate]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  goNext();
      if (e.key === "ArrowLeft")   goPrev();
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  // Reset zoom when item changes
  useEffect(() => { setZoomed(false); }, [item.id]);

  const handleShare = async () => {
    const url = `${window.location.origin}/gallery?product=${item.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const specIcons: Record<string, React.ReactNode> = {
    Code:     <Tag     size={14} />,
    Material: <Package size={14} />,
    Size:     <Ruler   size={14} />,
    Weight:   <Weight  size={14} />,
    Packing:  <Box     size={14} />,
  };

  return (
    <div
      className="g-modal-bd"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="g-modal">
        {/* Close */}
        <button className="g-modal-x" onClick={onClose}><X size={20} /></button>

        {/* Prev / Next arrows */}
        {hasPrev && (
          <button className="g-modal-nav g-modal-nav--l" onClick={goPrev}>
            <ChevronLeft size={20} />
          </button>
        )}
        {hasNext && (
          <button className="g-modal-nav g-modal-nav--r" onClick={goNext}>
            <ChevronRight size={20} />
          </button>
        )}

        {/* Counter pill */}
        {allItems.length > 1 && (
          <div className="g-modal-counter">
            {currentIdx + 1} / {allItems.length}
          </div>
        )}

        <div className="g-modal-grid">
          {/* Left: image */}
          <div
            className={`g-modal-img-wrap ${zoomed ? "g-modal-img--zoomed" : ""}`}
            onClick={() => setZoomed((z) => !z)}
            title={zoomed ? "Click to zoom out" : "Click to zoom in"}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width:640px) 100vw,50vw"
              className="g-modal-img-el"
              priority
              unoptimized={process.env.NODE_ENV === "development"}
            />
            <div className="g-modal-zoom-hint">
              {zoomed ? "Click to zoom out" : <><ZoomIn size={12} /> Click to zoom</>}
            </div>
          </div>

          {/* Right: info */}
          <div className="g-modal-info">
            <div className="g-modal-info-top">
              <span className="g-modal-cat">{item.category}</span>
              {/* Share button */}
              <button className="g-modal-share" onClick={handleShare}>
                {copied ? <><Check size={13} /> Copied!</> : <><Share2 size={13} /> Share</>}
              </button>
            </div>

            <h2 className="g-modal-title">{item.title}</h2>
            <div className="g-modal-rule" />

            {Object.keys(item.specs).length > 0 && (
              <div className="g-specs">
                {Object.entries(item.specs).map(([k, v]) => (
                  <div key={k} className="g-spec-row">
                    <span className="g-spec-ico">{specIcons[k] ?? <Info size={14} />}</span>
                    <span className="g-spec-lbl">{k}</span>
                    <span className="g-spec-val">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Only shows if text has genuinely extra info beyond specs
            {item.hasText && item.text && (
              <>
                <p className="g-ocr-lbl">Additional Product Info</p>
                <pre className="g-ocr-body">{item.text}</pre>
              </>
            )} */}

            <Link href="/customer/login" className="g-modal-cta">
              Request This Item →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Card ──────────────────────────────────────────────────── */
function GalleryCard({
  item,
  rowIndex,
  onClick,
  isHovered,
  anyHovered,
  onEnter,
  onLeave,
}: {
  item: GalleryImage;
  rowIndex: number;
  onClick: () => void;
  isHovered: boolean;
  anyHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "g-card",
        inView       ? "g-card--in"  : "",
        anyHovered && !isHovered ? "g-card--dim" : "",
        isHovered    ? "g-card--hov" : "",
      ].join(" ")}
      // Stagger each card by its position in the row
      style={{ animationDelay: `${rowIndex * 60}ms` }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
      aria-label={`View ${item.title}`}
    >
      <div className="g-card-img-wrap">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="220px"
          className="g-card-img"
          loading="lazy"
          unoptimized={process.env.NODE_ENV === "development"}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Always-visible bottom label */}
      <div className="g-card-label">
        <p className="g-card-label-text">{item.title}</p>
      </div>

      {/* Hover overlay */}
      <div className="g-card-overlay">
        <div className="g-card-overlay-inner">
          {Object.keys(item.specs).length > 0 ? (
            <div className="g-card-specs-preview">
              {Object.entries(item.specs).slice(0, 3).map(([k, v]) => (
                <p key={k} className="g-card-spec-line">
                  <span className="g-card-spec-k">{k}:</span>
                  <span className="g-card-spec-v"> {v}</span>
                </p>
              ))}
            </div>
          ) : (
            <p className="g-card-no-spec">{item.category}</p>
          )}
          <button
            className="g-card-btn"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            <ZoomIn size={13} />
            See Full Details
          </button>
        </div>
      </div>

      {/* Gold dot — only when there's genuinely extra info */}
      {item.hasText && item.text && (
        <div className="g-card-dot"><Info size={9} /></div>
      )}
    </div>
  );
}

/* ─── Row ───────────────────────────────────────────────────── */
function GalleryRow({
  section,
  items,
  onCardClick,
}: {
  section: string;
  items: GalleryImage[];
  onCardClick: (item: GalleryImage) => void;
}) {
  const [hov, setHov] = useState<number | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const sc = (d: "l" | "r") =>
    strip.current?.scrollBy({ left: d === "r" ? 640 : -640, behavior: "smooth" });

  return (
    <div className="g-row group/row">
      <h2 className="g-row-h">{section}</h2>
      <div className="g-strip-wrap">
        <button className="g-arr g-arr--l" onClick={() => sc("l")}>
          <ChevronLeft size={18} color="white" />
        </button>
        <button className="g-arr g-arr--r" onClick={() => sc("r")}>
          <ChevronRight size={18} color="white" />
        </button>
        <div ref={strip} className="g-strip">
          {items.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              rowIndex={i}
              onClick={() => onCardClick(item)}
              isHovered={hov === i}
              anyHovered={hov !== null}
              onEnter={() => setHov(i)}
              onLeave={() => setHov(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ padding: "1rem 2rem" }}>
      {[1, 2, 3].map((r) => (
        <div key={r} style={{ marginBottom: "3rem" }}>
          <div className="g-skel" style={{ width: 180, height: 18, marginBottom: 14, borderRadius: 6 }} />
          <div style={{ display: "flex", gap: 14 }}>
            {[1, 2, 3, 4, 5].map((c) => (
              <div key={c} className="g-skel" style={{ width: 220, height: 310, borderRadius: 14, flexShrink: 0 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function GalleryPage() {
  const searchParams = useSearchParams();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCat, setActiveCat] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<GalleryImage | null>(null);
  const [error, setError] = useState("");

  const fetchImages = useCallback(async (cat: string, query: string) => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (cat !== "all") p.set("category", cat);
      if (query) p.set("q", query);
      const res = await fetch(`/api/images?${p}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages(data.images ?? []);
      if (data.categories?.length) setCategories(data.categories);
    } catch {
      setError("Could not load gallery. Make sure the dev server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchImages("all", ""); }, [fetchImages]);

  // Debounced re-fetch on filter change
  useEffect(() => {
    const t = setTimeout(() => fetchImages(activeCat, q), 320);
    return () => clearTimeout(t);
  }, [q, activeCat, fetchImages]);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCat]);

  // Deep-link: open modal for ?product=I3
  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId && images.length > 0) {
      const found = images.find((x) => x.id === productId);
      if (found) setModal(found);
    }
  }, [searchParams, images]);

  // Category counts (computed from full image list)
  const catCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = images.filter((x) => x.category === cat).length;
    return acc;
  }, {});

  const isFiltered = activeCat !== "all" || q.trim() !== "";
  const rows = isFiltered
    ? [{ section: `Results (${images.length})`, items: images }]
    : categories
        .map((cat) => ({ section: cat, items: images.filter((x) => x.category === cat) }))
        .filter((r) => r.items.length > 0);

  // Flat list for modal prev/next navigation
  const allVisibleItems = rows.flatMap((r) => r.items);

  return (
    <>
      <style>{`
        /* Animations */
        @keyframes fadeUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes skelPls { 0%,100%{opacity:.3} 50%{opacity:.65} }
        @keyframes modalIn { from{opacity:0;transform:scale(.94) translateY(14px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes bdIn    { from{opacity:0} to{opacity:1} }

        /* Skeleton */
        .g-skel {
          animation: skelPls 1.6s ease infinite;
          background: linear-gradient(90deg,rgba(255,255,255,.05) 25%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.05) 75%);
        }

        /* ── Card ─────────────────────────────────────── */
        .g-card {
          position:relative; width:220px; height:310px; flex-shrink:0;
          border-radius:14px; overflow:hidden; cursor:pointer;
          scroll-snap-align:start;
          opacity:0; transform:translateY(28px);
          transition:
            transform .38s cubic-bezier(.22,1,.36,1),
            opacity   .38s ease,
            box-shadow .35s ease;
        }
        .g-card--in  { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) forwards; }
        .g-card--dim { opacity:.55; transform:scale(.94); filter:brightness(.7); }
        .g-card--hov {
          transform:scale(1.08) translateY(-6px) !important;
          opacity:1 !important; filter:none !important;
          box-shadow:0 20px 50px rgba(0,0,0,.6),0 4px 16px rgba(0,0,0,.35) !important;
          z-index:20;
        }

        .g-card-img-wrap { position:absolute; inset:0; background:#111; }
        .g-card-img { transition:transform .5s cubic-bezier(.22,1,.36,1); will-change:transform; }
        .g-card--hov .g-card-img { transform:scale(1.07); }

        .g-card-label {
          position:absolute; bottom:0; left:0; right:0;
          padding:36px 12px 10px;
          background:linear-gradient(to top,rgba(0,0,0,.72) 0%,transparent 100%);
          transition:opacity .3s ease; pointer-events:none; z-index:2;
        }
        .g-card--hov .g-card-label { opacity:0; }
        .g-card-label-text {
          color:#fff; font-size:11.5px; font-weight:600;
          line-height:1.35; text-shadow:0 1px 4px rgba(0,0,0,.7);
        }

        .g-card-overlay {
          position:absolute; inset:0; z-index:3;
          background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.55) 60%,rgba(0,0,0,.15) 100%);
          display:flex; align-items:flex-end;
          opacity:0; transition:opacity .32s ease; pointer-events:none;
        }
        .g-card--hov .g-card-overlay { opacity:1; pointer-events:auto; }
        .g-card-overlay-inner {
          width:100%; padding:12px;
          transform:translateY(12px);
          transition:transform .32s cubic-bezier(.22,1,.36,1);
        }
        .g-card--hov .g-card-overlay-inner { transform:translateY(0); }

        .g-card-specs-preview { margin-bottom:8px; }
        .g-card-spec-line { color:rgba(255,255,255,.88); font-size:10.5px; line-height:1.5; }
        .g-card-spec-k { color:var(--aira-gold); font-weight:600; }
        .g-card-spec-v { color:#fff; }
        .g-card-no-spec { color:rgba(255,255,255,.7); font-size:11px; margin-bottom:8px; }

        .g-card-btn {
          width:100%; padding:7px 12px; border:none; border-radius:7px;
          background:var(--aira-gold); color:var(--aira-dark);
          font-size:11.5px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:6px;
          transition:filter .2s;
        }
        .g-card-btn:hover { filter:brightness(1.12); }

        .g-card-dot {
          position:absolute; top:9px; right:9px; z-index:4;
          background:var(--aira-gold); color:var(--aira-dark);
          width:19px; height:19px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 2px 6px rgba(0,0,0,.4);
        }

        /* ── Row ──────────────────────────────────────── */
        .g-row { margin-bottom:42px; }
        .g-row-h { padding:0 32px; margin-bottom:14px; font-size:16px; font-weight:600; letter-spacing:.04em; color:var(--aira-gold); }
        .g-strip-wrap { position:relative; padding:20px 0; }

        .g-arr {
          position:absolute; top:50%; transform:translateY(-50%); z-index:10;
          width:36px; height:36px; border-radius:50%;
          border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.12);
          backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center;
          opacity:0; transition:opacity .25s; cursor:pointer;
        }
        .group\/row:hover .g-arr { opacity:1; }
        .g-arr:hover { transform:translateY(-50%) scale(1.1); background:rgba(255,255,255,.22); }
        .g-arr--l { left:5px; }
        .g-arr--r { right:5px; }

        .g-strip {
          display:flex; gap:14px; overflow-x:auto; padding:4px 32px 8px;
          scroll-snap-type:x mandatory; scrollbar-width:none; -ms-overflow-style:none;
        }
        .g-strip::-webkit-scrollbar { display:none; }

        /* ── Search ───────────────────────────────────── */
        .g-srch-wrap { position:relative; max-width:350px; }
        .g-srch {
          width:100%; padding:10px 36px 10px 40px;
          background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14);
          border-radius:40px; color:#fff; font-size:13px; outline:none;
          transition:border-color .2s,background .2s;
        }
        .g-srch:focus { border-color:var(--aira-gold); background:rgba(255,255,255,.12); }
        .g-srch::placeholder { color:rgba(255,255,255,.35); }
        .g-srch-ico { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.4); pointer-events:none; }
        .g-srch-clr { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.4); background:none; border:none; cursor:pointer; display:flex; }

        /* ── Filter chips ─────────────────────────────── */
        .g-chips { display:flex; flex-wrap:wrap; gap:8px; padding:0 32px 18px; }
        .g-chip {
          padding:5px 14px; border-radius:20px; font-size:11px; font-weight:600;
          cursor:pointer; border:1px solid rgba(255,255,255,.13);
          background:rgba(255,255,255,.06); color:rgba(255,255,255,.6);
          transition:all .2s; white-space:nowrap;
        }
        .g-chip:hover { border-color:var(--aira-gold); color:var(--aira-gold); }
        .g-chip--on { background:var(--aira-gold)!important; color:var(--aira-dark)!important; border-color:var(--aira-gold)!important; }
        .g-chip-count {
          display:inline-block; margin-left:5px;
          font-size:10px; opacity:.65; font-weight:500;
        }
        .g-chip--on .g-chip-count { opacity:.7; }

        /* ── Modal ────────────────────────────────────── */
        .g-modal-bd {
          position:fixed; inset:0; z-index:100;
          background:rgba(0,0,0,.78); backdrop-filter:blur(10px);
          display:flex; align-items:center; justify-content:center; padding:20px;
          animation:bdIn .2s ease forwards;
        }
        .g-modal {
          position:relative; background:#1c1712; border-radius:16px;
          width:100%; max-width:900px; max-height:90vh; overflow-y:auto;
          border:1px solid rgba(255,255,255,.1);
          animation:modalIn .28s cubic-bezier(.22,1,.36,1) forwards;
        }
        .g-modal-x {
          position:absolute; top:14px; right:14px; z-index:5;
          background:rgba(255,255,255,.1); border:none; border-radius:50%;
          width:36px; height:36px; display:flex; align-items:center; justify-content:center;
          color:#fff; cursor:pointer; transition:background .2s;
        }
        .g-modal-x:hover { background:rgba(255,255,255,.22); }

        /* Prev / Next navigation arrows inside modal */
        .g-modal-nav {
          position:absolute; top:50%; transform:translateY(-50%); z-index:5;
          width:38px; height:38px; border-radius:50%;
          border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.1);
          backdrop-filter:blur(8px); color:#fff;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:background .2s,transform .2s;
        }
        .g-modal-nav:hover { background:rgba(255,255,255,.22); }
        .g-modal-nav--l { left:10px; }
        .g-modal-nav--r { right:10px; }
        @media(max-width:600px){
          .g-modal-nav { top:auto; bottom:8px; transform:none; }
          .g-modal-nav--l { left:50%; margin-left:-50px; }
          .g-modal-nav--r { right:auto; left:50%; margin-left:12px; }
        }

        /* Counter pill */
        .g-modal-counter {
          position:absolute; bottom:14px; left:50%; transform:translateX(-50%);
          background:rgba(0,0,0,.45); color:rgba(255,255,255,.6);
          font-size:11px; font-weight:600; letter-spacing:.06em;
          padding:3px 10px; border-radius:20px; z-index:5;
          pointer-events:none;
        }

        .g-modal-grid {
          display:grid; grid-template-columns:1fr 1fr; min-height:500px;
        }
        @media(max-width:600px){ .g-modal-grid{grid-template-columns:1fr} }

        /* Zoomable image wrapper */
        .g-modal-img-wrap {
          position:relative; min-height:360px;
          background:#0e0c09; border-radius:16px 0 0 16px; overflow:hidden;
          cursor:zoom-in;
        }
        .g-modal-img-wrap.g-modal-img--zoomed { cursor:zoom-out; }
        @media(max-width:600px){ .g-modal-img-wrap{border-radius:16px 16px 0 0;min-height:260px} }

        .g-modal-img-el {
          object-fit:contain;
          transition:transform .4s cubic-bezier(.22,1,.36,1);
        }
        .g-modal-img--zoomed .g-modal-img-el { transform:scale(1.75); }

        .g-modal-zoom-hint {
          position:absolute; bottom:10px; right:12px;
          font-size:10px; color:rgba(255,255,255,.4);
          display:flex; align-items:center; gap:4px;
          pointer-events:none;
          transition:opacity .3s;
        }

        .g-modal-info { padding:34px 28px; display:flex; flex-direction:column; gap:13px; }

        .g-modal-info-top { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }

        .g-modal-cat {
          display:inline-block; font-size:10px; font-weight:700; letter-spacing:.1em;
          text-transform:uppercase; color:var(--aira-gold);
          padding:3px 10px; border:1px solid rgba(139,115,85,.4); border-radius:20px;
        }

        /* Share button */
        .g-modal-share {
          display:flex; align-items:center; gap:5px;
          font-size:11px; font-weight:600; color:rgba(255,255,255,.45);
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1);
          border-radius:20px; padding:4px 11px; cursor:pointer;
          transition:all .2s;
        }
        .g-modal-share:hover { color:var(--aira-gold); border-color:rgba(139,115,85,.4); background:rgba(139,115,85,.08); }

        .g-modal-title { font-size:21px; font-weight:700; color:#fff; line-height:1.3; }
        .g-modal-rule { height:1px; background:rgba(255,255,255,.08); }
        .g-specs { display:flex; flex-direction:column; gap:9px; }
        .g-spec-row { display:flex; align-items:center; gap:10px; font-size:13px; }
        .g-spec-ico { color:var(--aira-gold); flex-shrink:0; }
        .g-spec-lbl { color:rgba(255,255,255,.5); width:70px; flex-shrink:0; }
        .g-spec-val { color:#fff; font-weight:600; }

        .g-ocr-lbl { font-size:10.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-top:6px; }
        .g-ocr-body {
          background:rgba(0,0,0,.35); border-radius:8px; padding:12px;
          font-size:11.5px; color:rgba(255,255,255,.75); line-height:1.65;
          white-space:pre-wrap; font-family:'DM Mono','Courier New',monospace;
          border:1px solid rgba(255,255,255,.06); max-height:175px; overflow-y:auto;
        }

        .g-modal-cta {
          margin-top:auto; padding:13px 20px; border-radius:9px;
          background:var(--aira-gold); color:var(--aira-dark); font-weight:700;
          font-size:13px; text-align:center; text-decoration:none; display:block;
          transition:filter .2s,transform .18s;
        }
        .g-modal-cta:hover { filter:brightness(1.1); transform:translateY(-1px); }
      `}</style>

      <div className="min-h-screen" style={{ background: "var(--aira-dark)" }}>

        {/* ── NAV ── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between px-8 h-16"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
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

        {/* ── HERO ── */}
        <div
          className="relative flex items-end px-8 pb-10 overflow-hidden"
          style={{ height: "32vh", minHeight: "200px" }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(139,115,85,.22) 0%,rgba(28,23,19,.96) 68%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,var(--aira-dark) 6%,transparent 72%)" }} />
          <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".32em", textTransform: "uppercase", color: "var(--aira-gold)", display: "block", marginBottom: 8 }}>
                ✦ Real Products · AI-Processed · OCR Extracted
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold" style={{ color: "var(--aira-gold-light)", lineHeight: 1.15 }}>
                Product Gallery
              </h1>
              <p className="mt-2 text-sm" style={{ color: "var(--aira-text)", opacity: 0.58 }}>
                {loading
                  ? "Loading products…"
                  : `${images.length} products · hover to preview specs · click for full details`}
              </p>
            </div>
            <div className="g-srch-wrap">
              <Search size={15} className="g-srch-ico" />
              <input
                className="g-srch"
                placeholder="Search products, materials…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {q && (
                <button className="g-srch-clr" onClick={() => setQ("")}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── CHIPS ── */}
        {!loading && (
          <div className="g-chips">
            <button
              className={`g-chip ${activeCat === "all" ? "g-chip--on" : ""}`}
              onClick={() => setActiveCat("all")}
            >
              All
              <span className="g-chip-count">({images.length})</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`g-chip ${activeCat === cat ? "g-chip--on" : ""}`}
                onClick={() => setActiveCat(activeCat === cat ? "all" : cat)}
              >
                {cat}
                <span className="g-chip-count">({catCounts[cat] ?? 0})</span>
              </button>
            ))}
          </div>
        )}

        {/* ── CONTENT ── */}
        {error ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,.5)" }}>
            <p style={{ fontSize: 44, marginBottom: 12 }}>⚠️</p>
            <p>{error}</p>
            <button
              onClick={() => fetchImages(activeCat, q)}
              style={{ marginTop: 14, padding: "8px 22px", background: "var(--aira-gold)", color: "var(--aira-dark)", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <Skeleton />
        ) : images.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,.4)" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
            <p>No products match your search.</p>
            <button
              onClick={() => { setQ(""); setActiveCat("all"); }}
              style={{ marginTop: 12, padding: "8px 22px", background: "var(--aira-gold)", color: "var(--aira-dark)", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="py-2">
            {rows.map((row, i) => (
              <GalleryRow
                key={row.section + i}
                section={row.section}
                items={row.items}
                onCardClick={setModal}
              />
            ))}
          </div>
        )}

        {/* ── FOOTER ── */}
        <div
          className="text-center py-10 text-xs"
          style={{ color: "var(--aira-text)", opacity: 0.28, borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          © {new Date().getFullYear()} AIRA · AI-processed gallery · Smart crop + OCR + OpenCV inpainting
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <ImageModal
          item={modal}
          allItems={allVisibleItems}
          onClose={() => setModal(null)}
          onNavigate={setModal}
        />
      )}
    </>
  );
}