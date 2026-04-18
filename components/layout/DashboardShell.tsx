"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronLeft, ChevronRight, LogOut, Bell, Menu, X,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  portalLabel: string;
  accentColor: string;
  accentBg: string;
  sidebarBg: string;
  headerAccent: string;
  logoutHref: string;
  userInitial?: string;
}

export default function DashboardShell({
  children,
  navItems,
  portalLabel,
  accentColor,
  accentBg,
  sidebarBg,
  headerAccent,
  logoutHref,
  userInitial = "U",
}: DashboardShellProps) {
  const pathname = usePathname();
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const activeItem = navItems.find((n) =>
    n.href === pathname ||
    (n.href !== navItems[0].href && pathname.startsWith(n.href))
  ) ?? navItems[0];

  /* ── Sidebar inner content (shared desktop + mobile) ─── */
  function SidebarContent() {
    return (
      <>
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 border-b overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <Image
            src="/aira-logo.jpeg"
            alt="AIRA"
            width={32}
            height={32}
            className="rounded-lg object-contain flex-shrink-0 opacity-90"
          />
          {(!collapsed || isMobile) && (
            <div>
              <div
                className="font-display font-semibold tracking-widest text-base leading-none"
                style={{ color: accentColor }}
              >
                AIRA
              </div>
              <div
                className="text-[9px] tracking-[0.2em] uppercase mt-0.5"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {portalLabel}
              </div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              item.href === pathname ||
              (item.href !== navItems[0].href && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: active ? `${accentColor}30` : "transparent",
                  color:      active ? accentColor         : "rgba(255,255,255,0.5)",
                }}
              >
                <item.icon
                  size={20}
                  className="flex-shrink-0"
                  style={{ color: active ? accentColor : "rgba(255,255,255,0.4)" }}
                />
                {(!collapsed || isMobile) && (
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                )}
                {active && (!collapsed || isMobile) && (
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: accentColor }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          className="px-2 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <Link
            href={logoutHref}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-900/20 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#f7f6f3" }}>

      {/* ── DESKTOP SIDEBAR ──────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 ease-in-out relative"
        style={{ width: collapsed ? "72px" : "240px", background: sidebarBg }}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[76px] w-6 h-6 rounded-full flex items-center justify-center border z-20 transition-all hover:scale-110"
          style={{
            background:  sidebarBg,
            borderColor: `${accentColor}50`,
            color:       accentColor,
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── MOBILE DRAWER overlay ────────────────────────── */}
      {isMobile && mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside
            className="fixed top-0 left-0 bottom-0 z-50 flex flex-col w-72 safe-top"
            style={{ background: sidebarBg }}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header
          className="h-14 flex items-center justify-between px-4 md:px-6 bg-white sticky top-0 z-30 safe-top"
          style={{ borderBottom: "1px solid hsl(var(--border))" }}
        >
          {/* Mobile: hamburger | Desktop: page title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ color: accentColor, background: accentBg }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <p className="text-sm font-semibold" style={{ color: "var(--aira-dark)" }}>
              {activeItem.label}
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center relative transition-colors hover:bg-amber-50"
              style={{ color: accentColor }}
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: accentColor }}
              />
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ background: accentColor }}
            >
              {userInitial}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 safe-bottom">
          {children}
        </main>

        {/* ── MOBILE BOTTOM NAV ──────────────────────────── */}
        <nav
          className="md:hidden flex items-center justify-around border-t bg-white safe-bottom"
          style={{
            borderColor: "hsl(var(--border))",
            paddingBottom: "env(safe-area-inset-bottom)",
            minHeight: "60px",
          }}
        >
          {navItems.map((item) => {
            const active =
              item.href === pathname ||
              (item.href !== navItems[0].href && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all"
                style={{ color: active ? accentColor : "hsl(var(--muted-foreground))" }}
              >
                {/* Active indicator dot above icon */}
                <div
                  className="w-1 h-1 rounded-full transition-all duration-200"
                  style={{
                    background:  active ? accentColor : "transparent",
                    marginBottom: "1px",
                  }}
                />
                <item.icon
                  size={active ? 22 : 20}
                  className="transition-all duration-200"
                  style={{
                    color:     active ? accentColor : "hsl(var(--muted-foreground))",
                    transform: active ? "scale(1.1)" : "scale(1)",
                  }}
                />
                <span
                  className="text-[10px] font-medium transition-all duration-200"
                  style={{
                    color:      active ? accentColor : "hsl(var(--muted-foreground))",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
