import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Text links: inline (prose), nav, external. All share one focus treatment
// (global :focus-visible) and animate colour + the underline only.

const textLinkVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-sm",
    "transition-[color,text-decoration-color] duration-fast ease-out-expo",
    "active:text-brand-pressed",
  ],
  {
    variants: {
      variant: {
        inline: [
          "text-brand underline decoration-brand/40 underline-offset-4",
          "hoverable:hover:decoration-brand",
          "visited:text-brand-pressed",
        ],
        nav: [
          "text-fg-muted no-underline",
          "hoverable:hover:text-fg",
          "aria-[current=true]:text-fg",
        ],
        subtle: [
          "text-fg-muted underline decoration-line-strong underline-offset-4",
          "hoverable:hover:text-fg hoverable:hover:decoration-fg-subtle",
        ],
      },
    },
    defaultVariants: { variant: "inline" },
  }
);

export interface TextLinkProps
  extends React.ComponentProps<"a">,
    VariantProps<typeof textLinkVariants> {
  href: string;
  /** Opens in a new tab with rel noopener and a trailing arrow glyph. */
  external?: boolean;
}

function isExternalHref(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

function TextLink({ className, variant, href, external, children, ...props }: TextLinkProps) {
  const ext = external ?? isExternalHref(href);
  const classes = cn(textLinkVariants({ variant }), className);

  if (ext) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {children}
        <ArrowUpRight aria-hidden="true" className="size-[0.9em] shrink-0 opacity-70" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  // next/link's prop types are not exactOptionalPropertyTypes-clean; the anchor
  // props are forwarded unchanged, so the cast is safe.
  const linkProps = props as Omit<React.ComponentProps<typeof Link>, "href" | "className">;

  return (
    <Link href={href} className={classes} {...linkProps}>
      {children}
    </Link>
  );
}

export { TextLink, textLinkVariants };
