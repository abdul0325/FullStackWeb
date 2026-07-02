import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {}

export function Section({
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative py-24 md:py-32",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}