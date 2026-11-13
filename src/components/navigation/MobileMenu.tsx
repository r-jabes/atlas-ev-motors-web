"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { nav, site } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/whatsapp";

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastPath = useRef(pathname);

  // Close when the route changes
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Scroll lock, Esc to close, focus trap, focus return
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-forest text-ivory"
          initial={{ clipPath: reduce ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", opacity: reduce ? 0 : 1 }}
          animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          exit={{ clipPath: reduce ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", opacity: reduce ? 0 : 1 }}
          transition={{ duration: reduce ? 0.15 : 0.7, ease: EASE }}
        >
          <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[1800px] shrink-0 items-center justify-between px-[var(--page-gutter)]">
            <Link href="/" onClick={onClose} aria-label="Atlas EV Motors — home">
              <Wordmark />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="t-label group inline-flex items-center gap-3 py-2 text-[0.72rem] tracking-[0.16em]"
            >
              <span>Close</span>
              <X aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col justify-center px-[var(--page-gutter)] py-8"
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item, i) => {
                const active =
                  item.href === "/#discover"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: reduce ? 0 : "105%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: reduce ? 0 : 0.18 + i * 0.07 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? (item.href.includes("#") ? "location" : "page") : undefined}
                        className="t-display flex items-baseline gap-4 py-2 transition-colors hover:text-laterite-400 focus-visible:text-laterite-400"
                      >
                        <span className="t-label w-6 text-[0.65rem] text-sage">0{i + 1}</span>
                        <span className={active ? "text-laterite-400" : undefined}>{item.label}</span>
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0.15 : 0.7, ease: EASE, delay: reduce ? 0 : 0.55 }}
            >
              <Button href="/contact" variant="primary">
                Enquire Now
              </Button>
            </motion.div>
          </nav>

          <div className="mx-auto w-full max-w-[1800px] shrink-0 border-t border-ivory/12 px-[var(--page-gutter)] py-6">
            <div className="flex flex-col gap-2 text-[0.95rem] text-muted-dark sm:flex-row sm:gap-8">
              <a className="link-draw w-fit" href={`tel:${site.phone.e164}`}>
                {site.phone.display}
              </a>
              <a className="link-draw w-fit" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a
                className="link-draw w-fit"
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
