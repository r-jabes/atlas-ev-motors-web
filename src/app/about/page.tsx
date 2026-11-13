import type { Metadata } from "next";
import { AboutAtlas } from "@/components/sections/AboutAtlas";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "About",
  description: "About Atlas EV Motors, an electric vehicle business in Kigali, Rwanda.",
};

export default function AboutPage() {
  return (
    <>
      <AboutAtlas standalone />
      <ContactSection />
    </>
  );
}
