"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { images, needsIllustrativeLabel, type SiteImage } from "@/data/images";
import { RidgeEdge } from "@/components/ui/Ridge";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { IllustrativeTag } from "@/components/ui/IllustrativeTag";
import { cn } from "@/lib/cn";

interface Scene {
  n: string;
  title: string;
  line: string;
  image: SiteImage;
  /** keeps the vehicle in frame when a 16:9 picture is cropped to a phone */
  position: string;
}

/** Evocative titles, not factual claims. Every scene is an illustrative image and is labelled as one. */
const scenes: Scene[] = [
  {
    n: "01",
    title: "First light in the city",
    line: "The city before the traffic.",
    image: images.cityFirstLight,
    position: "65% 50%",
  },
  {
    n: "02",
    title: "The hill road",
    line: "Where the tarmac ends.",
    image: images.hillRoad,
    position: "43% 50%",
  },
  {
    n: "03",
    title: "Evening in the city",
    line: "The hills, lit.",
    image: images.eveningCity,
    position: "33% 50%",
  },
];

const N = scenes.length;
/** How far (in svh) each rising scene overshoots the top, so its ridge-shaped edge leaves the screen. */
const OVER = 14;
const EASE = "cubic-bezier(0.16,1,0.3,1)";

/** Scroll window in which scene i (i >= 1) rises over the previous one. */
const windowFor = (i: number): [number, number] => {
  const b = i / N;
  return [b - 0.1, b + 0.04];
};

function Heading({ className, note = true }: { className?: string; note?: boolean }) {
  return (
    <div className={className}>
      <p className="t-label flex items-center gap-4 text-ivory/90">
        <span className="block h-px w-8 bg-ivory/60" aria-hidden="true" />
        Life, electric
      </p>
      <h2 className="t-display mt-4 max-w-[12ch] text-[clamp(2.25rem,4.8vw,4.75rem)]">Roads worth taking.</h2>
      {note && (
        <p className="t-label mt-4 text-[0.6rem] text-ivory/80">
          Illustrative scenes, not Atlas vehicles or locations
        </p>
      )}
    </div>
  );
}

/** A scene that rises over the one before it. The picture itself stays still; only the ridge-shaped edge moves. */
function RisingScene({ scene, i, progress }: { scene: Scene; i: number; progress: MotionValue<number> }) {
  const [a, b] = windowFor(i);
  const t = useTransform(progress, [a, b], [0, 1], { clamp: true });
  const y = useTransform(t, (v) => `${100 - (100 + OVER) * v}svh`);
  const counter = useTransform(t, (v) => `${-(100 + OVER) + (100 + OVER) * v}svh`);
  return (
    <motion.div
      aria-hidden="true"
      className="ridge-mask-top absolute inset-x-0 top-0 overflow-hidden will-change-transform"
      style={{ height: `${100 + OVER}svh`, y }}
    >
      <motion.div className="absolute inset-x-0" style={{ top: `${OVER}svh`, height: "100svh", y: counter }}>
        <PhotoFrame image={scene.image} sizes="100vw" quality={75} hideTag objectPosition={scene.position} />
      </motion.div>
    </motion.div>
  );
}

/** Scene counter, title and line. All scenes stay in the DOM; only the active one is visible. */
function Captions({ active }: { active: number }) {
  return (
    <div className="relative min-h-[8.25rem] md:min-h-[10rem]">
      {scenes.map((s, i) => (
        <div
          key={s.n}
          className={cn(
            "absolute inset-x-0 bottom-0 transition-[opacity,transform] duration-700 max-md:bottom-auto max-md:top-0",
            i === active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{
            transitionTimingFunction: EASE,
            transform: i === active ? "none" : "translateY(16px)",
          }}
        >
          <p className="t-label text-[0.68rem] text-ivory">
            <span className="text-laterite-400">{s.n}</span> / 0{N}
          </p>
          <h3 className="t-display mt-3 text-[clamp(1.9rem,4.2vw,4rem)]">{s.title}</h3>
          <p className="mt-2 text-[1.0625rem] text-ivory/90">{s.line}</p>
        </div>
      ))}
    </div>
  );
}

function Pinned() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const zoom = useTransform(p, [0, 1], [1, 1.07]);

  useMotionValueEvent(p, "change", (v) => {
    let next = 0;
    for (let i = 1; i < N; i++) if (v >= i / N - 0.03) next = i;
    setActive((cur) => (cur === next ? cur : next));
  });

  return (
    <div ref={wrap} className="relative h-[320svh] md:h-[380svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-charcoal">
        <motion.div className="absolute inset-0 origin-center" style={{ scale: zoom }}>
          <div className="absolute inset-0" aria-hidden="true">
            <PhotoFrame
              image={scenes[0].image}
              sizes="100vw"
              quality={75}
              hideTag
              objectPosition={scenes[0].position}
            />
          </div>
          {scenes.slice(1).map((s, k) => (
            <RisingScene key={s.n} scene={s} i={k + 1} progress={p} />
          ))}
        </motion.div>

        {/* legibility */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[58svh] bg-gradient-to-b md:h-[38svh] from-charcoal/65 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[52svh] bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-x-[var(--page-gutter)] top-[calc(var(--header-h)+clamp(1rem,4svh,3rem))]">
          <Heading note={false} />
          {/* phones: the caption sits under the headline, so it never covers the vehicle */}
          <div className="mt-[clamp(1.25rem,3.5svh,2rem)] md:hidden">
            <Captions active={active} />
          </div>
        </div>

        <div className="absolute inset-x-[var(--page-gutter)] bottom-[clamp(1.5rem,5svh,3.5rem)] flex items-end justify-between gap-8">
          <div className="hidden w-full max-w-[34rem] md:block">
            <Captions active={active} />
          </div>
          <div className="md:hidden" />

          {/* progress ticks (decorative; the counter above carries the information) */}
          <div className="flex shrink-0 flex-col items-end gap-3 pb-1">
            <p className="t-label hidden text-right text-[0.6rem] text-ivory/90 md:block">
              Illustrative scenes, not Atlas vehicles or locations
            </p>
            <p className="sr-only">Illustrative scenes, not Atlas vehicles or locations.</p>
            <div className="flex gap-2" aria-hidden="true">
              {scenes.map((s, i) => (
                <span
                  key={s.n}
                  className={cn(
                    "block h-[2px] w-8 transition-colors duration-500 md:w-14",
                    i === active ? "bg-laterite-400" : "bg-ivory/35",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {needsIllustrativeLabel(scenes[active].image) && (
          <IllustrativeTag className="bottom-auto left-auto right-[var(--page-gutter)] top-[calc(var(--header-h)+clamp(1rem,4svh,3rem))]" />
        )}
      </div>
    </div>
  );
}

/** Reduced motion: no pinning, no curtain. The same three scenes, one under the other. */
function Stacked() {
  return (
    <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] pb-[clamp(4rem,8vw,8rem)] pt-[clamp(4rem,8vw,8rem)]">
      <Heading className="max-w-[44rem]" />
      <div className="mt-[clamp(2.5rem,5vw,4rem)] space-y-[clamp(3rem,7vw,6rem)]">
        {scenes.map((s) => (
          <figure key={s.n}>
            <div className="ridge-mask-top relative aspect-[16/10] w-full overflow-hidden bg-forest md:aspect-[16/8]">
              <PhotoFrame image={s.image} sizes="100vw" quality={75} objectPosition={s.position} />
            </div>
            <figcaption className="mt-4 flex items-baseline gap-4">
              <span className="t-label text-[0.62rem] text-laterite-400">{s.n}</span>
              <span>
                <span className="t-label block text-[0.7rem] tracking-[0.14em]">{s.title}</span>
                <span className="mt-1 block text-[0.95rem] text-muted-dark">{s.line}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function LifestyleStory() {
  const reduce = useReducedMotion();
  return (
    <section
      id="lifestyle"
      aria-label="Life, electric: scenes from the road"
      className="on-dark relative bg-charcoal text-ivory"
    >
      <RidgeEdge className="text-charcoal" />
      {reduce ? <Stacked /> : <Pinned />}
    </section>
  );
}
