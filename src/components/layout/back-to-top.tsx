"use client";

// Client island: appears past 60% scroll, scrolls to top with native smooth
// scrolling (which the platform disables under reduced motion). Respects the
// bottom safe-area inset on notched phones.

import { ArrowUp } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";

import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function BackToTop({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v > 0.6;
    if (next !== visible) setVisible(next);
  });

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: duration.fast, ease: ease.out }}
      className={cn(
        "fixed z-40 inline-flex size-11 items-center justify-center rounded-full",
        "border border-line-strong bg-bg-overlay text-fg-muted shadow-popover",
        "transition-[color,border-color,background-color] duration-fast ease-out-expo",
        "hoverable:hover:border-brand hoverable:hover:text-fg",
        "active:translate-y-px",
        !visible && "pointer-events-none",
        className
      )}
      style={{
        right: "max(1.25rem, env(safe-area-inset-right))",
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </motion.button>
  );
}
