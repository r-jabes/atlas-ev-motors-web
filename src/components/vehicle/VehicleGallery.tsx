"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { needsIllustrativeLabel } from "@/data/images";
import { vehicleName, type GalleryItem, type Vehicle } from "@/data/vehicles";
import { whatsappLink } from "@/lib/whatsapp";
import { RidgeEdge } from "@/components/ui/Ridge";
import { IllustrativeTag } from "@/components/ui/IllustrativeTag";
import { Button } from "@/components/ui/Button";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

// The viewer is only fetched the first time someone opens it.
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

/** Keeps the subject in frame when a picture is cropped to the stage. */
const POSITION: Record<GalleryItem["slot"], string> = {
  hero: "50% 50%",
  exterior: "50% 55%",
  interior: "50% 50%",
  detail: "42% 55%",
  thumb: "50% 50%",
};

function Empty({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-8">
      <div className="col-span-12 lg:col-span-7">
        <h3 className="t-display text-[clamp(2rem,4.2vw,4rem)]">
          <MaskLines lines={["Photography of this", "vehicle will be added."]} />
        </h3>
      </div>
      <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
        <Reveal delay={0.1}>
          <p className="max-w-[34ch] text-[1.0625rem] leading-relaxed text-ivory/90">
            We do not show pictures of other cars in its place. Ask us for current photos of this one.
          </p>
          <div className="mt-7">
            <Button
              href={whatsappLink({ vehicle, ask: "Could you send me current photos?" })}
              variant="outline-light"
              external
            >
              Ask for photos
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Gallery({ vehicle, items }: { vehicle: Vehicle; items: GalleryItem[] }) {
  const reduce = useReducedMotion();
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const many = items.length > 1;
  const item = items[cur];
  const illustrative = items.some((i) => needsIllustrativeLabel(i.image));

  const goTo = (next: number, d?: number) => {
    if (next === cur) return;
    setDir(d ?? (next > cur ? 1 : -1));
    setPrev(cur);
    setStarted(true);
    setCur(next);
  };
  const step = (d: number) => goTo((cur + d + items.length) % items.length, d);

  const onKey = (e: KeyboardEvent) => {
    if (!many || open) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const pic = (it: GalleryItem, priority?: boolean) => (
    <Image
      src={it.image.src}
      alt={it.image.alt}
      fill
      sizes="(min-width: 1800px) 1700px, 100vw"
      quality={80}
      priority={priority}
      className="object-cover"
      style={{ objectPosition: POSITION[it.slot] }}
    />
  );

  return (
    <div role="group" aria-roledescription="carousel" aria-label={`${vehicleName(vehicle)} photographs`} onKeyDown={onKey}>
      {/* stage */}
      <motion.div
        className="ridge-mask-top relative aspect-[4/3] w-full touch-pan-y overflow-hidden bg-forest md:aspect-[16/9] md:max-h-[78svh]"
        drag={many ? "x" : false}
        dragSnapToOrigin
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 || info.velocity.x < -450) step(1);
          else if (info.offset.x > 60 || info.velocity.x > 450) step(-1);
        }}
      >
        {prev !== null && (
          <div className="absolute inset-0" aria-hidden="true">
            {pic(items[prev])}
          </div>
        )}
        <motion.div
          key={cur}
          className="absolute inset-0"
          initial={started && !reduce ? { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" } : false}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: reduce ? 0 : 0.95, ease: EASE }}
          onAnimationComplete={() => setPrev(null)}
        >
          <motion.div
            className="absolute inset-0"
            initial={started && !reduce ? { scale: 1.12 } : false}
            animate={{ scale: 1 }}
            transition={{ duration: reduce ? 0 : 1.4, ease: EASE }}
          >
            {pic(item, cur === 0)}
          </motion.div>
        </motion.div>
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        {needsIllustrativeLabel(item.image) && <IllustrativeTag className="bottom-3 left-3 md:bottom-4 md:left-4" />}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="t-label absolute bottom-3 right-3 z-30 inline-flex items-center gap-2.5 bg-forest/85 px-3.5 py-2.5 text-[0.62rem] text-ivory transition-colors hover:bg-ivory hover:text-forest focus-visible:bg-ivory focus-visible:text-forest md:bottom-4 md:right-4"
        >
          <Maximize2 aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5" />
          Full screen
        </button>
      </motion.div>

      {/* caption, counter, arrows */}
      <div className="mt-4 flex items-start justify-between gap-6 md:mt-5">
        <div className="min-h-[2.8em] max-w-[44ch]" aria-live="polite">
          <p className="t-label text-[0.64rem]">
            <span className="text-laterite-400">0{cur + 1}</span> / 0{items.length}
            <span className="ml-4 text-sage">{item.label}</span>
          </p>
          <p className="mt-2 text-[0.95rem] leading-snug text-ivory/90">{item.caption}</p>
        </div>
        {many && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photograph"
              className="border border-ivory/40 p-3 transition-colors hover:bg-ivory hover:text-forest focus-visible:bg-ivory focus-visible:text-forest"
            >
              <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photograph"
              className="border border-ivory/40 p-3 transition-colors hover:bg-ivory hover:text-forest focus-visible:bg-ivory focus-visible:text-forest"
            >
              <ChevronRight aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* thumbnails */}
      {many && (
        <ul className="mt-6 flex gap-3 overflow-x-auto pb-2 md:gap-4" aria-label="Choose a photograph">
          {items.map((it, i) => (
            <li key={`${it.slot}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${it.label.toLowerCase()} photograph ${i + 1} of ${items.length}`}
                aria-current={i === cur ? "true" : undefined}
                className="group block w-[clamp(5.5rem,13vw,9.5rem)] text-left"
              >
                <span
                  className={cn(
                    "relative block aspect-[4/3] overflow-hidden bg-forest transition-opacity duration-500",
                    i === cur ? "opacity-100" : "opacity-55 group-hover:opacity-90 group-focus-visible:opacity-90",
                  )}
                >
                  <Image
                    src={it.image.src}
                    alt=""
                    fill
                    sizes="160px"
                    quality={60}
                    className="object-cover"
                    style={{ objectPosition: POSITION[it.slot] }}
                  />
                </span>
                <span
                  className={cn(
                    "mt-2 block h-[2px] transition-colors duration-500",
                    i === cur ? "bg-laterite-400" : "bg-ivory/20",
                  )}
                />
                <span className="t-label mt-2 block text-[0.58rem] text-sage">{it.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {illustrative && (
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem] text-sage">
          These images are illustrative and do not show this exact vehicle. Photography of this vehicle will be
          added.
          <Button
            href={whatsappLink({ vehicle, ask: "Could you send me current photos?" })}
            variant="text-light"
            external
          >
            Ask for photos
          </Button>
        </p>
      )}

      {open && (
        <Lightbox
          items={items}
          index={cur}
          onIndex={(i) => goTo(i)}
          onClose={() => setOpen(false)}
          vehicleName={vehicleName(vehicle)}
        />
      )}
    </div>
  );
}

/**
 * Gallery section. Charcoal. Arrow keys work once focus is inside; on touch, swipe the stage.
 * With no photography the section says so plainly instead of borrowing another car's pictures.
 */
export function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const items = vehicle.gallery;
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="on-dark relative bg-charcoal text-ivory"
    >
      <RidgeEdge className="text-charcoal" />
      <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] pb-[clamp(4rem,9vw,8rem)] pt-[clamp(4rem,8vw,8rem)]">
        <Reveal>
          <p className="t-label flex items-center gap-4 text-sage">
            <span className="block h-px w-10 bg-sage/60" aria-hidden="true" />
            Gallery
          </p>
        </Reveal>
        <h2 id="gallery-heading" className="sr-only">
          {vehicleName(vehicle)} gallery
        </h2>
        <div className="mt-8 md:mt-10">{items.length ? <Gallery vehicle={vehicle} items={items} /> : <Empty vehicle={vehicle} />}</div>
      </div>
    </section>
  );
}
