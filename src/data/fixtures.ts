import { images } from "./images";
import type { Spec, Vehicle } from "./vehicles";

/**
 * DEV / QA ONLY. A made-up vehicle with every spec filled and a long gallery, used to prove the detail template
 * scales beyond today's three sparse listings. Every number here is invented. It is rendered only by
 * /dev/full-spec, which returns 404 in production, and it is never part of `vehicles`.
 */
const s = <T extends number | string>(value: T, unit?: string, note?: string): Spec<T> => ({
  value,
  unit,
  source: "client-confirmed",
  verified: true,
  note,
});

export const sampleFullVehicle: Vehicle = {
  slug: "sample-full-spec",
  make: "Sample",
  model: "Full Spec EV",
  year: 2025,
  category: "SUV",
  powertrain: "Electric",
  condition: "Used",
  availability: "available",
  price: { amount: 41_500_000, currency: "RWF", label: "Advertised price", asOf: "Sample data", show: true },
  summary:
    "A made-up listing used only to test that every part of the vehicle page holds up when all the data is present.",
  specs: {
    range: s(520, "km", "Advertised range"),
    batteryKwh: s(72.5, "kWh"),
    motorKw: s(150, "kW"),
    torqueNm: s(310, "N·m"),
    acceleration0to100: s(7.4, "s"),
    topSpeedKmh: s(170, "km/h"),
    fastChargeMinutes: s(28, "min", "10–80%, sample note"),
    slowChargeHours: s(9, "h"),
    chargePort: s("CCS2"),
    lengthMm: s(4785, "mm"),
    widthMm: s(1875, "mm"),
    heightMm: s(1640, "mm"),
    wheelbaseMm: s(2820, "mm"),
    seats: s(5),
    luggageL: s(540, "L"),
    curbWeightKg: s(1865, "kg"),
  },
  gallery: [
    { slot: "exterior", label: "Exterior", caption: "Sample caption for exterior one.", image: images.netaExterior },
    { slot: "exterior", label: "Exterior", caption: "Sample caption for exterior two.", image: images.hero },
    { slot: "interior", label: "Interior", caption: "Sample caption for interior one.", image: images.netaInterior },
    { slot: "detail", label: "Detail", caption: "Sample caption for a portrait detail.", image: images.netaDetail },
    { slot: "exterior", label: "Exterior", caption: "Sample caption for exterior three.", image: images.hillRoad },
    { slot: "exterior", label: "Exterior", caption: "Sample caption for exterior four.", image: images.eveningCity },
    { slot: "interior", label: "Interior", caption: "Sample caption for interior two.", image: images.netaInterior },
    { slot: "detail", label: "Detail", caption: "Sample caption for detail two.", image: images.aboutDetail },
  ],
};
