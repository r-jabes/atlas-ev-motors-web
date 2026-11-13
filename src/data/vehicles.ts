import { images, type SiteImage } from "./images";

/**
 * Centralised vehicle inventory.
 * Every spec is OPTIONAL and carries provenance; the UI renders a spec only when
 * `verified === true`. Add a vehicle = add an object here. Nothing else changes.
 */
export type Provenance = "atlas-listing" | "client-confirmed" | "third-party-reference";

export interface Spec<T = number> {
  value: T;
  unit?: string;
  source: Provenance;
  verified: boolean;
  note?: string;
}

export type Availability = "available" | "reserved" | "sold" | "enquire";

export const availabilityLabel: Record<Availability, string> = {
  enquire: "Enquire for availability",
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};
export type Category = "SUV" | "Sedan" | "Hatchback" | "Pickup" | "Van" | "Other";
export type Powertrain = "Electric" | "Plug-in hybrid" | "Hybrid";

export interface GalleryItem {
  slot: "hero" | "exterior" | "interior" | "detail" | "thumb";
  label: string;
  /** Short line — must come from Atlas's own listing or be a plain description of the picture. */
  caption?: string;
  image: SiteImage;
}

export interface Vehicle {
  slug: string;
  make: string;
  model: string;
  trim?: string;
  year: number;
  category: Category;
  powertrain: Powertrain;
  /** Omitted until the client confirms new / used. */
  condition?: "New" | "Used";
  availability: Availability;
  featured?: boolean;
  price?: {
    amount: number;
    currency: "RWF";
    label: "Advertised price";
    asOf: string; // when Atlas advertised it
    show: boolean;
  };
  /** Copy drawn ONLY from Atlas's own listing. */
  summary: string;
  specs: {
    range?: Spec;
    batteryKwh?: Spec;
    motorKw?: Spec;
    torqueNm?: Spec;
    acceleration0to100?: Spec;
    topSpeedKmh?: Spec;
    fastChargeMinutes?: Spec;
    slowChargeHours?: Spec;
    chargePort?: Spec<string>;
    lengthMm?: Spec;
    widthMm?: Spec;
    heightMm?: Spec;
    wheelbaseMm?: Spec;
    seats?: Spec;
    luggageL?: Spec;
    curbWeightKg?: Spec;
  };
  gallery: GalleryItem[];
  notices?: string[];
}

/**
 * A third-party reference figure (see doc/atlas-company-research.md §5). It is stored so the client can approve
 * it in one pass, but it is `verified: false`, so the UI never renders it until someone flips the flag.
 */
const reference = <T extends number | string>(value: T, unit?: string, note?: string): Spec<T> => ({
  value,
  unit,
  source: "third-party-reference",
  verified: false,
  note,
});

const advertised = (value: number, note = "Advertised range"): Spec => ({
  value,
  unit: "km",
  source: "atlas-listing",
  verified: true,
  note,
});

export const vehicles: Vehicle[] = [
  {
    slug: "neta-u-400-2023",
    make: "Neta",
    model: "U 400",
    year: 2023,
    category: "SUV",
    powertrain: "Electric",
    availability: "enquire",
    featured: true,
    price: {
      amount: 25_000_000,
      currency: "RWF",
      label: "Advertised price",
      asOf: "February 2026",
      show: true,
    },
    summary:
      "A fully electric SUV with a spacious cabin and modern digital features, listed by Atlas for city use and longer journeys.",
    specs: {
      range: advertised(400),
      // Third-party reference figures for the Neta U-II 400 (research §5), NOT supplied by Atlas and not yet
      // confirmed against the actual unit's trim. `verified: false` keeps every one of them off the site.
      // Length and kerb weight are omitted on purpose: the sources disagree.
      batteryKwh: reference(54.34, "kWh"),
      motorKw: reference(120, "kW"),
      torqueNm: reference(210, "N·m"),
      acceleration0to100: reference(9.5, "s"),
      topSpeedKmh: reference(150, "km/h"),
      fastChargeMinutes: reference(30, "min", "30–80%, as reported by the source"),
      slowChargeHours: reference(7, "h"),
      widthMm: reference(1860, "mm"),
      heightMm: reference(1628, "mm"),
      wheelbaseMm: reference(2770, "mm"),
      seats: reference(5),
      luggageL: reference(427, "L"),
    },
    gallery: [
      {
        slot: "exterior",
        label: "Exterior",
        caption: "A fully electric SUV, smart and spacious.",
        image: images.netaExterior,
      },
      {
        slot: "interior",
        label: "Interior",
        caption: "A spacious cabin with modern digital features.",
        image: images.netaInterior,
      },
      {
        slot: "detail",
        label: "Detail",
        caption: "A smooth electric drive with modern comfort.",
        image: images.netaDetail,
      },
    ],
    notices: [
      "Photography of this vehicle will be added. Ask us for current photos.",
    ],
  },
  {
    slug: "byd-yuan-plus-2022",
    make: "BYD",
    model: "Yuan Plus",
    year: 2022,
    category: "SUV",
    powertrain: "Electric",
    availability: "enquire",
    price: {
      amount: 28_000_000,
      currency: "RWF",
      label: "Advertised price",
      asOf: "February 2026",
      show: true,
    },
    summary:
      "A fully electric SUV with a spacious cabin and modern technology, listed by Atlas.",
    specs: { range: advertised(500) },
    gallery: [],
    notices: ["Photography of this vehicle will be added. Ask us for current photos."],
  },
  {
    slug: "byd-yuan-2019",
    make: "BYD",
    model: "Yuan",
    year: 2019,
    category: "SUV",
    powertrain: "Electric",
    availability: "enquire",
    price: {
      amount: 18_000_000,
      currency: "RWF",
      label: "Advertised price",
      asOf: "January 2026",
      show: true,
    },
    summary:
      "A fully electric SUV designed for efficient daily driving, listed by Atlas as an affordable way into electric.",
    specs: { range: advertised(300) },
    gallery: [],
    notices: ["Photography of this vehicle will be added. Ask us for current photos."],
  },
];

export const getVehicle = (slug: string) => vehicles.find((v) => v.slug === slug);
export const getFeatured = () => vehicles.find((v) => v.featured) ?? vehicles[0];
export const vehicleName = (v: Vehicle) => `${v.make} ${v.model}`;
