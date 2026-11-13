import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/motion/Magnetic";

type Variant = "primary" | "outline-light" | "outline-dark" | "text-light" | "text-dark";

const base =
  "group relative inline-flex items-center gap-3 t-label text-[0.72rem] tracking-[0.16em] select-none transition-colors duration-300";

const variants: Record<Variant, string> = {
  primary:
    "bg-laterite-600 text-ivory px-6 py-4 rounded-[2px] hover:bg-[#8c3f23] focus-visible:bg-[#8c3f23]",
  "outline-light":
    "border border-ivory/55 text-ivory px-6 py-4 rounded-[2px] hover:bg-ivory hover:text-forest focus-visible:bg-ivory focus-visible:text-forest",
  "outline-dark":
    "border border-forest/45 text-forest px-6 py-4 rounded-[2px] hover:bg-forest hover:text-ivory focus-visible:bg-forest focus-visible:text-ivory",
  "text-light": "text-ivory py-2",
  "text-dark": "text-forest py-2",
};

/** For real <button> elements that must look like the site's links (e.g. form actions). */
export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export function Button({
  href,
  children,
  variant = "primary",
  magnetic = false,
  arrow = true,
  external = false,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  magnetic?: boolean;
  arrow?: boolean;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const content = (
    <>
      <span className={cn(variant.startsWith("text") && "link-draw pb-1")}>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-focus-visible:translate-x-1"
        />
      )}
    </>
  );

  const cls = cn(base, variants[variant], className);

  const link = external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {content}
    </Link>
  );

  return magnetic ? <Magnetic className="inline-block">{link}</Magnetic> : link;
}
