import { availabilityLabel, type Vehicle } from "@/data/vehicles";
import { RidgeEdge } from "@/components/ui/Ridge";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Overview. Ivory and calm: the Atlas listing line set large, with the plain facts beside it.
 * Copy comes only from Atlas's own listing (`vehicle.summary`).
 */
export function VehicleOverview({ vehicle }: { vehicle: Vehicle }) {
  const facts: { k: string; v: string }[] = [
    { k: "Model year", v: String(vehicle.year) },
    { k: "Body", v: vehicle.category },
    { k: "Powertrain", v: vehicle.powertrain },
    ...(vehicle.condition ? [{ k: "Condition", v: vehicle.condition }] : []),
    { k: "Availability", v: availabilityLabel[vehicle.availability] },
    ...(vehicle.price?.show ? [{ k: "Advertised", v: vehicle.price.asOf }] : []),
  ];

  return (
    <section id="overview" aria-labelledby="overview-heading" className="relative bg-ivory text-forest">
      <RidgeEdge className="text-ivory" />
      <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-x-6 gap-y-14 px-[var(--page-gutter)] pb-[clamp(4.5rem,10vw,9rem)] pt-[clamp(4rem,8vw,8rem)]">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <p className="t-label flex items-center gap-4 text-moss">
              <span className="block h-px w-10 bg-moss/60" aria-hidden="true" />
              Overview
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="overview-heading"
              className="t-display mt-7 max-w-[24ch] text-[clamp(1.9rem,3.6vw,3.5rem)] leading-[1.08]"
            >
              {vehicle.summary}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-label mt-8 text-[0.62rem] text-moss">Summary from Atlas&rsquo;s own listing</p>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
          <Reveal delay={0.1}>
            <dl className="border-t border-forest/20">
              {facts.map((f) => (
                <div
                  key={f.k}
                  className="grid grid-cols-[8rem_1fr] items-baseline gap-4 border-b border-forest/20 py-4"
                >
                  <dt className="t-label text-[0.62rem] text-moss">{f.k}</dt>
                  <dd className="text-[1.0625rem] leading-snug">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
