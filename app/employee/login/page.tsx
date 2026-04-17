import LoginPage from "@/components/auth/LoginPage";
import { Users } from "lucide-react";

export default function EmployeeLoginPage() {
  return (
    <LoginPage
      portalName="Employee Portal"
      portalDescription="Sign in to manage orders and coordinate deliveries."
      accentColor="#8B7355"
      dashboardPath="/employee/dashboard"
      registerHref="/employee/register"
      iconBg="rgba(139,115,85,0.1)"
      icon={<Users size={22} color="#8B7355" />}
    />
  );
}