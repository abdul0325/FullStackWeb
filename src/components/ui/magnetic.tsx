"use client";

// Pointer-follow wrapper for primary CTAs. Desktop fine-pointer only; inert on
// touch, below lg, and under reduced motion. Transform only, capped travel.

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";

import { useIsDesktopPointer } from "@/hooks/use-media-query";
import { spring } from "@/lib/motion";

export interface MagneticProps {
  children: ReactNode;
  /** Maximum travel in px. */
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 6, className }: MagneticProps) {
  const desktop = useIsDesktopPointer();
  const reduce = useReducedMotion();
  const enabled = desktop && !reduce;
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const clamp = (v: number) => Math.max(-strength, Math.min(strength, v));
    x.set(clamp((dx / r.width) * strength * 2));
    y.set(clamp((dy / r.height) * strength * 2));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
