import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border",
    "px-2.5 py-1 text-xs font-medium leading-none",
    "transition-[background-color,border-color,color] duration-fast ease-out-expo",
    "[&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Neutral tag — tech names, categories */
        neutral: "border-line bg-bg-subtle text-fg-muted hoverable:hover:border-line-strong hoverable:hover:text-fg",
        /** Brand-tinted — counts, highlights */
        brand: "border-line-accent bg-brand-subtle text-brand",
        /** Status with a live dot — availability */
        status: "border-line bg-bg-subtle pl-2 font-mono uppercase tracking-[0.14em] text-fg-muted",
        success: "border-success/30 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/10 text-warning",
        danger: "border-danger/30 bg-danger/10 text-danger",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.6875rem]",
        default: "",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  /** Renders a pulsing status dot before the label (status variant). */
  dot?: boolean | "success" | "warning" | "danger";
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  const dotColor =
    dot === "warning" ? "bg-warning" : dot === "danger" ? "bg-danger" : "bg-success";

  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot ? (
        <span className="relative flex size-2" aria-hidden="true">
          <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", dotColor)} />
          <span className={cn("relative inline-flex size-2 rounded-full", dotColor)} />
        </span>
      ) : null}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
