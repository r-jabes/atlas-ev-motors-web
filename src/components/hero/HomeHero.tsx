"use client";

import { useRef, type CSSProperties } from "react";
import { getImageProps } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { images, needsIllustrativeLabel } from "@/data/images";
import { IllustrativeTag } from "@/components/ui/IllustrativeTag";
import { Button } from "@/components/ui/Button";

const HEADLINE = ["Move differently.", "Live electric."];
const HERO_COPY =
  "Discover a new perspective on mobility. Explore electric vehicles designed for the way you move.";

const heroImageBase = { fill: true, sizes: "100vw", quality: 85 as const, priority: true };
const { props: landscapeProps } = getImageProps({
  ...heroImageBase,
  src: images.hero.src,
  alt: images.hero.alt,
});
const { props: portraitProps } = getImageProps({
  ...heroImageBase,
  src: images.heroPortrait.src,
  alt: images.heroPortrait.alt,
});
// `fill` positioning is handled by our own classes, so only the loading attributes are reused.
const landscapeImg = {
  src: landscapeProps.src,
  srcSet: landscapeProps.srcSet,
  sizes: landscapeProps.sizes,
  loading: landscapeProps.loading,
  fetchPriority: landscapeProps.fetchPriority,
  decoding: landscapeProps.decoding,
};
const portraitImg = { srcSet: portraitProps.srcSet };

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Subtle parallax: the picture drifts slower than the page, nothing more.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-8%"]);

  return (
    <section
      ref={ref}
      aria-label="Atlas EV Motors"
      className="on-dark relative h-[100svh] min-h-[600px] overflow-hidden bg-forest text-ivory"
    >
      {/* Layer 1 — photograph: horizon-open reveal, settle, parallax */}
      <div className="hero-reveal absolute inset-0">
        <motion.div className="absolute inset-x-0 -top-[14%] bottom-0" style={{ y }}>
          {/* Art direction: a purpose-made portrait composition for portrait viewports,
              so the subject is never cropped out on phones. */}
          <div className="hero-settle grain absolute inset-0 overflow-hidden">
            <picture>
              <source
                media="(max-aspect-ratio: 1/1)"
                srcSet={portraitImg.srcSet}
                sizes="100vw"
              />
              <img
                {...landscapeImg}
                alt={images.hero.alt}
                className="h-full w-full object-cover object-[35%_62%] landscape:object-[62%_50%] lg:landscape:object-center"
              />
            </picture>
          </div>
        </motion.div>
      </div>
      {/* Honesty label lives at hero level (outside the parallax layer) so it is always on screen */}
      {needsIllustrativeLabel(images.hero) && (
        <IllustrativeTag className="right-[var(--page-gutter)] bottom-[calc(clamp(36px,6vw,96px)+0.5rem)] md:bottom-auto md:top-[calc(var(--header-h)+0.75rem)]" />
      )}

      {/* Layer 2 — tonal grade (forest-tinted, not a generic black gradient) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-forest/10 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(23,37,31,0.58) 0%, rgba(23,37,31,0.3) 30%, rgba(23,37,31,0) 52%), radial-gradient(110% 60% at 0% 100%, rgba(23,37,31,0.6) 0%, rgba(23,37,31,0) 60%)",
        }}
      />

      {/* Layer 3 — type */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto flex h-full max-w-[1800px] flex-col justify-between px-[var(--page-gutter)] pt-[calc(var(--header-h)+clamp(1.5rem,6vh,4.5rem))] pb-[calc(clamp(2rem,5vh,3.5rem)+clamp(36px,6vw,96px))]"
      >
        <div>
          <h1 className="t-hero">
            {HEADLINE.map((line, i) => (
              <span key={line} className="hero-line">
                <span style={{ "--i": i } as CSSProperties}>{line}</span>
              </span>
            ))}
          </h1>
          {/* Phones: the copy sits under the headline so it never competes with the vehicle */}
          <p
            className="hero-fade mt-5 max-w-[21rem] text-[1.0625rem] leading-snug text-ivory [text-shadow:0_1px_16px_rgba(23,37,31,0.6)] md:hidden"
            style={{ "--d": "1.15s" } as CSSProperties}
          >
            {HERO_COPY}
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="hero-fade max-w-[27rem]" style={{ "--d": "1.15s" } as CSSProperties}>
            <p className="text-[1.0625rem] leading-relaxed text-ivory/90 max-md:hidden sm:text-lg">
              {HERO_COPY}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-7">
              <Button href="/vehicles" variant="primary" magnetic>
                Explore vehicles
              </Button>
              <Button href="/#discover" variant="outline-light">
                Discover Atlas
              </Button>
            </div>
          </div>

          <div
            className="hero-fade hidden items-end gap-6 md:flex"
            style={{ "--d": "1.6s" } as CSSProperties}
            aria-hidden="true"
          >
            <p className="t-label text-right text-[0.62rem] leading-[1.7] text-ivory/80">
              Kigali · Rwanda
              <br />
              1°56′S 30°04′E
            </p>
            <div className="flex flex-col items-center gap-3">
              <span className="t-label text-[0.58rem] text-ivory/70 [writing-mode:vertical-rl]">
                Scroll
              </span>
              <span className="relative block h-14 w-px bg-ivory/25">
                <span className="hero-cue-line absolute inset-0 block bg-ivory" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
