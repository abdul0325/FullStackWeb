// Motion language — the single source of easing, duration, stagger and
// distance values. Components never hard-code these. CSS mirrors live in
// globals.css (@theme --ease-* / --duration-*).
//
// Rules (docs/PORTFOLIO-UPGRADE-PLAN.md §3.5, §5.5):
//   - animate transform and opacity only
//   - every entrance reveals once (viewport.once)
//   - every variant is reduced-motion aware via `reducedVariants`

import type { Transition, Variants } from "motion/react";

export const ease = {
  /** entrances — fast start, long settle */
  out: [0.16, 1, 0.3, 1],
  /** state changes, theme switches */
  inOut: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const spring = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.7,
} as const satisfies Transition;

export const duration = {
  /** press feedback */
  instant: 0.12,
  /** hover, focus ring */
  fast: 0.2,
  /** entrances, reveals */
  base: 0.35,
  /** hero, section headers */
  slow: 0.6,
  /** route transitions */
  page: 0.45,
} as const;

export const stagger = {
  /** list items, badges, marquee */
  tight: 0.04,
  /** cards in a grid */
  base: 0.07,
  /** section-level sequencing */
  loose: 0.12,
} as const;

/** Entrance travel in px. Below `lg` components use `small` (§3.7). */
export const distance = {
  subtle: 8,
  base: 16,
  large: 28,
} as const;

export const viewport = { once: true, margin: "-80px" } as const;

/** Standard entrance: fade + rise. */
export function rise(
  d: number = distance.base,
  dur: number = duration.base,
  delay = 0
): Variants {
  return {
    hidden: { opacity: 0, y: d },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur, ease: ease.out, delay },
    },
  };
}

/** Fade only — for images and anything that must not move. */
export function fade(dur: number = duration.base, delay = 0): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: dur, ease: ease.out, delay } },
  };
}

/** Parent that staggers its children's `hidden` → `visible`. */
export function staggerChildren(
  gap: number = stagger.base,
  delayChildren = 0
): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: gap, delayChildren } },
  };
}

/** Collapse any variants to an instant, motionless reveal. */
export const reducedVariants: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0 } },
};
