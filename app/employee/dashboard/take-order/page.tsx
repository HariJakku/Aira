import TakeOrderForm from "@/components/forms/TakeOrderForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take Order – AIRA Employee",
};

export default function TakeOrderPage() {
  return <TakeOrderForm />;
}
