"use client";

// Client island: the single entrance-animation wrapper. Every scroll reveal on
// the site goes through here so the rules hold in one place: transform +
// opacity only, once per element, reduced-motion → instant, smaller travel
// below lg (§3.7).

import { useReducedMotion, motion } from "motion/react";
import type { ReactNode } from "react";

import { distance, duration, ease, viewport } from "@/lib/motion";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Travel in px. Halved automatically below lg. */
  y?: number;
  delay?: number;
  /** Seconds. */
  dur?: number;
  id?: string;
}

export function Reveal({
  children,
  className,
  y = distance.base,
  delay = 0,
  dur = duration.base,
  id,
}: RevealProps) {
  const reduce = useReducedMotion();
  const small = useMediaQuery("(max-width: 1023px)");
  const travel = small ? Math.round(y / 2) : y;

  if (reduce) {
    // No hidden state at all: content is visible from the first paint.
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: travel }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: dur, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
