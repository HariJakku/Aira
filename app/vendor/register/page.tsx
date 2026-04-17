import RegisterPage from "@/components/auth/RegisterPage";
import { Package } from "lucide-react";

export default function VendorRegisterPage() {
  return (
    <RegisterPage
      portalName="Vendor"
      role="vendor"
      accentColor="#3d7a5e"
      loginHref="/vendor/login"
      dashboardPath="/vendor/dashboard"
      iconBg="rgba(61,122,94,0.1)"
      icon={<Package size={22} color="#3d7a5e" />}
    />
  );
}