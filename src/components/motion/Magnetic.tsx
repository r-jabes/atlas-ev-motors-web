"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const subscribeFine = (cb: () => void) => {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getFine = () => window.matchMedia(FINE_POINTER).matches;
const getFineServer = () => false;

/**
 * Subtle magnetic pull for PRIMARY CTAs only.
 * Disabled on touch (pointer: coarse) and when the user prefers reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.22,
  max = 10,
  className,
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = useSyncExternalStore(subscribeFine, getFine, getFineServer);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 20, mass: 0.4 });

  const enabled = fine && !reduce;
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { x: sx, y: sy } : undefined}
      onPointerMove={
        enabled
          ? (e) => {
              const r = ref.current?.getBoundingClientRect();
              if (!r) return;
              x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
              y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
            }
          : undefined
      }
      onPointerLeave={
        enabled
          ? () => {
              x.set(0);
              y.set(0);
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
