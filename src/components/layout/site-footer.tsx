import { ArrowUpRight } from "lucide-react";

import { navigation } from "@/data/navigation";
import { site } from "@/data/site";
import { BackToTop } from "@/components/layout/back-to-top";
import { TextLink } from "@/components/ui/text-link";

// Server component. Reads navigation.ts and site.ts — the same sources the
// header uses — so the footer can never drift from the nav.

const BUILD_DATE = new Date().toISOString().slice(0, 10);

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-bg-subtle">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Identity */}
          <div className="flex flex-col gap-4 md:col-span-5">
            <div>
              <p className="text-h3 text-fg">{site.name}</p>
              <p className="mt-1 text-sm text-fg-muted">{site.role}</p>
            </div>
            <p className="measure-lede text-sm text-fg-muted">{site.positioning}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <li>
                <TextLink href={site.socials.github} variant="nav">
                  GitHub
                </TextLink>
              </li>
              <li>
                <TextLink href={site.socials.linkedin} variant="nav">
                  LinkedIn
                </TextLink>
              </li>
              <li>
                <TextLink href={`mailto:${site.email}`} variant="nav" external={false}>
                  {site.email}
                </TextLink>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <nav aria-label="Sections" className="md:col-span-3">
            <p className="label mb-4">Sections</p>
            <ul className="flex flex-col gap-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <TextLink href={item.href} variant="nav" className="text-sm">
                    {item.title}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere */}
          <div className="md:col-span-4">
            <p className="label mb-4">Elsewhere</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <TextLink href={site.resumePdf} variant="nav" external={false} className="text-sm" target="_blank" rel="noopener noreferrer">
                  Résumé (PDF) <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-70" />
                </TextLink>
              </li>
              <li className="text-fg-muted">
                {site.location.city}, {site.location.country} · {site.location.timezoneLabel}
              </li>
              <li className="text-fg-muted">
                {site.location.remote ? "Remote" : null}
                {site.location.remote && site.location.relocation ? " · " : null}
                {site.location.relocation ? "Open to relocation" : null}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Built with Next.js 16, React 19, Tailwind CSS v4 and Motion.
          </p>
          <p className="font-mono">Last updated {BUILD_DATE}</p>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
