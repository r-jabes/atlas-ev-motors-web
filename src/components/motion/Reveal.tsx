"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Entrance reveals, deliberately CSS-driven (see `.rv` / `.ml-*` in globals.css).
 *
 * Content is server-rendered VISIBLE. After hydration, only elements that sit below the
 * fold are "armed" (hidden) and then revealed once as they scroll in. Consequences:
 *  - nothing in the first screen ever waits for JavaScript (fast LCP, no blank text),
 *  - without JavaScript or with reduced motion, everything simply stays visible,
 *  - above-the-fold choreography uses `onMount` / `animateOnMount` (pure CSS animation).
 */

type Armable = HTMLElement;
const IN = "is-in";
const ARMED = "is-armed";

let observer: IntersectionObserver | null = null;
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add(IN);
          observer?.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}

/** Arms an element for reveal-on-scroll if (and only if) it is currently below the fold. */
function useArm(ref: React.RefObject<Armable | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) return; // already on screen (or above): leave visible
    el.classList.add(ARMED);
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, [ref, enabled]);
}

/** Fade + short rise, once. `onMount` = play immediately (use for the first screen). */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  onMount = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "p" | "li" | "span";
  onMount?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useArm(ref, !onMount);
  const Tag = as as ElementType;
  const style = { "--rv-d": `${delay}s`, "--rv-y": `${y}px` } as CSSProperties;
  return (
    <Tag ref={ref} className={cn(onMount ? "rv-mount" : "rv", className)} style={style}>
      {children}
    </Tag>
  );
}

/**
 * Headline whose lines rise out of a mask, one after another.
 * `animateOnMount` for first-screen headlines (CSS animation, runs at first paint).
 */
export function MaskLines({
  lines,
  className,
  delay = 0,
  animateOnMount = false,
  lineClassName,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  animateOnMount?: boolean;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useArm(ref, !animateOnMount);
  return (
    <span
      ref={ref}
      className={cn("ml", animateOnMount && "ml-mount", className)}
      style={{ "--ml-d": `${delay}s` } as CSSProperties}
    >
      {lines.map((line, i) => (
        <span key={i} className="ml-line">
          <span className={cn("ml-text", lineClassName)} style={{ "--i": i } as CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
