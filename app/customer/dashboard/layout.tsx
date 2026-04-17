"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, PlusCircle, UserCircle, ChevronLeft, ChevronRight, LogOut, Bell } from "lucide-react";

const navItems = [
  { label: "Home",         icon: LayoutDashboard, href: "/customer/dashboard" },
  { label: "New Request",  icon: PlusCircle,      href: "/customer/dashboard/new-order" },
  { label: "My Orders",    icon: ClipboardList,   href: "/customer/dashboard/orders" },
  { label: "Profile",      icon: UserCircle,      href: "/customer/dashboard/profile" },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-rose-50/30">
      <aside className="relative flex flex-col h-screen sticky top-0 transition-all duration-300 flex-shrink-0"
        style={{ width: collapsed ? "72px" : "240px", background: "#2d1a16" }}>
        <div className="flex items-center gap-3 px-4 py-5 border-b overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Image src="/aira-logo.jpeg" alt="AIRA" width={32} height={32} className="rounded-lg object-contain flex-shrink-0 opacity-90" />
          {!collapsed && (
            <div>
              <div className="font-display font-semibold tracking-widest text-base leading-none" style={{ color: "#e8b4a0" }}>AIRA</div>
              <div className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>Customer</div>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{ background: active ? "rgba(192,112,106,0.25)" : "transparent", color: active ? "#e8b4a0" : "rgba(255,255,255,0.45)" }}
                title={collapsed ? item.label : undefined}>
                <item.icon size={18} className="flex-shrink-0" style={{ color: active ? "#e8b4a0" : "rgba(255,255,255,0.35)" }} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Link href="/customer/login" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-900/20 transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}>
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </Link>
        </div>
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center border z-10 hover:scale-110 transition-all"
          style={{ background: "#2d1a16", borderColor: "rgba(192,112,106,0.4)", color: "#e8b4a0" }}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-6 bg-white sticky top-0 z-10" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          <p className="text-sm font-medium" style={{ color: "var(--aira-dark)" }}>
            {navItems.find((n) => n.href === pathname)?.label ?? "Dashboard"}
          </p>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 transition-colors" style={{ color: "#c0706a" }}>
              <Bell size={16} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: "#c0706a" }}>C</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}