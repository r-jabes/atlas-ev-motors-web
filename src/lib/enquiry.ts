import { site } from "@/data/site";
import { vehicles, vehicleName } from "@/data/vehicles";

export const CONTACT_METHODS = ["WhatsApp", "Phone call", "Email"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

/** Special values for the vehicle field, besides the vehicle slugs. */
export const VEHICLE_ADVICE = "advice";
export const VEHICLE_OTHER = "other";

export interface EnquiryValues {
  name: string;
  phone: string;
  email: string;
  vehicle: string; // slug | VEHICLE_ADVICE | VEHICLE_OTHER
  method: ContactMethod;
  message: string;
}

export type EnquiryErrors = Partial<Record<"name" | "phone" | "email", string>>;

export const emptyEnquiry = (vehicle = VEHICLE_ADVICE): EnquiryValues => ({
  name: "",
  phone: "",
  email: "",
  vehicle,
  method: "WhatsApp",
  message: "",
});

export function vehicleOptions() {
  return [
    { value: VEHICLE_ADVICE, label: "I'd like some advice" },
    ...vehicles.map((v) => ({ value: v.slug, label: `${v.year} ${vehicleName(v)}` })),
    { value: VEHICLE_OTHER, label: "A different vehicle" },
  ];
}

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const phoneOk = (s: string) => (s.match(/\d/g)?.length ?? 0) >= 7 && /^[\d\s()+.-]+$/.test(s);

/** Name and a phone number are required; email only when it is the preferred method (or when given). */
export function validateEnquiry(v: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!v.name.trim()) errors.name = "Please tell us your name.";
  if (!v.phone.trim()) errors.phone = "Please add a phone number.";
  else if (!phoneOk(v.phone.trim())) errors.phone = "That phone number doesn't look right.";
  if (v.method === "Email" && !v.email.trim()) errors.email = "Add your email so we can reply there.";
  else if (v.email.trim() && !emailOk(v.email.trim())) errors.email = "That email address doesn't look right.";
  return errors;
}

function vehicleLine(slug: string): string {
  if (slug === VEHICLE_ADVICE) return "I'd like some advice on which vehicle suits me.";
  if (slug === VEHICLE_OTHER) return "I'm asking about a different vehicle.";
  const v = vehicles.find((x) => x.slug === slug);
  return v ? `I'm interested in the ${v.year} ${vehicleName(v)}. Is it available?` : "";
}

export function composeEnquiry(v: EnquiryValues): string {
  const lines = ["Hello Atlas EV Motors,", vehicleLine(v.vehicle)];
  if (v.message.trim()) lines.push(v.message.trim());
  lines.push("", `Name: ${v.name.trim()}`, `Phone: ${v.phone.trim()}`);
  if (v.email.trim()) lines.push(`Email: ${v.email.trim()}`);
  lines.push(`Best way to reach me: ${v.method}`);
  return lines.filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n").trim();
}

export function enquiryWhatsAppUrl(v: EnquiryValues) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(composeEnquiry(v))}`;
}

export function enquiryMailtoUrl(v: EnquiryValues) {
  const subject = "Enquiry from the Atlas EV Motors website";
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composeEnquiry(v))}`;
}
