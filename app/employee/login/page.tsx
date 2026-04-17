import LoginPage from "@/components/auth/LoginPage";
import { Users } from "lucide-react";

export default function EmployeeLoginPage() {
  return (
    <LoginPage
      portalName="Employee Portal"
      portalDescription="Sign in to manage orders, take requests and coordinate with vendors."
      accentColor="#8B7355"
      dashboardPath="/employee/dashboard"
      iconBg="rgba(139,115,85,0.1)"
      icon={<Users size={24} color="#8B7355" />}
    />
  );
}
