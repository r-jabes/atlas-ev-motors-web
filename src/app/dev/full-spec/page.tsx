import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { vehicles } from "@/data/vehicles";
import { sampleFullVehicle } from "@/data/fixtures";
import { VehicleDetail } from "@/components/vehicle/VehicleDetail";

export const metadata: Metadata = {
  title: "Template test (not public)",
  robots: { index: false, follow: false },
};

/** QA only: the vehicle template with every field filled. 404 in production builds. */
export default function FullSpecPreview() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_ENABLE_DEV_ROUTES !== "1") notFound();
  return <VehicleDetail vehicle={sampleFullVehicle} others={vehicles.slice(0, 2)} />;
}
