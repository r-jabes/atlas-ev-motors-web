import { vehicleName, type Vehicle } from "@/data/vehicles";
import { formatRWF } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { ContactSection } from "@/components/contact/ContactSection";
import { VehicleHero } from "./VehicleHero";
import { VehicleOverview } from "./VehicleOverview";
import { VehicleGallery } from "./VehicleGallery";
import { SpecSheet } from "./SpecSheet";
import { MoreVehicles } from "./MoreVehicles";
import { StickyEnquiry } from "./StickyEnquiry";

/**
 * The vehicle detail template: one component, any number of vehicles. Everything it shows comes from the
 * Vehicle record; it renders only what is verified and says plainly what is not yet available.
 */
export function VehicleDetail({ vehicle, others }: { vehicle: Vehicle; others: Vehicle[] }) {
  return (
    <>
      <VehicleHero vehicle={vehicle} />
      <VehicleOverview vehicle={vehicle} />
      <VehicleGallery vehicle={vehicle} />
      <SpecSheet vehicle={vehicle} />
      <MoreVehicles others={others} />
      <ContactSection defaultVehicle={vehicle.slug} />
      <StickyEnquiry
        name={`${vehicle.year} ${vehicleName(vehicle)}`}
        href={whatsappLink({ vehicle })}
        price={vehicle.price?.show ? `${vehicle.price.label} ${formatRWF(vehicle.price.amount)}` : undefined}
      />
    </>
  );
}
