/**
 * Central, editable brand + contact configuration.
 * Nothing here may be invented: every value is either CONFIRMED from Atlas's own
 * published listings, or null (and the UI then renders nothing).
 * See doc/atlas-company-research.md.
 *
 * Contact details can be overridden without touching code (see .env.example):
 *   NEXT_PUBLIC_CONTACT_PHONE, NEXT_PUBLIC_CONTACT_PHONE_DISPLAY, NEXT_PUBLIC_CONTACT_EMAIL,
 *   NEXT_PUBLIC_WHATSAPP_NUMBER, NEXT_PUBLIC_WHATSAPP_CONFIRMED
 */
const phoneE164 = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+250782351635";

export const site = {
  name: "Atlas EV Motors",
  shortName: "Atlas",
  city: "Kigali",
  country: "Rwanda",
  tagline: "Move differently. Live electric.",
  /** Atlas's own sign-off line from its listings (kept as an optional footer line). */
  signOff: "Go Green. Go Smart. Go Electric.",

  /** CONFIRMED: identical across every Atlas listing post. */
  phone: {
    display: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY ?? "+250 782 351 635",
    e164: phoneE164,
  },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "atlasevmotors@gmail.com",

  /**
   * WhatsApp. The number defaults to the confirmed phone number, but that it is
   * actually reachable on WhatsApp is NOT confirmed — client to confirm.
   * Digits only, with country code, no "+".
   */
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? phoneE164.replace(/\D/g, ""),
    confirmed: process.env.NEXT_PUBLIC_WHATSAPP_CONFIRMED === "true",
  },

  /** Not verified anywhere: render nothing until the client supplies them. */
  address: null as string | null,
  social: {} as Record<string, string>,
  founder: null as string | null,

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const nav = [
  { label: "Discover", href: "/#discover" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Electric Mobility", href: "/electric-mobility" },
  { label: "About", href: "/about" },
] as const;
