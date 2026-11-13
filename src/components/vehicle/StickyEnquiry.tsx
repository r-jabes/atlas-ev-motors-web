"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Phone-only enquiry bar. It appears once the hero has scrolled away and steps aside whenever the
 * enquiry section or the footer is on screen, so it never sits on top of the thing it points to.
 */
export function StickyEnquiry({ name, href, price }: { name: string; href: string; price?: string }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [endVisible, setEndVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("vehicle-hero");
    const ends = [document.getElementById("contact"), document.querySelector<HTMLElement>("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const io1 = hero ? new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting)) : null;
    if (hero && io1) io1.observe(hero);

    const live = new Set<Element>();
    const io2 = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) live.add(e.target);
        else live.delete(e.target);
      }
      setEndVisible(live.size > 0);
    });
    ends.forEach((el) => io2.observe(el));
    return () => {
      io1?.disconnect();
      io2.disconnect();
    };
  }, []);

  const visible = !heroVisible && !endVisible;

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-forest/95 text-ivory backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out-expo)] md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-[var(--page-gutter)] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <p className="min-w-0">
          <span className="t-label block truncate text-[0.68rem]">{name}</span>
          {price && <span className="t-label mt-1 block truncate text-[0.58rem] text-sage">{price}</span>}
        </p>
        <Button href={href} variant="primary" external arrow={false} className="shrink-0 !px-5 !py-3">
          Enquire
        </Button>
      </div>
    </div>
  );
}
