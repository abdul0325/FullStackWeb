import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

// The one section header. Replaces four diverged copies. Server component;
// Reveal is the only client island and it is reduced-motion aware.

export interface SectionHeaderProps {
  /** Mono eyebrow, e.g. "About". */
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  /** Heading level — one h1 per route, so sections default to h2. */
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className
      )}
    >
      {eyebrow ? <p className="label">{eyebrow}</p> : null}
      <Heading className={cn("text-h2 text-fg", centered ? "max-w-[22ch]" : "max-w-[26ch]")}>
        {title}
      </Heading>
      {lede ? (
        <p className={cn("text-body-lg text-fg-muted", centered ? "measure-lede mx-auto" : "measure-lede")}>
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
