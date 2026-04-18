"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import {
  LayoutDashboard, ClipboardList, ListOrdered, UserCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   icon: LayoutDashboard, href: "/employee/dashboard" },
  { label: "Take Order",  icon: ClipboardList,   href: "/employee/dashboard/take-order" },
  { label: "Orders List", icon: ListOrdered,     href: "/employee/dashboard/orders" },
  { label: "Profile",     icon: UserCircle,      href: "/employee/dashboard/profile" },
];

export default function EmployeeDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      portalLabel="Employee"
      accentColor="var(--aira-gold-light)"
      accentBg="rgba(139,115,85,0.12)"
      sidebarBg="#1C1713"
      headerAccent="#8B7355"
      logoutHref="/employee/login"
      userInitial="E"
    >
      {children}
    </DashboardShell>
  );
}
