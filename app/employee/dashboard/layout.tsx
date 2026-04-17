"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  ListOrdered,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/employee/dashboard" },
  { label: "Take Order", icon: ClipboardList, href: "/employee/dashboard/take-order" },
  { label: "Orders List", icon: ListOrdered, href: "/employee/dashboard/orders" },
  { label: "Profile", icon: UserCircle, href: "/employee/dashboard/profile" },
];

export default function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── SIDEBAR ──────────────────────────────────── */}
      <aside
        className="relative flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? "72px" : "240px",
          background: "var(--aira-dark)",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5 border-b overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(139,115,85,0.3)" }}
          >
            <span
              className="font-display font-semibold text-sm"
              style={{ color: "var(--aira-gold-light)" }}
            >
              A
            </span>
          </div>
          {!collapsed && (
            <div>
              <div
                className="font-display font-semibold tracking-widest text-base leading-none"
                style={{ color: "var(--aira-gold-light)" }}
              >
                AIRA
              </div>
              <div
                className="text-[9px] tracking-[0.2em] uppercase mt-0.5"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Employee
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                style={{
                  background: active ? "rgba(139,115,85,0.2)" : "transparent",
                  color: active ? "var(--aira-gold-light)" : "rgba(255,255,255,0.5)",
                }}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  size={18}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: active ? "var(--aira-gold-light)" : "rgba(255,255,255,0.4)" }}
                />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {active && !collapsed && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "var(--aira-gold)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: logout */}
        <div
          className="px-2 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 hover:bg-red-900/20"
            style={{ color: "rgba(255,255,255,0.4)" }}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110 z-10"
          style={{
            background: "var(--aira-dark)",
            borderColor: "rgba(139,115,85,0.3)",
            color: "var(--aira-gold-muted)",
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── MAIN ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-14 flex items-center justify-between px-6 bg-white sticky top-0 z-10"
          style={{ borderBottom: "1px solid hsl(var(--border))" }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--aira-dark)" }}>
              {navItems.find((n) => n.href === pathname)?.label ?? "Dashboard"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-amber-50 transition-colors relative"
              style={{ color: "var(--aira-gold)" }}
            >
              <Bell size={16} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "var(--aira-gold)" }}
              />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ background: "var(--aira-gold)" }}
            >
              E
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
