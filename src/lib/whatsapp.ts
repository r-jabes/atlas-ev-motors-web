import { site } from "@/data/site";
import type { Vehicle } from "@/data/vehicles";
import { vehicleName } from "@/data/vehicles";

/** Builds a wa.me link with a prefilled message. Vehicle is included when given. */
export function whatsappLink(opts?: { vehicle?: Vehicle; name?: string; ask?: string }) {
  const parts: string[] = ["Hello Atlas EV Motors,"];
  if (opts?.vehicle) {
    const v = opts.vehicle;
    parts.push(`I'm interested in the ${v.year} ${vehicleName(v)}. ${opts.ask ?? "Is it available?"}`);
  } else {
    parts.push("I'd like to know more about your electric vehicles.");
  }
  if (opts?.name) parts.push(`My name is ${opts.name}.`);
  const text = encodeURIComponent(parts.join(" "));
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}
