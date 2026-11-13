import { cn } from "@/lib/cn";

/**
 * Permanent honesty label for imagery that does not show a real Atlas vehicle.
 * Position is supplied by the caller; the default is bottom-left of the nearest positioned parent.
 */
export function IllustrativeTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "t-label pointer-events-none absolute z-20 bg-forest px-2 py-1 text-[0.58rem] text-ivory/90",
        className ?? "bottom-3 left-3",
      )}
    >
      Illustrative image
    </span>
  );
}
