/**
 * Electric-mobility content.
 * RULES (doc/atlas-company-research.md §10): general education only, plain language,
 * written as "good to know" — never as an Atlas service, never with savings or emissions figures.
 */
export interface Chapter {
  word: string;
  /** Short explainer. */
  body: string;
  /** One honest, general fact. */
  fact: string;
}

export const chapters: Chapter[] = [
  {
    word: "Quiet",
    body: "An electric motor has no engine note and far fewer moving parts. It delivers its pull smoothly, from a standstill.",
    fact: "Full pulling force is available from the first turn of the wheels, so acceleration feels immediate.",
  },
  {
    word: "Range",
    body: "Range is how far a full battery can take you. The advertised figure comes from a standardised test, and real roads rarely match it exactly.",
    fact: "Speed, load, hills and air-conditioning all change real-world range. Steady, moderate driving uses the least energy.",
  },
  {
    word: "Charging",
    body: "There are two broad kinds of charging. AC is slower and suits home or overnight use. DC fast charging is quicker and is mostly found along the road.",
    fact: "Which charge port and charging speeds a car accepts depends on the model. Ask before you buy.",
  },
  {
    word: "Every day",
    body: "Daily driving is mostly short trips. If you can charge where the car is parked, it can start each day with a full battery.",
    fact: "Regenerative braking returns a little energy every time you slow down. It helps most in stop-and-go traffic and on downhill roads.",
  },
];

/**
 * Approximate road distances from Kigali, rounded.
 * Verified 13 Nov 2026 against published road-distance tables:
 *  - WFP Logistics Cluster, Rwanda Logistics Capacity Assessment distance matrix:
 *    Musanze 94 km, Huye 133 km, Rubavu 156 km (lca.logcluster.org/print-preview/5044)
 *  - Travel guides quote 90–116 km (Musanze), 130–135 km (Huye), 150–160 km (Rubavu).
 * The rounded figures below sit inside every source's range; the UI labels them "approximate".
 */
export const trips = [
  { name: "Musanze", km: 95 },
  { name: "Huye", km: 135 },
  { name: "Rubavu", km: 155 },
] as const;
