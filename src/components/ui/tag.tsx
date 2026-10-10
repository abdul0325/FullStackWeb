"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

// Filter chip. A toggle button with aria-pressed, so the selected state is
// announced and keyboard-operable. States: rest, hover, focus-visible,
// selected, selected+hover, disabled (zero results).

export interface TagProps extends Omit<React.ComponentProps<"button">, "onChange"> {
  selected?: boolean;
  count?: number;
}

function Tag({ className, selected = false, count, children, disabled, ...props }: TagProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      data-slot="tag"
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium",
        "transition-[background-color,border-color,color,transform] duration-fast ease-out-expo",
        "active:translate-y-px",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-brand bg-brand-subtle text-brand hoverable:hover:border-brand-hover"
          : "border-line bg-bg-subtle text-fg-muted hoverable:hover:border-line-strong hoverable:hover:text-fg",
        className
      )}
      {...props}
    >
      {selected ? <Check aria-hidden="true" className="size-3.5" /> : null}
      {children}
      {typeof count === "number" ? (
        <span className={cn("font-mono text-xs", selected ? "text-brand" : "text-fg-subtle")}>{count}</span>
      ) : null}
    </button>
  );
}

export { Tag };
