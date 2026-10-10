import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";

import { ArchitectureDiagram } from "@/components/case-study/architecture-diagram";
import { CaseHeader } from "@/components/case-study/case-header";
import { CaseSection, Paragraphs } from "@/components/case-study/case-section";
import { HardProblem } from "@/components/case-study/hard-problem";
import { Toc, type TocItem } from "@/components/case-study/toc";
import { MetricTile } from "@/components/sections/proof/metric-tile";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { caseStudies, getCaseStudy } from "@/content/projects";
import { site } from "@/data/site";
import { SITE_URL } from "@/lib/site";

// Server component, statically generated per slug, with its own metadata.

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const url = `${SITE_URL}/projects/${study.slug}`;
  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: url },
    openGraph: { title: study.title, description: study.description, url, type: "article" },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const toc: TocItem[] = [
    { id: "context", label: "Context & problem" },
    { id: "role", label: "My role" },
    { id: "architecture", label: "Architecture" },
    { id: "hard-problems", label: "Hard problems", children: study.hardProblems.map((p) => ({ id: p.id, label: p.title })) },
    { id: "testing", label: "Metrics & testing" },
    { id: "ai-tooling", label: "How I work with AI tooling" },
    { id: "next", label: "What I would do next" },
  ];

  return (
    <article className="pt-[calc(4rem+env(safe-area-inset-top)+3rem)] pb-section">
      <Container>
        <CaseHeader study={study} />

        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 md:grid-cols-4">
          {study.headlineResults.map((m) => (
            <li key={m.label}>
              <MetricTile metric={m} />
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Toc items={toc} />
          </aside>

          <div className="flex min-w-0 flex-col gap-16 lg:gap-20">
            <CaseSection id="context" title="Context & problem">
              <Paragraphs items={study.context} />
            </CaseSection>

            <CaseSection id="role" title="My role">
              <Paragraphs items={study.role} />
            </CaseSection>

            <CaseSection id="architecture" title="Architecture" className="[&>div]:max-w-none">
              <ArchitectureDiagram />
            </CaseSection>

            <section id="hard-problems" aria-labelledby="hard-problems-title" className="scroll-mt-28">
              <h2 id="hard-problems-title" className="text-h2 text-fg">
                Hard problems
              </h2>
              <p className="measure mt-4 text-body text-fg-muted">
                Each of these was found and fixed; the write-up stays at the level of the engineering idea.
              </p>
              <div className="mt-10 flex flex-col gap-16">
                {study.hardProblems.map((p, i) => (
                  <HardProblem key={p.id} problem={p} index={i} />
                ))}
              </div>
            </section>

            <CaseSection id="testing" title="Metrics & testing" className="[&>div]:max-w-none">
              <ul className="not-prose grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
                {study.testing.metrics.map((m) => (
                  <li key={m.label}>
                    <MetricTile metric={m} />
                  </li>
                ))}
              </ul>
              <div className="measure mt-2 flex flex-col gap-4">
                <Paragraphs items={study.testing.paragraphs} />
              </div>
            </CaseSection>

            <CaseSection id="ai-tooling" title="How I work with AI tooling" className="[&>div]:max-w-none">
              <ul className="not-prose grid max-w-md grid-cols-2 gap-6">
                {study.aiTooling.metrics.map((m) => (
                  <li key={m.label}>
                    <MetricTile metric={m} />
                  </li>
                ))}
              </ul>
              <div className="measure mt-2 flex flex-col gap-4">
                <Paragraphs items={study.aiTooling.paragraphs} />
              </div>
            </CaseSection>

            <CaseSection id="next" title="What I would do next">
              <ul className="flex list-disc flex-col gap-3 pl-5 marker:text-brand">
                {study.next.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </CaseSection>

            <div className="flex flex-col gap-4 rounded-xl border border-line bg-bg-elevated p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="text-h3 text-fg">Want this level of care on your system?</p>
                <p className="mt-1 text-sm text-fg-muted">Open to backend and full-stack roles. Remote, {site.location.timezoneLabel}.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/#contact">
                    Get in touch <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <a href={site.resumePdf} download>
                    <Download aria-hidden="true" /> Download CV
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
