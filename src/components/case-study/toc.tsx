"use client";

// Client island: table of contents. Sticky on desktop with the active section
// highlighted by IntersectionObserver; a collapsible <details> on mobile.

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
  children?: Array<{ id: string; label: string }>;
}

export function Toc({ items, className }: { items: TocItem[]; className?: string }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const ids = items.flatMap((i) => [i.id, ...(i.children ?? []).map((c) => c.id)]);
    // Observe the headings (`<id>-title`), not the sections: a section that
    // wraps its children would otherwise always win over the child heading.
    const targets = ids
      .map((id) => ({ id, el: document.getElementById(`${id}-title`) ?? document.getElementById(id) }))
      .filter((t): t is { id: string; el: HTMLElement } => !!t.el);
    if (targets.length === 0) return;
    // Active = the last heading whose top has passed a line a third of the way
    // down the viewport. Recomputed from live rects whenever any heading
    // crosses the observed band, so the result never depends on event order.
    const compute = () => {
      const line = window.innerHeight * 0.4;
      let current = targets[0]?.id ?? "";
      for (const t of targets) {
        if (t.el.getBoundingClientRect().top <= line) current = t.id;
        else break;
      }
      setActive(current);
    };
    const io = new IntersectionObserver(compute, { rootMargin: "-8% 0px -60% 0px", threshold: [0, 1] });
    for (const t of targets) io.observe(t.el);
    compute();
    return () => io.disconnect();
  }, [items]);

  const list = (
    <ol className="flex flex-col gap-1 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={active === item.id ? "location" : undefined}
            className={cn(
              "block rounded-md border-l-2 py-1.5 pl-3 pr-2 transition-colors duration-fast ease-out-expo",
              active === item.id || item.children?.some((c) => c.id === active)
                ? "border-brand text-fg"
                : "border-transparent text-fg-muted hoverable:hover:text-fg"
            )}
          >
            {item.label}
          </a>
          {item.children ? (
            <ol className="mt-0.5 flex flex-col gap-0.5">
              {item.children.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    aria-current={active === c.id ? "location" : undefined}
                    className={cn(
                      "block rounded-md border-l-2 py-1 pl-6 pr-2 text-[0.8125rem] transition-colors duration-fast ease-out-expo",
                      active === c.id ? "border-brand text-fg" : "border-transparent text-fg-subtle hoverable:hover:text-fg"
                    )}
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ol>
          ) : null}
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label="On this page" className={className}>
      {/* Mobile: collapsible */}
      <details className="group rounded-lg border border-line bg-bg-elevated lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
          On this page
          <ChevronDown aria-hidden="true" className="size-4 text-fg-subtle transition-transform duration-fast group-open:rotate-180" />
        </summary>
        <div className="border-t border-line px-2 py-2">{list}</div>
      </details>
      {/* Desktop: sticky rail */}
      <div className="hidden lg:block">
        <p className="label mb-3">On this page</p>
        {list}
      </div>
    </nav>
  );
}
