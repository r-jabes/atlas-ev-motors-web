import { HomeHero } from "@/components/hero/HomeHero";
import { BrandIntro } from "@/components/sections/BrandIntro";
import { FeaturedVehicle } from "@/components/sections/FeaturedVehicle";
import { VehicleIndex } from "@/components/sections/VehicleIndex";
import { LifestyleStory } from "@/components/sections/LifestyleStory";
import { ElectricTeaser } from "@/components/sections/ElectricTeaser";
import { ContactSection } from "@/components/contact/ContactSection";
import { getFeatured } from "@/data/vehicles";

/**
 * The homepage tells the story and points to the depth. Each topic has exactly one home for its full
 * content: /vehicles, /electric-mobility, /about. Nothing here duplicates those pages.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <BrandIntro />
      <FeaturedVehicle vehicle={getFeatured()} />
      <VehicleIndex />
      <LifestyleStory />
      <ElectricTeaser />
      <ContactSection />
    </>
  );
}
