import LoginPage from "@/components/auth/LoginPage";
import { Heart } from "lucide-react";

export default function CustomerLoginPage() {
  return (
    <LoginPage
      portalName="Customer Portal"
      portalDescription="Sign in to browse and track your curated gift experiences."
      accentColor="#c0706a"
      dashboardPath="/customer/dashboard"
      registerHref="/customer/register"
      iconBg="rgba(192,112,106,0.1)"
      icon={<Heart size={22} color="#c0706a" />}
    />
  );
}