"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Package, ClipboardList,
  ShieldCheck, ChevronLeft, ChevronRight, LogOut, Bell,
} from "lucide-react";

const navItems = [
  { label: "Overview",    icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Orders",      icon: ClipboardList,   href: "/admin/dashboard/orders" },
  { label: "Vendors",     icon: Package,         href: "/admin/dashboard/vendors" },
  { label: "Users",       icon: Users,           href: "/admin/dashboard/users" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="relative flex flex-col h-screen sticky top-0 transition-all duration-300 flex-shrink-0"
        style={{ width: collapsed ? "72px" : "240px", background: "#0f1929" }}>
        <div className="flex items-center gap-3 px-4 py-5 border-b overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Image src="/aira-logo.jpeg" alt="AIRA" width={32} height={32} className="rounded-lg object-contain flex-shrink-0 opacity-90" />
          {!collapsed && (
            <div>
              <div className="font-display font-semibold tracking-widest text-base leading-none" style={{ color: "#a8b8d0" }}>AIRA</div>
              <div className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>Admin</div>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: active ? "rgba(59,95,138,0.3)" : "transparent",
                  color: active ? "#a8c8f0" : "rgba(255,255,255,0.45)",
                }}
                title={collapsed ? item.label : undefined}>
                <item.icon size={18} className="flex-shrink-0" style={{ color: active ? "#a8c8f0" : "rgba(255,255,255,0.35)" }} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#3b5f8a" }} />}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Link href="/admin/login"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-900/20 transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            title={collapsed ? "Sign Out" : undefined}>
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </Link>
        </div>
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center border z-10 transition-all hover:scale-110"
          style={{ background: "#0f1929", borderColor: "rgba(59,95,138,0.4)", color: "#a8b8d0" }}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-6 bg-white sticky top-0 z-10"
          style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: "#3b5f8a" }} />
            <p className="text-sm font-medium" style={{ color: "var(--aira-dark)" }}>Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors relative" style={{ color: "#3b5f8a" }}>
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#3b5f8a" }} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: "#3b5f8a" }}>A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}