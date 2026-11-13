import { cn } from "@/lib/cn";

/**
 * ATLAS wordmark — a PROPOSAL (no existing Atlas logo was found).
 * Distinctive detail: both A's have no crossbar — a clean peak, nodding to Rwanda's hills
 * and to "atlas" as a book of routes. Drawn as geometry so it is crisp at any size.
 */
export function AtlasPeak({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 34" className={className} fill="currentColor" aria-hidden="true">
      <path d="M0 34 L16 0 L32 34 H26.5 L16 11.7 L5.5 34 Z" />
    </svg>
  );
}

/** The bare letterforms, sized by the caller. Used by the header lockup and the footer. */
export function AtlasLogotype({ className, label }: { className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 184 38"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={className}
      fill="currentColor"
    >
      {/* A */}
      <path d="M0 36 L16 2 L32 36 H26.5 L16 13.7 L5.5 36 Z" />
      {/* T */}
      <path d="M40 2 H70 V7.5 H57.75 V36 H52.25 V7.5 H40 Z" />
      {/* L */}
      <path d="M80 2 H85.5 V30.5 H104 V36 H80 Z" />
      {/* A */}
      <path d="M112 36 L128 2 L144 36 H138.5 L128 13.7 L117.5 36 Z" />
      {/* S */}
      <path
        d="M178 11 C175.8 7 171.5 4.75 166.4 4.75 C160 4.75 156.3 8 156.3 12.3 C156.3 16.8 160.2 18.4 167 19.8 C174.2 21.3 178.7 23.2 178.7 27.4 C178.7 31 174 33.25 167.4 33.25 C161.5 33.25 157.3 31.3 155 26.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  showDescriptor = true,
}: {
  className?: string;
  showDescriptor?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-end gap-3", className)}>
      <AtlasLogotype label="Atlas" className="h-[1.35rem] w-auto" />
      {showDescriptor && (
        <span className="t-label hidden pb-[1px] text-[0.6rem] opacity-70 sm:inline">EV Motors</span>
      )}
    </span>
  );
}
