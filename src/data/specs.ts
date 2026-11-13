import type { Spec, Vehicle } from "./vehicles";

/**
 * How a vehicle's specifications are grouped and presented.
 * The UI renders a spec only when `verified === true` (see vehicles.ts). A group with no verified
 * value is not drawn; it is listed once, quietly, as "being confirmed". Nothing is ever guessed.
 */
type SpecKey = keyof Vehicle["specs"];

export interface SpecDef {
  key: SpecKey;
  label: string;
  unit?: string;
  /** small word before the numeral, e.g. "up to" */
  lead?: string;
}

export interface SpecGroup {
  id: string;
  title: string;
  defs: SpecDef[];
}

export const SPEC_GROUPS: SpecGroup[] = [
  {
    id: "performance",
    title: "Performance",
    defs: [
      { key: "motorKw", label: "Motor output", unit: "kW" },
      { key: "torqueNm", label: "Torque", unit: "N·m" },
      { key: "acceleration0to100", label: "0–100 km/h", unit: "s" },
      { key: "topSpeedKmh", label: "Top speed", unit: "km/h" },
    ],
  },
  {
    id: "battery",
    title: "Battery",
    defs: [{ key: "batteryKwh", label: "Battery capacity", unit: "kWh" }],
  },
  {
    id: "range-charging",
    title: "Range & charging",
    defs: [
      { key: "range", label: "Advertised range", unit: "km", lead: "up to" },
      { key: "fastChargeMinutes", label: "Fast charge", unit: "min" },
      { key: "slowChargeHours", label: "Slow charge", unit: "h" },
      { key: "chargePort", label: "Charge port" },
    ],
  },
  {
    id: "dimensions",
    title: "Dimensions & seating",
    defs: [
      { key: "lengthMm", label: "Length", unit: "mm" },
      { key: "widthMm", label: "Width", unit: "mm" },
      { key: "heightMm", label: "Height", unit: "mm" },
      { key: "wheelbaseMm", label: "Wheelbase", unit: "mm" },
      { key: "seats", label: "Seats" },
      { key: "luggageL", label: "Luggage", unit: "L" },
      { key: "curbWeightKg", label: "Kerb weight", unit: "kg" },
    ],
  },
];

export interface ShownSpec {
  def: SpecDef;
  spec: Spec<number | string>;
  /** a third-party reference figure (approved by the client) rather than an Atlas listing figure */
  reference: boolean;
}

export interface ShownGroup {
  group: SpecGroup;
  items: ShownSpec[];
}

/** Splits a vehicle's specs into the groups that can be shown and the groups still being confirmed. */
export function specGroups(v: Vehicle): { shown: ShownGroup[]; pending: SpecGroup[] } {
  const shown: ShownGroup[] = [];
  const pending: SpecGroup[] = [];
  for (const group of SPEC_GROUPS) {
    const items: ShownSpec[] = [];
    for (const def of group.defs) {
      const spec = v.specs[def.key] as Spec<number | string> | undefined;
      if (spec?.verified) items.push({ def, spec, reference: spec.source === "third-party-reference" });
    }
    if (items.length) shown.push({ group, items });
    else pending.push(group);
  }
  return { shown, pending };
}

/** "Performance, battery and dimensions & seating" */
export function listTitles(groups: SpecGroup[]): string {
  const t = groups.map((g, i) => (i === 0 ? g.title : g.title.toLowerCase()));
  if (t.length <= 1) return t[0] ?? "";
  return `${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}`;
}

/** 4530 -> "4,530"; 9.5 -> "9.5"; text stays text */
export function formatSpecValue(v: number | string): string {
  if (typeof v === "string") return v;
  const [int, dec] = v.toString().split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${grouped}.${dec}` : grouped;
}
