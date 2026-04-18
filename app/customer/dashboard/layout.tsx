import DashboardShell from "@/components/layout/DashboardShell";
import {
  LayoutDashboard, PlusCircle, ClipboardList, UserCircle,
} from "lucide-react";

const navItems = [
  { label: "Home",        icon: LayoutDashboard, href: "/customer/dashboard" },
  { label: "New Request", icon: PlusCircle,      href: "/customer/dashboard/new-order" },
  { label: "My Orders",   icon: ClipboardList,   href: "/customer/dashboard/orders" },
  { label: "Profile",     icon: UserCircle,      href: "/customer/dashboard/profile" },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      portalLabel="Customer"
      accentColor="#e8b4a0"
      accentBg="rgba(192,112,106,0.12)"
      sidebarBg="#2d1a16"
      headerAccent="#c0706a"
      logoutHref="/customer/login"
      userInitial="C"
    >
      {children}
    </DashboardShell>
  );
}
