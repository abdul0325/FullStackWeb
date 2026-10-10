import { Link as LinkIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

// Server component: an anchored, revealable section with an anchor link on
// the heading. Prose stays within a comfortable measure.

export function CaseSection({
  id,
  title,
  eyebrow,
  children,
  level = 2,
  className,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  level?: 2 | 3;
  className?: string;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <Reveal>
      <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-28", className)}>
        {eyebrow ? <p className="label mb-3">{eyebrow}</p> : null}
        <Heading id={`${id}-title`} className={cn("group/h flex items-baseline gap-2", level === 2 ? "text-h2" : "text-h3", "text-fg")}>
          <a href={`#${id}`} className="no-underline hoverable:hover:underline hoverable:hover:decoration-line-strong hoverable:hover:underline-offset-4">
            {title}
          </a>
          <a
            href={`#${id}`}
            aria-label={`Link to ${title}`}
            className="text-fg-faint opacity-0 transition-opacity duration-fast focus-visible:opacity-100 hoverable:group-hover/h:opacity-100"
          >
            <LinkIcon aria-hidden="true" className="size-4" />
          </a>
        </Heading>
        <div className="measure mt-5 flex flex-col gap-4 text-body text-fg-muted [&_strong]:text-fg">{children}</div>
      </section>
    </Reveal>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}
