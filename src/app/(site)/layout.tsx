import type { ReactNode } from "react";

import { Background } from "@/components/layout/background";
import { INTRO_FLAG_SCRIPT } from "@/components/layout/intro-loader";
import { Logo } from "@/components/layout/nav/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteShell } from "@/components/layout/site-shell";

// Server component. The site shell for every route in this group: skip link,
// static background, header (client island), server-rendered content, server
// footer. Standalone routes such as /styleguide live outside the group.

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Decides before first paint whether the first-visit intro shows. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_FLAG_SCRIPT }} />

      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[90] rounded-md border border-line-strong bg-bg-overlay px-4 py-2 text-sm font-medium text-fg shadow-popover"
      >
        Skip to content
      </a>

      <Background />

      <SiteShell logo={<Logo />}>
        {/* overflow-x-clip stays until Phase 6: the hero no longer overflows at any
            width, but the legacy About section still bleeds 6px at ≤600px. `clip`,
            not `hidden` — hidden would make main a scroll container and break
            position: sticky (the case-study ToC). */}
        <main id="main" tabIndex={-1} className="relative min-h-dvh overflow-x-clip outline-none">
          {children}
        </main>
      </SiteShell>

      <SiteFooter />
    </>
  );
}
