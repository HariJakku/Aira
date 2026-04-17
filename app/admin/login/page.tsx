import LoginPage from "@/components/auth/LoginPage";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <LoginPage
      portalName="Admin Portal"
      portalDescription="Full platform control — users, orders, vendors and analytics."
      accentColor="#3b5f8a"
      dashboardPath="/admin/dashboard"
      iconBg="rgba(59,95,138,0.1)"
      icon={<ShieldCheck size={24} color="#3b5f8a" />}
    />
  );
}
