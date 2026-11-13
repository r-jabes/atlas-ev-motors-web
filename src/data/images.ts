/**
 * Image registry. `kind` drives the "Illustrative image" label automatically:
 *  - 'atlas'        genuine Atlas photography (no label)
 *  - 'stock'        licensed real photograph (label only if it contains a vehicle)
 *  - 'illustrative' generated/representative imagery (always labelled when it shows a vehicle)
 * Replacing a file with a genuine Atlas photo = change `kind` to 'atlas'; the label disappears.
 */
export type ImageKind = "atlas" | "stock" | "illustrative";

export interface SiteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: ImageKind;
  /** true when the picture shows a vehicle (so it must be labelled unless kind === 'atlas') */
  showsVehicle: boolean;
  credit?: string;
  licence?: string;
  sourceUrl?: string;
}

export const images = {
  hero: {
    src: "/images/lifestyle/hero-ridge-road.jpg",
    alt: "Illustrative image: a white electric SUV on a winding hillside road above misty green hills at sunrise.",
    width: 2560,
    height: 1440,
    kind: "illustrative",
    showsVehicle: true,
  },
  /** Portrait art direction of the hero for portrait viewports */
  heroPortrait: {
    src: "/images/lifestyle/hero-ridge-road-portrait.jpg",
    alt: "Illustrative image: a white electric SUV on a curving hillside road above misty green hills at sunrise.",
    width: 1170,
    height: 2080,
    kind: "illustrative",
    showsVehicle: true,
  },
  introVehicle: {
    src: "/images/lifestyle/intro-vehicle.jpg",
    alt: "Illustrative image: a dark-green electric SUV from the rear three-quarter, parked on red earth above misty terraced hills at sunrise.",
    width: 1200,
    height: 1500,
    kind: "illustrative",
    showsVehicle: true,
  },
  aboutDetail: {
    src: "/images/lifestyle/about-vehicle-detail.jpg",
    alt: "Illustrative image: close detail of a dark-green electric SUV's door handle and wing mirror at sunset, with soft hills behind.",
    width: 1200,
    height: 1500,
    kind: "illustrative",
    showsVehicle: true,
  },
  cityFirstLight: {
    src: "/images/lifestyle/city-first-light.jpg",
    alt: "Illustrative image: an electric SUV on a quiet hillside street at first light, jacaranda trees in bloom and hazy hills beyond.",
    width: 1920,
    height: 1080,
    kind: "illustrative",
    showsVehicle: true,
  },
  hillRoad: {
    src: "/images/lifestyle/hill-road.jpg",
    alt: "Illustrative image: a dark-green electric SUV on a red-earth road lined with eucalyptus, terraced hills in golden light behind.",
    width: 1920,
    height: 1080,
    kind: "illustrative",
    showsVehicle: true,
  },
  eveningCity: {
    src: "/images/lifestyle/evening-city.jpg",
    alt: "Illustrative image: an electric SUV on a curving hillside avenue at dusk, street lamps lit and city lights glowing in the distance.",
    width: 1920,
    height: 1080,
    kind: "illustrative",
    showsVehicle: true,
  },
  netaExterior: {
    src: "/images/vehicles/neta-u-400-2023/exterior-1.jpg",
    alt: "Illustrative image: a forest-green electric SUV in profile in front of a red-brick building with timber slats at golden hour.",
    width: 2400,
    height: 1350,
    kind: "illustrative",
    showsVehicle: true,
  },
  netaInterior: {
    src: "/images/interiors/neta-u-400-2023/interior-1.jpg",
    alt: "Illustrative image: a bright electric SUV cabin with ivory and green seats, a floating central screen and a view of green hills.",
    width: 2000,
    height: 1500,
    kind: "illustrative",
    showsVehicle: true,
  },
  netaDetail: {
    src: "/images/vehicles/neta-u-400-2023/detail-1.jpg",
    alt: "Illustrative image: close detail of an electric SUV's headlight and wheel on a red-earth road at sunset.",
    width: 1536,
    height: 2048,
    kind: "illustrative",
    showsVehicle: true,
  },
} satisfies Record<string, SiteImage>;

/** Whether the "Illustrative image" label must be shown for this image. */
export const needsIllustrativeLabel = (img: SiteImage) =>
  img.showsVehicle && img.kind !== "atlas";
