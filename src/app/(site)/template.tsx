"use client";

// Route-enter transition for every page in the site group. A template
// remounts per navigation, so the entrance plays on each route change.
// Opacity + 8px rise, duration.page, none under reduced motion.

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { duration, ease } from "@/lib/motion";

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.page, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
