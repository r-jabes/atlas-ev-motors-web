import { images } from "@/data/images";
import { RidgeEdge } from "@/components/ui/Ridge";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Button } from "@/components/ui/Button";
import { WordReveal } from "@/components/motion/WordReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Drift } from "@/components/motion/Drift";

/**
 * 02 — Brand introduction. Ivory. The oversized statement and a ridge-masked photograph share
 * the first row on large screens; the text column is tucked beneath the statement, off-grid.
 * Copy uses only Atlas-confirmed statements (see doc/atlas-company-research.md §10).
 */
export function BrandIntro() {
  return (
    <section id="discover" className="relative bg-ivory">
      <RidgeEdge className="text-ivory" />

      <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] pb-[clamp(5rem,12vw,12rem)] pt-[clamp(4rem,8vw,9rem)]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14 lg:gap-y-0">
          {/* Statement */}
          <div className="col-span-12 lg:col-span-8">
            <Reveal>
              <p className="t-label flex items-center gap-4 text-moss">
                <span className="block h-px w-10 bg-moss/60" aria-hidden="true" />
                Atlas EV Motors · Kigali
              </p>
            </Reveal>
            <WordReveal
              lines={["The road ahead", "is electric."]}
              className="t-statement mt-8 max-w-[14ch] md:max-w-none lg:text-[clamp(4rem,8.3vw,8.25rem)]"
            />
          </div>

          {/* Photograph — spans both rows on large screens */}
          <div className="order-last col-span-10 col-start-3 md:order-none md:col-span-6 md:col-start-7 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:-mt-[clamp(0rem,2vw,2rem)]">
            <Reveal y={40}>
              <figure>
                <div className="ridge-mask-top relative aspect-[4/5] w-full overflow-hidden bg-warm-grey">
                  <Drift className="absolute inset-0" from={36} to={-36}>
                    <PhotoFrame
                      image={images.introVehicle}
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 80vw"
                    />
                  </Drift>
                </div>
                <figcaption className="t-label mt-4 flex justify-between gap-4 text-[0.62rem] text-moss">
                  <span>Electric and hybrid vehicles</span>
                  <span>Kigali, Rwanda</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Text column */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-2 lg:row-start-2 lg:self-end lg:pb-12 md:row-start-2 md:-mt-4 lg:mt-0">
            <Reveal>
              <p className="t-body max-w-[30rem] text-charcoal">
                Atlas EV Motors puts electric and hybrid vehicles within reach in Kigali. A
                carefully selected range, prices shown openly, and a direct line to the people
                behind every vehicle.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
              <Button href="/vehicles" variant="text-dark">
                See the vehicles
              </Button>
              <Button href="/about" variant="text-dark">
                About Atlas
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
