import LoginPage from "@/components/auth/LoginPage";
import { Package } from "lucide-react";

export default function VendorLoginPage() {
  return (
    <LoginPage
      portalName="Vendor Portal"
      portalDescription="Sign in to manage products, assignments and orders."
      accentColor="#3d7a5e"
      dashboardPath="/vendor/dashboard"
      registerHref="/vendor/register"
      iconBg="rgba(61,122,94,0.1)"
      icon={<Package size={22} color="#3d7a5e" />}
    />
  );
}