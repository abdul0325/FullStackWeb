"use client";

// Client island: count-up for one metric. The final value is server-rendered
// in a visually hidden span for screen readers and crawlers; the animated
// digits are aria-hidden. Runs once, when the tile enters the viewport;
// instant under reduced motion. tabular-nums + a reserved width so nothing
// shifts while counting.

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { Metric } from "@/types";
import { cn } from "@/lib/utils";

const DURATION_MS = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

export function MetricTile({ metric, className }: { metric: Metric; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<number>(metric.value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || started.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / DURATION_MS);
          setShown(Math.round(easeOut(p) * metric.value));
          if (p < 1) requestAnimationFrame(tick);
        };
        setShown(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [metric.value, reduce]);

  const formatted = shown.toLocaleString("en-GB");
  const finalFormatted = metric.value.toLocaleString("en-GB");

  return (
    <div ref={ref} className={cn("flex min-w-0 flex-col gap-1.5", className)} title={metric.source}>
      <p className="font-mono text-[clamp(1.75rem,1.2rem+2.2vw,2.5rem)] font-bold leading-none tracking-tight text-fg tabular-nums">
        {/* Reserve the final width so the layout never shifts during the count. */}
        <span className="relative inline-block">
          <span aria-hidden="true" className="invisible">
            {finalFormatted}
            {metric.suffix}
          </span>
          <span aria-hidden="true" className="absolute inset-0">
            {formatted}
            {metric.suffix ? <span className="text-brand">{metric.suffix}</span> : null}
          </span>
        </span>
        <span className="sr-only">
          {finalFormatted}
          {metric.suffix}
        </span>
      </p>
      <p className="text-sm leading-snug text-fg-muted">{metric.label}</p>
    </div>
  );
}
