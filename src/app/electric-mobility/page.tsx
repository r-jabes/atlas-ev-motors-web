import type { Metadata } from "next";
import { ElectricMobility } from "@/components/sections/ElectricMobility";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Electric Mobility",
  description:
    "Plain-language notes on range, charging and everyday electric driving, plus a simple trip-against-range guide from Kigali.",
};

export default function ElectricMobilityPage() {
  return (
    <>
      <ElectricMobility standalone />
      <ContactSection />
    </>
  );
}
