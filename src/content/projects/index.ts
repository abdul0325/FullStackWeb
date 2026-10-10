import type { Metric } from "@/types";

// Case-study content model. Everything is plain data so pages stay server
// components. Content lives next to this file, one module per project.

export interface CodeSnippet {
  lang: "sql" | "ts" | "tsx" | "bash" | "json" | "text";
  code: string;
  caption?: string;
}

export interface HardProblem {
  id: string;
  title: string;
  /** One-line hook for the ToC and the featured teaser. */
  hook: string;
  problem: string[];
  approach: string[];
  why: string[];
  result: string[];
  snippet?: CodeSnippet;
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** For metadata and cards. ≤160 chars. */
  description: string;
  summary: {
    role: string;
    timeline: string;
    team: string;
    stack: string[];
    outcome: string;
  };
  headlineResults: Metric[];
  context: string[];
  role: string[];
  hardProblems: HardProblem[];
  testing: { metrics: Metric[]; paragraphs: string[] };
  aiTooling: { paragraphs: string[]; metrics: Metric[] };
  next: string[];
  /** Phrases I must not publish about this system — kept here as a reminder. */
  withheld: string[];
  /** Items left for the owner to decide (plan §9). */
  toConfirm: string[];
}

import { commercePlatformBackend } from "./commerce-platform-backend";

export const caseStudies: CaseStudy[] = [commercePlatformBackend];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export const featuredCaseStudy = commercePlatformBackend;
