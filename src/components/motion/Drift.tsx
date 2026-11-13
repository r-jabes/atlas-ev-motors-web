"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Moves its child a short distance (px) as the container passes through the viewport.
 * Use for gentle parallax inside overflow-hidden masks. No-op for reduced motion.
 */
export function Drift({
  children,
  from = 40,
  to = -40,
  className,
}: {
  children: ReactNode;
  from?: number;
  to?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : from, reduce ? 0 : to]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[8%]">
        {children}
      </motion.div>
    </div>
  );
}
