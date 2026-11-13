import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { vehicleName, type Vehicle } from "@/data/vehicles";
import { formatRWF } from "@/lib/format";
import { RidgeEdge } from "@/components/ui/Ridge";
import { Reveal } from "@/components/motion/Reveal";

/** The rest of the range, as plain links. Not a card grid: a name, two facts, an arrow. */
export function MoreVehicles({ others }: { others: Vehicle[] }) {
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="more-heading" className="relative bg-warm-grey text-forest">
      <RidgeEdge className="text-warm-grey" />
      <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(4rem,7vw,7rem)]">
        <Reveal>
          <p className="t-label flex items-center gap-4 text-moss">
            <span className="block h-px w-10 bg-moss/60" aria-hidden="true" />
            <span id="more-heading">Also from Atlas</span>
          </p>
        </Reveal>
        <ul className="mt-8 border-t border-forest/25">
          {others.map((v) => (
            <li key={v.slug} className="border-b border-forest/25">
              <Link
                href={`/vehicles/${v.slug}`}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-6 transition-[padding,color] duration-500 hover:pl-3 hover:text-laterite-600 focus-visible:pl-3 focus-visible:text-laterite-600 md:grid-cols-[6rem_1fr_auto_auto_2rem] md:py-8"
              >
                <span className="t-label hidden text-[0.64rem] text-moss md:block">{v.year}</span>
                <span className="t-display col-span-1 text-[clamp(1.9rem,3.6vw,3.25rem)]">
                  {vehicleName(v)}
                  <span className="t-label ml-3 align-middle text-[0.6rem] text-moss md:hidden">{v.year}</span>
                </span>
                <span className="t-label order-3 col-span-2 text-[0.64rem] text-moss md:order-none md:col-span-1">
                  {v.specs.range?.verified && <>Up to {v.specs.range.value} km · </>}
                  {v.price?.show ? formatRWF(v.price.amount) : "Enquire for price"}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="h-5 w-5 justify-self-end md:col-start-5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
