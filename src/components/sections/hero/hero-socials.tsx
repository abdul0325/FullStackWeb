"use client";

// Client island: icon links with tooltips (Radix needs client state).

import { Mail } from "lucide-react";
import { siGithub } from "simple-icons";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const linkClass = cn(
  "inline-flex size-11 items-center justify-center rounded-md border border-line bg-bg-elevated text-fg-muted",
  "transition-[color,border-color,transform] duration-fast ease-out-expo",
  "hoverable:hover:border-line-strong hoverable:hover:text-fg",
  "active:translate-y-px"
);

function LinkedInGlyph(props: { className?: string }) {
  // simple-icons removed the LinkedIn mark; a plain "in" wordmark glyph instead.
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className} fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export function HeroSocials() {
  const items = [
    {
      label: "GitHub",
      href: site.socials.github,
      tip: "GitHub — abdul0325",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
          <path d={siGithub.path} />
        </svg>
      ),
    },
    { label: "LinkedIn", href: site.socials.linkedin, tip: "LinkedIn profile", icon: <LinkedInGlyph className="size-5" /> },
    { label: "Email", href: `mailto:${site.email}`, tip: site.email, icon: <Mail aria-hidden="true" className="size-5" /> },
  ];

  return (
    <ul aria-label="Profiles" className="flex items-center gap-2">
      {items.map((it) => {
        const external = it.href.startsWith("http");
        return (
          <li key={it.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={it.href}
                  aria-label={it.label}
                  className={linkClass}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {it.icon}
                </a>
              </TooltipTrigger>
              <TooltipContent>{it.tip}</TooltipContent>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  );
}
