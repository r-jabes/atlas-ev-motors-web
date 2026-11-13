"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Respect the user's reduced-motion setting everywhere motion/react is used. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
