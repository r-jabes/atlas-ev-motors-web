import type { Metadata } from "next";
import { Suspense } from "react";
import { vehicles } from "@/data/vehicles";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Contact Atlas EV Motors in Kigali by WhatsApp, phone or email.",
};

/** Reads ?vehicle=<slug> so a vehicle page can send people here with that vehicle preselected. */
async function ContactWithPrefill({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { vehicle } = await searchParams;
  const slug = typeof vehicle === "string" && vehicles.some((v) => v.slug === vehicle) ? vehicle : undefined;
  return <ContactSection standalone defaultVehicle={slug} />;
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<ContactSection standalone />}>
      <ContactWithPrefill searchParams={searchParams} />
    </Suspense>
  );
}
