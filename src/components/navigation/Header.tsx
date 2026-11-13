"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { nav } from "@/data/site";
import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

/** Is this nav item the current page? "Discover" is the home story, so it is only active on "/". */
function isActive(href: string, pathname: string, pastHero: boolean) {
  // "Discover" is the home story: lit once the reader has scrolled past the hero, not at the very top.
  if (href === "/#discover") return pathname === "/" && pastHero;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Pages whose first screen is a dark section: used until the real section under the bar is measured. */
const DARK_ROUTES = new Set(["/", "/electric-mobility", "/contact"]);
type Tone = "light" | "dark";

/** Reads which section is under the bar. Dark sections carry the `on-dark` class. */
function toneAt(y: number): Tone | null {
  const els = document.querySelectorAll("main section, footer");
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) return el.classList.contains("on-dark") ? "dark" : "light";
  }
  return null;
}

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [measured, setMeasured] = useState<{ path: string; tone: Tone } | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const measureTone = useCallback(() => {
    const t = toneAt(40);
    if (t) setMeasured((m) => (m && m.tone === t && m.path === pathname ? m : { path: pathname, tone: t }));
    const d = document.getElementById("discover");
    setPastHero(!!d && d.getBoundingClientRect().top <= window.innerHeight * 0.5);
  }, [pathname]);

  // Re-read the tone after navigation and on resize (content height changes as images load).
  useEffect(() => {
    const id = window.setTimeout(() => {
      setHidden(false); // a new page always starts with the bar showing
      measureTone();
    }, 60);
    window.addEventListener("resize", measureTone);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", measureTone);
    };
  }, [measureTone]);

  useMotionValueEvent(scrollY, "change", (y) => {
    measureTone();
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 72);
    // hide on scroll-down after the first screen, return on scroll-up (never fights content)
    if (y > 520 && y > prev + 4) setHidden(true);
    else if (y < prev - 4 || y < 520) setHidden(false);
  });

  // "dark" = the section under the bar is dark, so the bar and its type go ivory-on-forest.
  const tone: Tone =
    measured && measured.path === pathname ? measured.tone : DARK_ROUTES.has(pathname) ? "dark" : "light";
  const onDark = tone === "dark";
  const lightTone = onDark;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          "border-b",
          onDark ? "text-ivory" : "text-forest",
          scrolled
            ? onDark
              ? "border-ivory/10 bg-forest/85 backdrop-blur-md"
              : "border-forest/10 bg-ivory/88 backdrop-blur-md"
            : "border-transparent",
        )}
      >
        <div
          className="mx-auto grid h-[var(--header-h)] max-w-[1800px] grid-cols-[1fr_auto] items-center gap-6 px-[var(--page-gutter)] lg:grid-cols-[1fr_auto_1fr]"
        >
          <Link href="/" aria-label="Atlas EV Motors — home" className="justify-self-start">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {nav.map((item) => {
                const active = isActive(item.href, pathname, pastHero);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? (item.href.includes("#") ? "location" : "page") : undefined}
                      className="link-draw t-label block pb-2 pt-2 text-[0.72rem] tracking-[0.16em] transition-transform duration-300 hover:-translate-y-px"
                    >
                      {item.label}
                    </Link>
                    {active && (
                      <motion.svg
                        layoutId={reduce ? undefined : "nav-ridge"}
                        viewBox="0 0 40 6"
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-1/2 h-[6px] w-10 -translate-x-1/2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      >
                        <path d="M0 5 C6 5 8 1.2 14 1.2 C20 1.2 22 4.2 27 3.6 C32 3 34 5 40 5" />
                      </motion.svg>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-5">
            <div className="hidden sm:block">
              <Button
                href="/contact"
                variant={lightTone ? "outline-light" : "outline-dark"}
                className="!py-3 !px-5"
                arrow={false}
              >
                Enquire Now
              </Button>
            </div>
            <button
              type="button"
              className="t-label group inline-flex items-center gap-3 py-2 text-[0.72rem] tracking-[0.16em] lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span>Menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[6px]">
                <span className="h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-1" />
                <span className="h-px w-4 self-end bg-current transition-transform duration-300 group-hover:-translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </>
  );
}
