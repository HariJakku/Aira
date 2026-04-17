import RegisterPage from "@/components/auth/RegisterPage";
import { Heart } from "lucide-react";

export default function CustomerRegisterPage() {
  return (
    <RegisterPage
      portalName="Customer"
      role="customer"
      accentColor="#c0706a"
      loginHref="/customer/login"
      dashboardPath="/customer/dashboard"
      iconBg="rgba(192,112,106,0.1)"
      icon={<Heart size={22} color="#c0706a" />}
    />
  );
}