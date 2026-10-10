"use client";

import { useEffect, useState } from "react";

// Tracks which `section[id]` is nearest the viewport's upper third using an
// IntersectionObserver — no scroll listener, no layout reads on scroll.
export function useActiveSection(initial = "home"): string {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (sections.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        }
        if (visible.size === 0) return;
        // Pick the section with the greatest visible share; ties go to the
        // earliest in document order.
        let best: string | null = null;
        let bestRatio = -1;
        for (const s of sections) {
          const r = visible.get(s.id);
          if (r !== undefined && r > bestRatio) {
            best = s.id;
            bestRatio = r;
          }
        }
        if (best) setActive(best);
      },
      // Observe the band from 20% to 60% down the viewport.
      { rootMargin: "-20% 0px -40% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, []);

  return active;
}
