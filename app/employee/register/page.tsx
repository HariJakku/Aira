import RegisterPage from "@/components/auth/RegisterPage";
import { Users } from "lucide-react";

export default function EmployeeRegisterPage() {
  return (
    <RegisterPage
      portalName="Employee"
      role="employee"
      accentColor="#8B7355"
      loginHref="/employee/login"
      dashboardPath="/employee/dashboard"
      iconBg="rgba(139,115,85,0.1)"
      icon={<Users size={22} color="#8B7355" />}
    />
  );
}