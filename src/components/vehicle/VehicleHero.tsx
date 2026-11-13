"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { needsIllustrativeLabel } from "@/data/images";
import { vehicleName, type Vehicle } from "@/data/vehicles";
import { formatAmount } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { IllustrativeTag } from "@/components/ui/IllustrativeTag";
import { Button } from "@/components/ui/Button";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Vehicle hero.
 *  - md and up: full-bleed photograph, name set large over it, range and price as numerals.
 *  - phones: the photograph sits in a 4:3 ridge-masked frame (a 16:9 picture cropped to a phone would cut the
 *    vehicle in half), with the name and numerals on forest beneath it.
 *  - no photography yet: a typographic hero with an honest notice; nothing stands in for the vehicle.
 */
export function VehicleHero({ vehicle }: { vehicle: Vehicle }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const photo = vehicle.gallery.find((g) => g.slot === "hero" || g.slot === "exterior");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const range = vehicle.specs.range;
  const price = vehicle.price?.show ? vehicle.price : undefined;

  return (
    <section
      id="vehicle-hero"
      ref={ref}
      aria-labelledby="vehicle-heading"
      className={cn(
        "on-dark relative isolate overflow-hidden bg-forest text-ivory",
        photo ? "xl:h-[100svh] xl:min-h-[640px]" : "xl:min-h-[82svh]",
      )}
    >
      {photo ? (
        <div className="relative mt-[var(--header-h)] aspect-[4/3] w-full md:aspect-[16/9] xl:absolute xl:inset-0 xl:mt-0 xl:aspect-auto">
          <div className="ridge-mask-top absolute inset-0 overflow-hidden xl:[clip-path:none]">
            <motion.div
              className="absolute -inset-y-[6%] inset-x-0 xl:inset-y-auto xl:-top-[3%] xl:h-[93%]"
              style={reduce ? undefined : { y }}
              initial={reduce ? false : { scale: 1.12 }}
              animate={{ scale: 1.02 }}
              transition={{ duration: 2.4, ease: EASE }}
            >
              <Image
                src={photo.image.src}
                alt={photo.image.alt}
                fill
                priority
                sizes="100vw"
                quality={80}
                className="object-cover"
                style={{ objectPosition: "50% 55%" }}
              />
            </motion.div>
            <div className="grain absolute inset-0" aria-hidden="true" />
          </div>
          {/* legibility for the type on large screens */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden bg-gradient-to-t from-forest via-forest/35 to-forest/10 xl:block"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 hidden h-[28%] bg-gradient-to-b from-forest/60 to-transparent xl:block"
          />
          {needsIllustrativeLabel(photo.image) && (
            <IllustrativeTag className="bottom-3 left-3 xl:bottom-auto xl:left-auto xl:right-[var(--page-gutter)] xl:top-[calc(var(--header-h)+0.75rem)]" />
          )}
        </div>
      ) : (
        <>
          <p className="t-label absolute right-[var(--page-gutter)] top-[calc(var(--header-h)+0.75rem)] border border-ivory/30 px-3 py-2 text-[0.6rem] text-ivory/85">
            Photography to be added
          </p>
        </>
      )}

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-[1800px] flex-col gap-8 px-[var(--page-gutter)] pb-[clamp(3.5rem,7vw,5.5rem)] pt-8",
          photo
            ? "xl:absolute xl:inset-x-0 xl:inset-y-0 xl:justify-between xl:pb-[clamp(3.5rem,8svh,6rem)] xl:pt-[calc(var(--header-h)+clamp(1.5rem,3vw,2.5rem))]"
            : "min-h-[82svh] justify-between pt-[calc(var(--header-h)+2.5rem)]",
        )}
      >
        {/* top: where we are and the name */}
        <div>
          <Link
            href="/vehicles"
            className="t-label group inline-flex items-center gap-3 text-[0.64rem] text-ivory/85 hover:text-ivory"
          >
            <ArrowLeft
              aria-hidden="true"
              strokeWidth={1.5}
              className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1"
            />
            All vehicles
          </Link>
          <p className="t-label mt-5 flex items-center gap-4 text-sage xl:text-ivory/90">
            <span aria-hidden="true" className="block h-px w-8 bg-sage/60" />
            {vehicle.year} · {vehicle.powertrain} {vehicle.category}
          </p>
          <h1
            id="vehicle-heading"
            className="t-hero mt-3 max-w-[14ch] text-[clamp(2.9rem,10.5vw,10.5rem)] leading-[0.9] xl:max-w-none"
          >
            <MaskLines lines={[vehicleName(vehicle)]} animateOnMount delay={0.15} />
          </h1>
        </div>

        {/* No photograph yet: the site's ridge line stands in for it (no other car is shown in its place).
            It lives in the flow, in the gap between the name and the figures, so it never crosses text. */}
        {!photo && (
          <div aria-hidden="true" className="min-h-[3.5rem] flex-1">
            <svg
              viewBox="0 0 1440 200"
              preserveAspectRatio="none"
              className="pointer-events-none h-full max-h-[26svh] min-h-[3.5rem] w-full"
              fill="none"
            >
              <path
                d="M0 150 C120 118 200 158 330 134 C470 108 540 60 690 96 C820 128 900 160 1030 118 C1160 78 1250 100 1330 126 C1380 140 1410 132 1440 122"
                stroke="rgba(185,194,179,0.3)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        )}

        {/* bottom: the advertised figures and the way in, in one row, clear of the vehicle */}
        <Reveal onMount delay={0.3}>
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
            <dl className="flex flex-wrap gap-x-12 gap-y-5">
              {range?.verified && (
                <div>
                  <dt className="t-label text-[0.6rem] text-ivory/85">Advertised range</dt>
                  <dd className="t-numeral mt-1 text-[clamp(1.9rem,3.6vw,3.25rem)] leading-none">
                    <span className="t-label mr-2 align-middle text-[0.6rem] text-ivory/85">up to</span>
                    {range.value}
                    <span className="t-label ml-1.5 text-[0.7rem] text-ivory/85">{range.unit}</span>
                  </dd>
                </div>
              )}
              {price && (
                <div>
                  <dt className="t-label text-[0.6rem] text-ivory/85">
                    {price.label} · {price.asOf}
                  </dt>
                  <dd className="t-numeral mt-1 text-[clamp(1.9rem,3.6vw,3.25rem)] leading-none">
                    {formatAmount(price.amount)}
                    <span className="t-label ml-1.5 text-[0.7rem] text-ivory/85">{price.currency}</span>
                  </dd>
                </div>
              )}
            </dl>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href={whatsappLink({ vehicle })} variant="primary" external magnetic>
                Enquire on WhatsApp
              </Button>
              <Button href="#specification" variant="text-light" arrow={false}>
                Specification
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}