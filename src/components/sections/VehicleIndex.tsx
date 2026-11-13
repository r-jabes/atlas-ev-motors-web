"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { availabilityLabel, vehicles, vehicleName, type Vehicle } from "@/data/vehicles";
import { formatRWF } from "@/lib/format";
import { RidgeEdge } from "@/components/ui/Ridge";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Filters earn their place only once the catalogue is big enough (design doc §7). */
const FILTER_THRESHOLD = 6;

const FINE = "(hover: hover) and (pointer: fine)";
const subscribeFine = (cb: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

function Preview({ vehicle }: { vehicle: Vehicle }) {
  const photo = vehicle.gallery[0];
  return (
    <div className="ridge-mask-top relative aspect-[4/3] w-full overflow-hidden bg-forest">
      {photo ? (
        <PhotoFrame image={photo.image} sizes="340px" quality={60} tagClassName="bottom-2 left-2" />
      ) : (
        <div className="absolute inset-0 flex items-end bg-warm-grey p-4">
          <p className="t-label text-[0.6rem] leading-relaxed text-moss">
            Photography of this vehicle
            <br />
            will be added
          </p>
        </div>
      )}
      <span className="t-label absolute right-0 top-[12%] bg-laterite-600 px-2.5 py-1.5 text-[0.6rem] text-ivory">
        View
      </span>
    </div>
  );
}

export function VehicleIndex({ standalone = false }: { standalone?: boolean }) {
  const reduce = useReducedMotion();
  const fine = useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE).matches,
    () => false,
  );
  const follow = fine && !reduce;

  const listRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [make, setMake] = useState<string>("All");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  const makes = ["All", ...Array.from(new Set(vehicles.map((v) => v.make)))];
  const showFilters = vehicles.length >= FILTER_THRESHOLD;
  const shown = vehicles.filter((v) => make === "All" || v.make === make);

  const place = (e: PointerEvent, jump = false) => {
    const el = listRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const half = Math.min(170, r.width * 0.11);
    const nx = Math.max(half, Math.min(r.width - half, e.clientX - r.left));
    const ny = e.clientY - r.top;
    x.set(nx);
    y.set(ny);
    if (jump) {
      sx.jump(nx);
      sy.jump(ny);
    }
  };

  const Heading = standalone ? "h1" : "h2";
  const RowHeading = standalone ? "h2" : "h3";

  return (
    <section
      id="vehicles"
      aria-labelledby="vehicles-heading"
      className={cn("relative bg-ivory text-forest", standalone && "pt-[calc(var(--header-h)+clamp(2rem,5vw,5rem))]")}
    >
      {!standalone && <RidgeEdge className="text-ivory" />}

      <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] pb-[clamp(4.5rem,10vw,10rem)] pt-[clamp(4rem,8vw,8rem)]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal onMount={standalone}>
              <p className="t-label flex items-center gap-4 text-moss">
                <span className="block h-px w-10 bg-moss/60" aria-hidden="true" />
                Vehicles · {vehicles.length}
              </p>
            </Reveal>
            <Heading id="vehicles-heading" className="t-statement mt-7">
              <MaskLines lines={["The range"]} animateOnMount={standalone} />
            </Heading>
          </div>
          <Reveal delay={0.1} onMount={standalone} className="max-w-[26rem]">
            <p className="t-body text-charcoal">
              Every vehicle Atlas currently advertises, with its advertised range and price shown
              openly. Open one to see more.
            </p>
          </Reveal>
        </div>

        {showFilters && (
          <div role="group" aria-label="Filter by make" className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {makes.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={make === m}
                onClick={() => setMake(m)}
                className={cn(
                  "t-label border-b-2 py-1.5 text-[0.7rem] tracking-[0.14em] transition-colors",
                  make === m ? "border-laterite-600 text-forest" : "border-transparent text-moss hover:text-forest",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        <div
          ref={listRef}
          className="relative mt-[clamp(2.5rem,6vw,5rem)]"
          onPointerEnter={(e) => place(e, true)}
          onPointerMove={(e) => place(e)}
          onPointerLeave={() => setHover(null)}
        >
          <ul className="border-t border-forest/20">
            {shown.map((v, i) => (
              <li key={v.slug} className="border-b border-forest/20">
                <Reveal y={20} delay={i * 0.06}>
                  <Link
                    href={`/vehicles/${v.slug}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
                    className="group relative isolate block py-7 transition-colors duration-500 hover:text-ivory focus-visible:text-ivory md:py-9"
                  >
                    {/* hover / focus wipe */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 -inset-x-[var(--page-gutter)] -z-10 origin-bottom scale-y-0 bg-forest transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                    />
                    <div className="grid grid-cols-2 items-end gap-x-6 gap-y-5 xl:grid-cols-[5.5rem_minmax(0,1fr)_9rem_15rem_8rem] xl:items-center">
                      <p className="t-label col-span-2 text-[0.68rem] text-moss transition-colors duration-500 group-hover:text-sage group-focus-visible:text-sage xl:col-span-1">
                        {v.year}
                        <span className="xl:hidden">
                          {" "}
                          · {v.category} · {v.powertrain}
                        </span>
                      </p>

                      <RowHeading className="t-display col-span-2 text-[clamp(2.4rem,4.2vw,4.75rem)] xl:col-span-1">
                        {vehicleName(v)}
                        <span className="t-label mt-3 hidden text-[0.64rem] text-moss transition-colors duration-500 group-hover:text-sage group-focus-visible:text-sage xl:block">
                          {v.category} · {v.powertrain}
                        </span>
                      </RowHeading>

                      <div>
                        <p className="t-label text-[0.6rem] text-moss transition-colors duration-500 group-hover:text-sage group-focus-visible:text-sage">
                          Advertised range
                        </p>
                        <p className="t-numeral mt-1 text-[1.35rem]">
                          {v.specs.range?.verified ? (
                            <>
                              {v.specs.range.value}
                              <span className="t-label ml-1.5 text-[0.65rem]">KM</span>
                            </>
                          ) : (
                            "—"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="t-label text-[0.6rem] text-moss transition-colors duration-500 group-hover:text-sage group-focus-visible:text-sage">
                          {v.price?.show ? `Advertised price · ${v.price.asOf}` : "Price"}
                        </p>
                        <p className="t-numeral mt-1 text-[1.35rem]">
                          {v.price?.show ? (
                            <>
                              {formatRWF(v.price.amount)}
                            </>
                          ) : (
                            "On request"
                          )}
                        </p>
                      </div>

                      <p className="t-label col-span-2 flex items-center justify-between gap-3 text-[0.64rem] xl:col-span-1 xl:justify-end">
                        <span className="flex items-center gap-2">
                          <span aria-hidden="true" className="block h-1.5 w-1.5 bg-laterite-600 group-hover:bg-laterite-400" />
                          {availabilityLabel[v.availability]}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="h-5 w-5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-1 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-1"
                        />
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          {/* Cursor-following preview: fine pointers only; nothing here is required information */}
          {follow && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-30 w-[clamp(220px,22vw,340px)]"
              style={{ x: sx, y: sy, translateX: "-50%", translateY: "-55%" }}
            >
              <AnimatePresence mode="wait">
                {hover !== null && shown[hover] && (
                  <motion.div
                    key={shown[hover].slug}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.28, ease: EASE }}
                  >
                    <Preview vehicle={shown[hover]} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <p className="mt-8 max-w-[52ch] text-[0.85rem] leading-relaxed text-moss">
          Ranges and prices are as advertised by Atlas EV Motors and may have changed. Real-world
          range varies with driving conditions. Enquire to confirm availability.
        </p>
      </div>
    </section>
  );
}
