import LoginPage from "@/components/auth/LoginPage";
import { Package } from "lucide-react";

export default function VendorLoginPage() {
  return (
    <LoginPage
      portalName="Vendor Portal"
      portalDescription="Sign in to list products, receive assignments and fulfil orders."
      accentColor="#3d7a5e"
      dashboardPath="/vendor/dashboard"
      iconBg="rgba(61,122,94,0.1)"
      icon={<Package size={24} color="#3d7a5e" />}
    />
  );
}
