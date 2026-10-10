import { ArrowRight, Download, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Magnetic } from "@/components/ui/magnetic";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

import { HeroSocials } from "./hero-socials";
import { ProofPanel } from "./proof-panel";
import { TechMarquee } from "./tech-marquee";

// Server component. The H1 is the LCP element: it is plain text in the SSR
// HTML, never opacity:0. The entrance is CSS-only (globals.css keyframes) —
// per-word covers in the page background colour wipe away, so the text is
// painted from the first frame and the reveal costs no LCP time and no JS.
// The only client islands are the magnetic wrapper and the social tooltips.

const HEADLINE = "I ship production systems where correctness is the product.";

const LEDE =
  "Sole backend engineer on a NestJS + PostgreSQL commerce and ticketing platform — 28 modules, 249 endpoints, 829 passing tests, empty repository to live at api.mrosew.com in 11 weeks.";

/** Stagger offsets (ms) for the CSS entrance. All transform/opacity. */
const T = { eyebrow: 0, words: 80, lineGap: 120, lede: 420, ctas: 540, socials: 640, panel: 300, marquee: 760 };

export default function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className={cn(
        "relative flex min-h-[100svh] flex-col justify-center",
        // header height + safe area on top; room for the marquee below
        "pt-[calc(4rem+env(safe-area-inset-top)+2rem)] pb-10 md:pt-[calc(4rem+env(safe-area-inset-top)+3rem)]"
      )}
    >
      <Container className="flex flex-1 flex-col justify-center gap-12 lg:gap-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* ---- Text column ---- */}
          <div className="flex min-w-0 flex-col items-start">
            <div
              className="animate-fade-in flex flex-wrap items-center gap-x-4 gap-y-2"
              style={{ animationDelay: `${T.eyebrow}ms` }}
            >
              <p className="label">
                {site.name} — {site.role}
              </p>
              {site.availability.open ? (
                <Badge variant="status" dot className="max-w-full whitespace-normal text-left leading-tight">
                  {site.availability.label}
                </Badge>
              ) : null}
            </div>

            {/* One text node, one element: the whole headline is the LCP candidate
                from the first paint. Three line-sized covers in the page background
                colour wipe off in sequence (transform only) for a line-mask reveal
                without splitting the text into spans. */}
            <h1
              id="hero-heading"
              className="relative mt-6 text-[clamp(2.25rem,1.3rem+3.6vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-fg"
            >
              {HEADLINE}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col">
                {[0, 1, 2, 3].map((line) => (
                  <span
                    key={line}
                    className="animate-wipe-cover block flex-1 bg-bg"
                    style={{ animationDelay: `${T.words + line * T.lineGap}ms` }}
                  />
                ))}
              </span>
            </h1>

            <p
              className="animate-fade-up measure-lede mt-6 text-body-lg text-fg-muted"
              style={{ animationDelay: `${T.lede}ms` }}
            >
              {LEDE}
            </p>

            <div
              className="animate-fade-up mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
              style={{ animationDelay: `${T.ctas}ms` }}
            >
              <Magnetic className="w-full sm:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#projects">
                    View the case study <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
              </Magnetic>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <a href={site.resumePdf} download>
                  <Download aria-hidden="true" /> Download CV
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
                <a href="#contact">
                  <Mail aria-hidden="true" /> Contact
                </a>
              </Button>
            </div>

            <div className="animate-fade-up mt-8" style={{ animationDelay: `${T.socials}ms` }}>
              <HeroSocials />
            </div>
          </div>

          {/* ---- Proof panel ---- */}
          <div className="animate-fade-in min-w-0" style={{ animationDelay: `${T.panel}ms` }}>
            <ProofPanel />
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: `${T.marquee}ms` }}>
          <TechMarquee />
        </div>
      </Container>
    </section>
  );
}
