import {
  siCloudflare,
  siDocker,
  siGithubactions,
  siJest,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPaypal,
  siPostgresql,
  siPrisma,
  siReact,
  siStripe,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

import { cn } from "@/lib/utils";

// Server component, zero JS. Brand marks as inline SVG path data from
// simple-icons, rendered in currentColor so they read on both themes, with the
// brand hex only as a hover tint on pointer devices. The track is duplicated
// and translated -50% in CSS (transform only); it pauses on hover/focus and is
// replaced by a static wrapping row under reduced motion. Fixed item height
// so nothing shifts.

const STACK: Array<{ icon: SimpleIcon; label?: string }> = [
  { icon: siTypescript },
  { icon: siNestjs },
  { icon: siNodedotjs, label: "Node.js" },
  { icon: siPostgresql },
  { icon: siPrisma },
  { icon: siJest },
  { icon: siPaypal },
  { icon: siStripe },
  { icon: siCloudflare },
  { icon: siDocker },
  { icon: siGithubactions, label: "GitHub Actions" },
  { icon: siNextdotjs, label: "Next.js" },
  { icon: siReact },
  { icon: siTailwindcss, label: "Tailwind CSS" },
];

function Mark({ icon, label }: { icon: SimpleIcon; label?: string }) {
  const name = label ?? icon.title;
  return (
    <li
      className="group/mark flex h-10 shrink-0 items-center gap-2.5 px-5 text-fg-subtle"
      style={{ ["--brand-hex" as string]: `#${icon.hex}` }}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-5 shrink-0 fill-current transition-colors duration-fast ease-out-expo hoverable:group-hover/mark:fill-[var(--brand-hex)]"
      >
        <path d={icon.path} />
      </svg>
      <span className="whitespace-nowrap text-sm font-medium transition-colors duration-fast ease-out-expo hoverable:group-hover/mark:text-fg">
        {name}
      </span>
    </li>
  );
}

export function TechMarquee({ className }: { className?: string }) {
  return (
    <div
      className={cn("marquee relative -mx-5 md:-mx-8 lg:-mx-12", className)}
      aria-label="Technology stack"
      role="region"
    >
      {/* Edge fades */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />

      {/* Moving track (hidden under reduced motion) */}
      <div className="overflow-hidden motion-reduce:hidden" style={{ ["--marquee-duration" as string]: "48s" }}>
        <ul className="animate-marquee flex w-max" aria-hidden="true">
          {STACK.map((s) => (
            <Mark key={s.icon.slug} {...s} />
          ))}
          {STACK.map((s) => (
            <Mark key={`${s.icon.slug}-dup`} {...s} />
          ))}
        </ul>
      </div>

      {/* Accessible list: static, wraps; the only one visible under reduced motion */}
      <ul className="sr-only flex flex-wrap justify-center gap-y-2 motion-reduce:not-sr-only motion-reduce:px-5">
        {STACK.map((s) => (
          <Mark key={`${s.icon.slug}-static`} {...s} />
        ))}
      </ul>
    </div>
  );
}
