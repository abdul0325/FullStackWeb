import Image from "next/image";
import Link from "next/link";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

// Server component. The mark sits on a bordered disc so it reads on both
// themes; wordmark uses the theme foreground.

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group/logo inline-flex min-w-0 items-center gap-3 rounded-md", className)}
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-bg-elevated">
        <Image src="/pictures/weblogo.webp" alt="" width={36} height={36} className="size-full object-cover" />
      </span>
      <span className="hidden min-w-0 flex-col leading-tight sm:flex">
        <span className="truncate text-sm font-semibold text-fg">{site.name}</span>
        <span className="truncate font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">
          {site.role}
        </span>
      </span>
    </Link>
  );
}
