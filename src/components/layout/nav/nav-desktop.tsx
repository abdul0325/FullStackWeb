"use client";

// Client island: active-section indicator. One underline element slides
// between items using measured positions and transform only (x + scaleX) —
// deliberately not `layoutId`, which would pull motion's whole layout
// projection system (~40 KB) into the initial bundle.

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

import { navigation } from "@/data/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const INDICATOR_BASE_WIDTH = 100; // px; scaled to the active item's width

export function NavDesktop({ className }: { className?: string }) {
  const active = useActiveSection();
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; scaleX: number } | null>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const link = nav.querySelector<HTMLElement>('[aria-current="true"]');
      if (!link) {
        setIndicator(null);
        return;
      }
      const n = nav.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      const inset = 12; // matches px-3 on the link
      setIndicator({ x: r.left - n.left + inset, scaleX: (r.width - inset * 2) / INDICATOR_BASE_WIDTH });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [active]);

  return (
    <nav ref={navRef} aria-label="Primary" className={cn("relative hidden items-center gap-1 lg:flex", className)}>
      {navigation.map((item) => {
        const id = item.href.replace("#", "");
        const isActive = active === id;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "relative rounded-md px-3 py-2 text-sm font-medium",
              "transition-colors duration-fast ease-out-expo",
              isActive ? "text-fg" : "text-fg-muted hoverable:hover:text-fg"
            )}
          >
            {item.title}
          </Link>
        );
      })}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={indicator ? { x: indicator.x, scaleX: indicator.scaleX, opacity: 1 } : { opacity: 0 }}
        transition={reduce ? { duration: 0 } : spring}
        style={{ width: INDICATOR_BASE_WIDTH }}
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 origin-left rounded-full bg-brand"
      />
    </nav>
  );
}
