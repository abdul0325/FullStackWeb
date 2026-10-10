"use client";

// Client island: 2px accent rail bound to scroll progress. Transform-only
// (scaleX), hidden until the page has scrolled, static under reduced motion.

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });
  const scaleX = reduce ? scrollYProgress : smooth;
  const opacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, opacity }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand"
    />
  );
}
