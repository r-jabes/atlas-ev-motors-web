import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatSpecValue, listTitles, specGroups } from "@/data/specs";
import type { Vehicle } from "@/data/vehicles";
import { whatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { RidgeEdge } from "@/components/ui/Ridge";
import { MaskLines, Reveal } from "@/components/motion/Reveal";

/**
 * Specification sheet. One numeral per VERIFIED spec, grouped as Performance / Battery / Range & charging /
 * Dimensions & seating. Groups with no verified value are not drawn: they are named once, quietly, as being
 * confirmed. Third-party reference figures (only after client approval) carry a dagger and a footnote.
 */
export function SpecSheet({ vehicle }: { vehicle: Vehicle }) {
  const { shown, pending } = specGroups(vehicle);
  const hasReference = shown.some((g) => g.items.some((i) => i.reference));
  const hasRange = shown.some((g) => g.items.some((i) => i.def.key === "range"));

  return (
    <section
      id="specification"
      aria-labelledby="spec-heading"
      className="relative bg-ivory text-forest"
    >
      <RidgeEdge className="text-ivory" />
      <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] pb-[clamp(4rem,9vw,8rem)] pt-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <div className="col-span-12 lg:col-span-6">
            <Reveal>
              <p className="t-label flex items-center gap-4 text-moss">
                <span className="block h-px w-10 bg-moss/60" aria-hidden="true" />
                Specification
              </p>
            </Reveal>
            <h2 id="spec-heading" className="t-display mt-6 text-[clamp(2.4rem,5vw,4.75rem)]">
              <MaskLines lines={["The figures."]} />
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal delay={0.1}>
              <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-moss">
                Only figures that have been confirmed are shown here. Nothing is estimated.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4.5rem)] border-t border-forest/25">
          {shown.map(({ group, items }, gi) => (
            <div
              key={group.id}
              className="grid grid-cols-12 gap-x-6 gap-y-6 border-b border-forest/25 py-[clamp(2rem,4vw,3.5rem)]"
            >
              <div className="col-span-12 lg:col-span-4">
                <Reveal>
                  <p className="t-label text-[0.62rem] text-laterite-600">0{gi + 1}</p>
                  <h3 className="t-display mt-3 text-[clamp(1.75rem,2.6vw,2.5rem)]">{group.title}</h3>
                </Reveal>
              </div>

              <dl className="col-span-12 lg:col-span-7 lg:col-start-6">
                {items.map(({ def, spec, reference }, i) => (
                  <Reveal
                    key={def.key}
                    delay={i * 0.06}
                    className={
                      i === 0 ? "" : "border-t border-forest/15"
                    }
                  >
                    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-4 md:py-5">
                      <dt>
                        <span className="t-label text-[0.64rem] text-moss">{def.label}</span>
                        {spec.note && def.key !== "range" && (
                          <span className="mt-1 block max-w-[34ch] text-[0.8rem] leading-snug text-moss">
                            {spec.note}
                          </span>
                        )}
                      </dt>
                      <dd className="t-numeral text-right text-[clamp(2.25rem,4.6vw,4.25rem)] leading-none">
                        {def.lead && (
                          <span className="t-label mr-2 align-middle text-[0.62rem] text-moss">{def.lead}</span>
                        )}
                        <MaskLines lines={[formatSpecValue(spec.value)]} className="inline-block align-bottom" />
                        {(spec.unit ?? def.unit) && (
                          <span className="t-label ml-1.5 text-[0.7rem] text-moss">{spec.unit ?? def.unit}</span>
                        )}
                        {reference && (
                          <sup aria-label="reference figure" className="ml-1 text-[0.9rem] text-laterite-600">
                            †
                          </sup>
                        )}
                      </dd>
                    </div>
                  </Reveal>
                ))}
                {group.id === "range-charging" && hasRange && (
                  <Reveal>
                    <p className="mt-2 max-w-[52ch] text-[0.85rem] leading-relaxed text-moss">
                      Advertised range comes from a standardised test. Real-world range will be lower: speed,
                      load, hills and air-conditioning all matter.{" "}
                      <Link
                        href="/electric-mobility#trip-vs-range"
                        className="link-draw inline-flex items-center gap-1.5 text-forest"
                      >
                        Test a trip against it
                        <ArrowRight aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5" />
                      </Link>
                    </p>
                  </Reveal>
                )}
              </dl>
            </div>
          ))}

          {/* Groups with nothing verified: one quiet row, not a grid of empty boxes. */}
          {pending.length > 0 && (
            <Reveal>
              <div className="grid grid-cols-12 items-center gap-x-6 gap-y-5 border-b border-forest/25 py-[clamp(1.75rem,3vw,2.75rem)]">
                <p className="col-span-12 text-[1.0625rem] leading-relaxed text-charcoal lg:col-span-7 lg:col-start-1">
                  {listTitles(pending)} details for this vehicle are being confirmed.
                </p>
                <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:text-right">
                  <Button
                    href={whatsappLink({
                      vehicle,
                      ask: "Could you send me the full specification?",
                    })}
                    variant="text-dark"
                    external
                  >
                    Ask for the full specification
                  </Button>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {hasReference && (
          <p className="mt-6 max-w-[60ch] text-[0.8rem] leading-relaxed text-moss">
            † Reference figure from a published source. Confirm against the vehicle before relying on it.
          </p>
        )}
      </div>
    </section>
  );
}
