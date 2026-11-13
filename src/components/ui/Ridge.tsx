import { cn } from "@/lib/cn";

/**
 * The ridge-line motif: a soft contour of Rwanda's hills.
 * - <RidgeDefs/> provides a clip-path (#atlas-ridge-top) used to mask photographs.
 * - <RidgeEdge/> draws a section's top edge so one surface flows into the next along a ridge.
 */
export function RidgeDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="atlas-ridge-top" clipPathUnits="objectBoundingBox">
          <path d="M0,0.07 C0.07,0.02 0.13,0.06 0.2,0.045 C0.3,0.02 0.34,0.075 0.45,0.06 C0.57,0.04 0.62,0 0.72,0.02 C0.82,0.04 0.9,0.065 1,0.03 L1,1 L0,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Place as the first child of a `relative` section; colour with a text-* class. */
export function RidgeEdge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 block h-[clamp(36px,6vw,96px)] w-full -translate-y-[calc(100%-1px)]",
        className,
      )}
      fill="currentColor"
    >
      <path d="M0 96 L0 56 C120 22 220 64 340 46 C470 26 540 8 680 32 C800 54 880 72 1000 46 C1120 20 1240 32 1320 50 C1380 62 1410 58 1440 48 L1440 96 Z" />
    </svg>
  );
}
