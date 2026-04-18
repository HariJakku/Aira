"use client";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  LayoutDashboard, ClipboardList, Package, Users,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Orders",   icon: ClipboardList,   href: "/admin/dashboard/orders" },
  { label: "Vendors",  icon: Package,         href: "/admin/dashboard/vendors" },
  { label: "Users",    icon: Users,           href: "/admin/dashboard/users" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      portalLabel="Admin"
      accentColor="#a8c8f0"
      accentBg="rgba(59,95,138,0.12)"
      sidebarBg="#0f1929"
      headerAccent="#3b5f8a"
      logoutHref="/admin/login"
      userInitial="A"
    >
      {children}
    </DashboardShell>
  );
}
