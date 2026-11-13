import type { Metadata } from "next";
import { VehicleIndex } from "@/components/sections/VehicleIndex";

export const metadata: Metadata = {
  title: "Vehicles",
  description: "Electric vehicles advertised by Atlas EV Motors in Kigali, Rwanda.",
};

export default function VehiclesPage() {
  return <VehicleIndex standalone />;
}
