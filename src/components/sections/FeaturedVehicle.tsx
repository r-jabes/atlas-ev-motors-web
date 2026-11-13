"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { needsIllustrativeLabel } from "@/data/images";
import { vehicleName, type GalleryItem, type Vehicle } from "@/data/vehicles";
import { formatAmount } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { RidgeEdge } from "@/components/ui/Ridge";
import { Button } from "@/components/ui/Button";
import { IllustrativeTag } from "@/components/ui/IllustrativeTag";

const EASE = [0.16, 1, 0.3, 1] as const;
const WIPE_FROM = "inset(100% 0% 0% 0%)";
const WIPE_TO = "inset(0% 0% 0% 0%)";

/** Stage position for each photo so the subject survives the crop. */
const POSITION: Record<GalleryItem["slot"], string> = {
  hero: "50% 50%",
  exterior: "50% 55%",
  interior: "50% 50%",
  detail: "40% 55%",
  thumb: "50% 50%",
};

function Specs({ vehicle }: { vehicle: Vehicle }) {
  const range = vehicle.specs.range;
  return (
    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ivory/12 pt-5 md:mt-8 md:grid-cols-1 md:gap-0 md:gap-y-0 md:divide-y md:divide-ivory/12 md:border-y md:pt-0">
      <Row label="Model year">
        <span className="t-numeral text-[1.55rem] md:text-[2rem]">{vehicle.year}</span>
      </Row>
      <Row label="Category">
        <span className="t-numeral text-[1.55rem] md:text-[2rem]">
          {vehicle.powertrain === "Electric" ? "Electric" : vehicle.powertrain} {vehicle.category}
        </span>
      </Row>
      {range?.verified && (
        <Row label="Advertised range">
          <span className="t-numeral text-[1.55rem] md:text-[2rem]">
            <span className="t-label mr-2 align-middle text-[0.6rem] text-muted-dark">up to</span>
            {range.value}
            <span className="t-label ml-1.5 text-[0.65rem] text-muted-dark">{range.unit}</span>
          </span>
        </Row>
      )}
      {vehicle.price?.show && (
        <Row label={vehicle.price.label}>
          <span className="t-numeral text-[1.55rem] md:text-[2rem]">
            {formatAmount(vehicle.price.amount)}
            <span className="t-label ml-1.5 text-[0.65rem] text-muted-dark">
              {vehicle.price.currency}
            </span>
          </span>
        </Row>
      )}
    </dl>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="md:grid md:grid-cols-[1fr_auto] md:items-baseline md:gap-4 md:py-3.5">
      <dt className="t-label mb-1 text-[0.6rem] text-sage md:mb-0">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Copy({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="relative z-10">
      <p className="t-label flex items-center gap-4 text-sage">
        <span aria-hidden="true" className="block h-px w-8 bg-sage/60" />
        Featured vehicle
      </p>
      <h2 id="featured-heading" className="t-display mt-4 md:mt-5">
        {vehicleName(vehicle)}
      </h2>
      <Specs vehicle={vehicle} />
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-9">
        <Button href={whatsappLink({ vehicle })} variant="primary" external magnetic>
          Enquire now
        </Button>
        <Button href={`/vehicles/${vehicle.slug}`} variant="text-light">
          View details
        </Button>
      </div>
      <p className="mt-6 hidden max-w-[34ch] text-[0.8rem] leading-relaxed text-muted-dark md:block">
        {vehicle.price?.show ? `Advertised by Atlas EV Motors, ${vehicle.price.asOf}. ` : ""}
        Real-world range varies with driving conditions. Availability on enquiry.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pinned, scroll-driven version                                        */
/* ------------------------------------------------------------------ */
function Layer({
  item,
  clip,
  scale,
  eager,
}: {
  item: GalleryItem;
  clip?: MotionValue<string>;
  scale: MotionValue<number>;
  eager?: boolean;
}) {
  return (
    <motion.div className="absolute inset-0" style={clip ? { clipPath: clip } : undefined}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 768px) 58vw, 100vw"
          quality={75}
          priority={eager}
          className="object-cover"
          style={{ objectPosition: POSITION[item.slot] }}
        />
      </motion.div>
    </motion.div>
  );
}

function FeaturedPinned({ vehicle }: { vehicle: Vehicle }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = vehicle.gallery.slice(0, 3);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const clip1 = useTransform(p, [0.27, 0.43], [WIPE_FROM, WIPE_TO]);
  const clip2 = useTransform(p, [0.6, 0.76], [WIPE_FROM, WIPE_TO]);
  const s0 = useTransform(p, [0, 1], [1.02, 1.08]);
  const s1 = useTransform(p, [0.27, 0.6], [1.14, 1.02]);
  const s2 = useTransform(p, [0.6, 0.95], [1.14, 1.02]);
  const progress = useTransform(p, [0.05, 0.95], [0, 1]);

  useMotionValueEvent(p, "change", (v) => {
    const next = v < 0.36 ? 0 : v < 0.69 ? 1 : 2;
    setActive((cur) => (cur === next ? cur : Math.min(next, items.length - 1)));
  });

  const label = items.some((i) => needsIllustrativeLabel(i.image));
  const current = items[active] ?? items[0];

  return (
    <div ref={ref} className="relative h-[300svh] md:h-[340svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ghost model name: one oversized typographic element behind the picture */}
        <span
          aria-hidden="true"
          className="t-hero pointer-events-none absolute -bottom-[0.14em] -left-[0.04em] select-none whitespace-nowrap leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(241,240,233,0.1)] max-md:hidden"
        >
          {vehicle.model}
        </span>

        <div className="relative mx-auto grid h-full max-w-[1800px] grid-cols-12 items-center gap-x-6 px-[var(--page-gutter)] pb-4 pt-[calc(var(--header-h)+0.25rem)] max-md:content-start max-md:gap-y-4 md:pb-8">
          <div className="col-span-12 md:col-span-5 xl:col-span-4">
            <Copy vehicle={vehicle} />
          </div>

          <div className="col-span-12 max-md:order-first md:col-span-7 xl:col-span-8">
            <div className="ridge-mask-top relative h-[32svh] w-full overflow-hidden bg-forest md:h-[min(72svh,780px)]">
              <Layer item={items[0]} scale={s0} eager />
              {items[1] && <Layer item={items[1]} clip={clip1} scale={s1} />}
              {items[2] && <Layer item={items[2]} clip={clip2} scale={s2} />}
              {label && <IllustrativeTag className="bottom-3 left-3 md:bottom-4 md:left-4" />}
            </div>

            <div className="mt-3 flex items-start justify-between gap-6 md:mt-5">
              <div className="min-h-[2.6em] max-w-[34ch] max-md:hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="text-[0.95rem] leading-snug text-ivory/90"
                  >
                    {current?.caption}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="shrink-0 max-md:w-full">
                <ol className="flex gap-4 max-md:justify-between md:gap-5" aria-label="Views">
                  {items.map((it, i) => (
                    <li
                      key={it.slot}
                      aria-current={i === active ? "true" : undefined}
                      className={`t-label text-[0.6rem] transition-colors duration-500 ${
                        i === active ? "text-ivory" : "text-sage/70"
                      }`}
                    >
                      <span className="mr-1.5 text-laterite-400">0{i + 1}</span>
                      {it.label}
                    </li>
                  ))}
                </ol>
                <div className="mt-2 h-px w-full bg-ivory/15" aria-hidden="true">
                  <motion.div
                    className="h-full origin-left bg-laterite-400"
                    style={{ scaleX: progress }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reduced-motion version: no pinning, no morphing                      */
/* ------------------------------------------------------------------ */
function FeaturedStatic({ vehicle }: { vehicle: Vehicle }) {
  const items = vehicle.gallery.slice(0, 3);
  return (
    <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] py-[clamp(4rem,8vw,8rem)]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 md:col-span-5 xl:col-span-4">
          <Copy vehicle={vehicle} />
        </div>
        <div className="col-span-12 md:col-span-7 xl:col-span-8">
          <div className="ridge-mask-top relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={items[0].image.src}
              alt={items[0].image.alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
              style={{ objectPosition: POSITION[items[0].slot] }}
            />
            {needsIllustrativeLabel(items[0].image) && <IllustrativeTag />}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {items.slice(1).map((it) => (
              <figure key={it.slot}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={it.image.src}
                    alt={it.image.alt}
                    fill
                    sizes="(min-width: 768px) 28vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: POSITION[it.slot] }}
                  />
                  {needsIllustrativeLabel(it.image) && <IllustrativeTag />}
                </div>
                <figcaption className="mt-2 text-[0.9rem] text-ivory/85">{it.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedVehicle({ vehicle }: { vehicle: Vehicle }) {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="featured-heading"
      className="on-dark relative bg-forest text-ivory"
    >
      <RidgeEdge className="text-forest" />
      {reduce ? <FeaturedStatic vehicle={vehicle} /> : <FeaturedPinned vehicle={vehicle} />}
    </section>
  );
}