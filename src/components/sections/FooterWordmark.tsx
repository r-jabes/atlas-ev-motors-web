"use client";

import { motion, useReducedMotion } from "motion/react";
import { AtlasLogotype } from "@/components/ui/Wordmark";

/** Oversized, cropped wordmark that rises into place once as the footer arrives. */
export function FooterWordmark() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mt-[clamp(2rem,5vw,4rem)] overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ y: reduce ? "14%" : "70%" }}
        whileInView={{ y: "14%" }}
        viewport={{ once: true, margin: "0px 0px -5% 0px" }}
        transition={{ duration: reduce ? 0 : 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-ivory/[0.07]"
      >
        <AtlasLogotype className="block h-auto w-full" />
      </motion.div>
    </div>
  );
}
