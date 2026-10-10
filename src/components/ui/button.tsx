import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// Every variant carries the full state set: rest, hover (pointer devices only),
// focus-visible (global ring from globals.css), active/pressed, disabled and
// loading. Motion is transform + opacity + colour only.

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-md border font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,transform,opacity] duration-fast ease-out-expo",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[loading=true]:pointer-events-none",
    "aria-invalid:border-danger",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "border-transparent bg-brand text-brand-fg",
          "hoverable:hover:bg-brand-hover",
          "active:bg-brand-pressed",
        ],
        secondary: [
          "border-line-strong bg-bg-elevated text-fg",
          "hoverable:hover:border-fg-subtle hoverable:hover:bg-bg-subtle",
          "active:bg-bg-inset",
        ],
        ghost: [
          "border-transparent bg-transparent text-fg-muted",
          "hoverable:hover:bg-bg-subtle hoverable:hover:text-fg",
          "active:bg-bg-inset",
          "aria-expanded:bg-bg-subtle aria-expanded:text-fg",
        ],
        destructive: [
          "border-transparent bg-danger/12 text-danger",
          "hoverable:hover:bg-danger/20",
          "active:bg-danger/25",
        ],
        link: [
          "h-auto rounded-sm border-transparent bg-transparent px-0 text-brand underline-offset-4",
          "hoverable:hover:underline",
          "active:text-brand-pressed",
        ],
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Shows a spinner and locks the width so the label swap never reflows. */
  loading?: boolean;
}

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      disabled={disabled}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <>
          {/* Keep the label in the layout (invisible) so width stays locked, and
              repeat it for assistive tech — visibility:hidden removes it from
              the accessible name. */}
          <span aria-hidden="true" className="invisible inline-flex items-center gap-2">{children}</span>
          <span className="sr-only">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-4 animate-spin", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}

export { Button, Spinner, buttonVariants };
