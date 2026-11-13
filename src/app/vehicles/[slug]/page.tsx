import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { vehicles, getVehicle, vehicleName, type Vehicle } from "@/data/vehicles";
import { site } from "@/data/site";
import { VehicleDetail } from "@/components/vehicle/VehicleDetail";

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) return {};
  return {
    title: `${v.year} ${vehicleName(v)}`,
    description: v.summary,
  };
}

/**
 * Structured data uses only facts that are verified. No images (they are illustrative), no price or availability
 * (both are advertised figures that may have changed): those are shown on the page, clearly labelled, not asserted
 * to search engines.
 */
function jsonLd(v: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${v.year} ${vehicleName(v)}`,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(v.year),
    bodyType: v.category,
    fuelType: v.powertrain === "Electric" ? "Electric" : v.powertrain,
    description: v.summary,
    seller: { "@type": "AutoDealer", name: site.name, areaServed: `${site.city}, ${site.country}` },
  };
}

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so the JSON can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(v)).replace(/</g, "\\u003c") }}
      />
      <VehicleDetail vehicle={v} others={vehicles.filter((x) => x.slug !== v.slug)} />
    </>
  );
}
