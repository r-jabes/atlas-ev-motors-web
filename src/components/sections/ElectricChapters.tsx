"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { chapters } from "@/data/mobility";
import { RidgeEdge } from "@/components/ui/Ridge";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const RIDGE =
  "M0 150 C120 118 200 158 330 134 C470 108 540 60 690 96 C820 128 900 160 1030 118 C1160 78 1250 100 1330 126 C1380 140 1410 132 1440 122";

function Ridge({ progress }: { progress?: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-x-0 top-[58%] h-[12svh] w-full md:top-[40%] md:h-[18svh]"
      fill="none"
    >
      <path d={RIDGE} stroke="rgba(185,194,179,0.22)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      {progress && (
        <motion.path
          d={RIDGE}
          stroke="#d9774f"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progress }}
        />
      )}
    </svg>
  );
}

function ChapterCopy({ i, active, className }: { i: number; active: boolean; className?: string }) {
  const c = chapters[i];
  return (
    <div
      className={cn("transition-[opacity,transform] duration-700", active ? "opacity-100" : "pointer-events-none opacity-0", className)}
      style={{
        transitionTimingFunction: EASE,
        transform: active ? "none" : "translateY(14px)",
      }}
    >
      <p className="text-[1.0625rem] leading-relaxed text-ivory/90 md:text-[1.125rem]">{c.body}</p>
      <div className="mt-6 border-t border-ivory/20 pt-4">
        <p className="t-label text-[0.6rem] text-laterite-400">Good to know</p>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-dark">{c.fact}</p>
      </div>
    </div>
  );
}

function Pinned({ Word }: { Word: "h2" | "h3" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(p, [0.04, 0.96], [0, 1]);
  const n = chapters.length;

  useMotionValueEvent(p, "change", (v) => {
    const next = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((cur) => (cur === next ? cur : next));
  });

  return (
    <div ref={ref} className="relative h-[340svh] md:h-[420svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Ridge progress={progress} />

        <div className="relative mx-auto flex h-full max-w-[1800px] flex-col justify-between px-[var(--page-gutter)] pb-[clamp(1.5rem,4vh,3rem)] pt-[calc(var(--header-h)+clamp(0.75rem,3vh,2.5rem))]">
          {/* top row: label + counter, copy at right on desktop */}
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 md:col-span-5">
              <p className="t-label flex items-center gap-4 text-sage">
                <span className="block h-px w-8 bg-sage/60" aria-hidden="true" />
                Electric mobility
                <span className="ml-auto text-ivory md:ml-6" aria-hidden="true">
                  <span className="text-laterite-400">0{active + 1}</span> / 0{n}
                </span>
              </p>
            </div>
            <div className="relative col-span-12 mt-6 min-h-[17rem] md:col-span-5 md:col-start-8 md:mt-0 md:min-h-[19rem] xl:col-span-4 xl:col-start-9">
              {chapters.map((c, i) => (
                <ChapterCopy
                  key={c.word}
                  i={i}
                  active={i === active}
                  className="absolute inset-x-0 top-0"
                />
              ))}
            </div>
          </div>

          {/* giant word */}
          <div className="relative">
            {chapters.map((c, i) => (
              <div
                key={c.word}
                className={cn("overflow-hidden", i === 0 ? "relative" : "absolute inset-x-0 bottom-0")}
              >
                <Word
                  className="t-hero block whitespace-nowrap pb-[0.06em] text-[clamp(3.6rem,22vw,24rem)] leading-[0.86] transition-transform duration-[900ms]"
                  style={{
                    transitionTimingFunction: EASE,
                    transform: i === active ? "translateY(0)" : i < active ? "translateY(-105%)" : "translateY(105%)",
                  }}
                >
                  {c.word}
                </Word>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reduced motion: no pinning, no morphing. Every chapter is simply readable in order. */
function Static({ standalone, Word }: { standalone: boolean; Word: "h2" | "h3" }) {
  return (
    <div className={cn("mx-auto max-w-[1800px] px-[var(--page-gutter)] pb-[clamp(4rem,8vw,8rem)]",
        standalone ? "pt-[clamp(1.5rem,4vw,3rem)]" : "pt-[calc(var(--header-h)+2rem)]",
      )}>
      <p className="t-label flex items-center gap-4 text-sage">
        <span className="block h-px w-8 bg-sage/60" aria-hidden="true" />
        Electric mobility
      </p>
      <ol className="mt-10 divide-y divide-ivory/15 border-y border-ivory/15">
        {chapters.map((c, i) => (
          <li key={c.word} className="grid grid-cols-12 gap-x-6 gap-y-6 py-10 md:py-14">
            <Word className="t-hero col-span-12 text-[clamp(3rem,11vw,9rem)] md:col-span-7">{c.word}</Word>
            <div className="col-span-12 md:col-span-5 xl:col-span-4 xl:col-start-9">
              <p className="t-label mb-4 text-[0.6rem] text-laterite-400">0{i + 1}</p>
              <p className="text-[1.0625rem] leading-relaxed text-ivory/90">{c.body}</p>
              <div className="mt-6 border-t border-ivory/20 pt-4">
                <p className="t-label text-[0.6rem] text-laterite-400">Good to know</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-dark">{c.fact}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ElectricChapters({ standalone = false }: { standalone?: boolean }) {
  const reduce = useReducedMotion();
  const Heading = standalone ? "h1" : "h2";
  const Word = standalone ? "h2" : "h3";
  return (
    <section
      id="electric-mobility"
      aria-labelledby="mobility-heading"
      className="on-dark relative bg-forest text-ivory"
    >
      {!standalone && <RidgeEdge className="text-forest" />}

      {standalone ? (
        <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] pb-[clamp(2rem,5vw,5rem)] pt-[calc(var(--header-h)+clamp(2.5rem,6vw,6rem))]">
          <Reveal onMount>
            <p className="t-label flex items-center gap-4 text-sage">
              <span className="block h-px w-10 bg-sage/60" aria-hidden="true" />
              Electric mobility
            </p>
          </Reveal>
          <Heading id="mobility-heading" className="t-statement mt-7">
            <MaskLines lines={["Live electric."]} animateOnMount />
          </Heading>
          <Reveal delay={0.1} onMount className="mt-8 max-w-[34rem]">
            <p className="t-body text-ivory/85">
              Four things worth knowing before you make the switch, in plain language. General
              information only.
            </p>
          </Reveal>
        </div>
      ) : (
        <Heading id="mobility-heading" className="sr-only">
          Electric mobility: quiet, range, charging and every day
        </Heading>
      )}

      {reduce ? <Static standalone={standalone} Word={Word} /> : <Pinned Word={Word} />}
    </section>
  );
}
