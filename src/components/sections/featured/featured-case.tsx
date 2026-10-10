import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MetricTile } from "@/components/sections/proof/metric-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { featuredCaseStudy as study } from "@/content/projects";
import { clientRef } from "@/content/client";

// Server component: the homepage teaser for the featured case study —
// problem, role, headline results, the hard problems as a list, one CTA.

export function FeaturedCase() {
  const href = `/projects/${study.slug}`;

  return (
    <Section id="work" aria-labelledby="featured-title" className="border-b border-line">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <SectionHeader
          eyebrow="Featured case study"
          title={study.title}
          lede={`Sole backend engineer for ${clientRef("short")} — from an empty repository to production in eleven weeks.`}
        />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <div className="grid gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
              <p className="label pt-1">Problem</p>
              <p className="measure text-body text-fg-muted">{study.context[1]}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
              <p className="label pt-1">My role</p>
              <p className="measure text-body text-fg-muted">{study.role[0]}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
              <p className="label pt-1">Hard problems</p>
              <ul className="flex flex-col gap-2">
                {study.hardProblems.map((p) => (
                  <li key={p.id}>
                    <Link href={`${href}#${p.id}`} className="group/p inline-flex items-baseline gap-2 text-fg hoverable:hover:text-brand">
                      <span className="font-mono text-xs text-fg-faint">→</span>
                      <span>
                        <span className="font-medium">{p.title}</span>
                        <span className="text-fg-subtle"> — {p.hook}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href={href}>
                  Read the case study <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <p className="text-sm text-fg-subtle">About a 9-minute read.</p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6 rounded-xl border border-line bg-bg-elevated p-6 md:p-8">
            <p className="label">Headline results</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-8">
              {study.headlineResults.map((m) => (
                <li key={m.label}>
                  <MetricTile metric={m} />
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-1.5 border-t border-line pt-5">
              {study.summary.stack.map((s) => (
                <li key={s}>
                  <Badge size="sm">{s}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
