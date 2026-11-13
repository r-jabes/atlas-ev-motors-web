"use client";

import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { needsIllustrativeLabel } from "@/data/images";
import type { GalleryItem } from "@/data/vehicles";
import { IllustrativeTag } from "@/components/ui/IllustrativeTag";

/**
 * Full-screen viewer on a native <dialog>: focus is trapped, Esc closes, the page behind is inert, and focus
 * returns to the button that opened it. Pictures are shown whole (object-contain), never cropped.
 */
export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
  vehicleName,
}: {
  items: GalleryItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  vehicleName: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = items[index];
  const many = items.length > 1;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (!d.open) d.showModal();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const go = (d: number) => onIndex((index + d + items.length) % items.length);

  const onKey = (e: KeyboardEvent) => {
    if (!many) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  // a click on the backdrop (the dialog element itself) closes it
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-label={`${vehicleName} photographs`}
      onClose={onClose}
      onKeyDown={onKey}
      onClick={onBackdrop}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden border-0 bg-forest p-0 text-ivory backdrop:bg-forest"
    >
      <div className="relative flex h-full w-full flex-col">
        <div className="flex items-center justify-between px-[var(--page-gutter)] pb-3 pt-4">
          <p className="t-label text-[0.68rem]" aria-live="polite">
            <span className="text-laterite-400">0{index + 1}</span> / 0{items.length}
            <span className="ml-4 text-sage">{item.label}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="t-label inline-flex items-center gap-3 border border-ivory/40 px-4 py-3 text-[0.68rem] transition-colors hover:bg-ivory hover:text-forest focus-visible:bg-ivory focus-visible:text-forest"
            autoFocus
          >
            Close
            <X aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <Image
            key={item.image.src}
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="100vw"
            quality={85}
            className="object-contain px-2 md:px-16"
          />
          {needsIllustrativeLabel(item.image) && (
            <IllustrativeTag className="bottom-3 left-[var(--page-gutter)]" />
          )}
          {many && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photograph"
                className="absolute left-2 top-1/2 z-30 -translate-y-1/2 border border-ivory/40 bg-forest/70 p-3 transition-colors hover:bg-ivory hover:text-forest focus-visible:bg-ivory focus-visible:text-forest md:left-5"
              >
                <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photograph"
                className="absolute right-2 top-1/2 z-30 -translate-y-1/2 border border-ivory/40 bg-forest/70 p-3 transition-colors hover:bg-ivory hover:text-forest focus-visible:bg-ivory focus-visible:text-forest md:right-5"
              >
                <ChevronRight aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <p className="px-[var(--page-gutter)] pb-5 pt-3 text-[0.95rem] text-ivory/90">{item.caption}</p>
      </div>
    </dialog>
  );
}
