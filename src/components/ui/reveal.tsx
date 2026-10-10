import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// The single entrance-animation wrapper — a SERVER component with zero JS.
// The reveal is a CSS scroll-driven animation (globals.css `.reveal`,
// `animation-timeline: view()`): opacity + translateY only, runs once as the
// element enters the viewport, and elements already on screen at load are
// past their entry range so they render in their final state. Browsers without
// scroll-driven animations (and users with reduced motion) get static content.
// No client boundary, so server-rendered children are never serialised twice.

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger, in seconds — mapped to a later entry range. */
  delay?: number;
  id?: string;
}

export function Reveal({ children, className, delay = 0, id }: RevealProps) {
  const start = Math.min(160, Math.round(delay * 600)); // 0.1 s → starts 60px later
  return (
    <div
      id={id}
      className={cn("reveal", className)}
      style={start ? ({ ["--reveal-start" as string]: `${start}px` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
