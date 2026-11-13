import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Honest holding page for routes whose full experience is built in a later phase.
 * Keeps every nav link live (no dead ends) while making the status explicit.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  phase,
  children,
}: {
  eyebrow: string;
  title: string;
  phase: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto flex min-h-[78svh] max-w-[1800px] flex-col justify-end px-[var(--page-gutter)] pb-[clamp(3rem,8vw,7rem)] pt-[calc(var(--header-h)+4rem)]">
      <p className="t-label flex items-center gap-4 text-moss">
        <span aria-hidden="true" className="block h-px w-10 bg-moss/60" />
        {eyebrow}
      </p>
      <h1 className="t-statement mt-6">{title}</h1>
      <p className="t-label mt-8 inline-block w-fit border border-forest/25 px-3 py-2 text-[0.62rem] text-moss">
        {phase}
      </p>
      {children && <div className="mt-10 max-w-3xl">{children}</div>}
      <div className="mt-10">
        <Button href="/" variant="text-dark">
          Back to home
        </Button>
      </div>
    </section>
  );
}
