import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Elevation is a background step plus a border, never a shadow at rest. The
// hover lift uses transform plus a pre-rendered shadow layer whose opacity
// animates, so nothing repaints.

const cardVariants = cva(
  [
    "group/card relative rounded-xl border border-line bg-bg-elevated text-fg",
    "transition-[border-color,transform] duration-fast ease-out-expo",
    // 1px top highlight — the only gradient allowed on a surface (§3.2 b)
    "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-xl",
    "before:bg-gradient-to-r before:from-transparent before:via-line-strong before:to-transparent before:opacity-60",
    // shadow layer, opacity-animated on hover
    "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-xl after:opacity-0 after:shadow-lift",
    "after:transition-opacity after:duration-fast after:ease-out-expo",
  ],
  {
    variants: {
      variant: {
        static: "",
        interactive: [
          "hoverable:hover:-translate-y-0.5 hoverable:hover:border-line-strong hoverable:hover:after:opacity-100",
          "active:translate-y-0",
        ],
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "static",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

/**
 * A card that is one link. The whole surface is clickable, inner text stays
 * selectable, and the focus ring sits on the card rather than the inner anchor.
 */
function LinkCard({
  className,
  href,
  children,
  padding,
  ...props
}: React.ComponentProps<"a"> & VariantProps<typeof cardVariants>) {
  return (
    <a
      href={href}
      data-slot="link-card"
      className={cn(
        cardVariants({ variant: "interactive", padding }),
        "block no-underline outline-none",
        "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("text-h3 text-fg", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-sm text-fg-muted", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("mt-4", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-6 flex items-center gap-3", className)} {...props} />;
}

export { Card, LinkCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
