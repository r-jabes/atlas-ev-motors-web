"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

function Word({
  word,
  range,
  progress,
  from,
  to,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  from: string;
  to: string;
}) {
  const color = useTransform(progress, range, [from, to]);
  return (
    <motion.span className="word-reveal-word" style={{ color }}>
      {word}
    </motion.span>
  );
}

/**
 * Statement whose words darken from a quiet tone to the final colour as you scroll.
 * Native scrolling is never touched. Reduced motion: shows the final colour immediately.
 * `lines` lets editorial line breaks be controlled; words within a line reveal in sequence.
 */
export function WordReveal({
  lines,
  className,
  from = "#c4c8bc",
  to = "#17251f",
}: {
  lines: string[];
  className?: string;
  from?: string;
  to?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "end 0.5"],
  });

  const words = lines.flatMap((line, li) =>
    line.split(" ").map((w, wi, arr) => ({ w, br: wi === arr.length - 1 && li < lines.length - 1 })),
  );
  const total = words.length;

  return (
    <h2 ref={ref} className={className} style={reduce ? { color: to } : undefined}>
      {words.map(({ w, br }, i) => {
        const start = i / total;
        const end = Math.min(1, start + 1.6 / total);
        return (
          <span key={i}>
            {reduce ? (
              <span>{w}</span>
            ) : (
              <Word word={w} range={[start, end]} progress={scrollYProgress} from={from} to={to} />
            )}
            {br ? <br /> : " "}
          </span>
        );
      })}
    </h2>
  );
}
