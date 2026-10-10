import type { Metric } from "@/types";

// Every figure here was produced by a command that was actually run and is
// recorded in docs/CV-PROJECT-NOTES.md. `source` names the section. A metric
// without a source does not go on the site.

/** Homepage proof strip — six figures, release/events branch unless noted. */
export const heroMetrics: Metric[] = [
  { value: 249, label: "HTTP endpoints shipped", source: "CV notes §3 — route decorators, release/events (A3.2)" },
  { value: 829, label: "tests passing, 54 suites", source: "CV notes §3 — npm test on release/events, 81 s (A3.6)" },
  { value: 59, label: "Prisma data models", source: "CV notes §3 — schema.prisma, release/events (A3.3)" },
  { value: 82, label: "database migrations", source: "CV notes §3 — prisma/migrations, release/events (A3.4)" },
  { value: 11, label: "weeks, empty repo to production", source: "CV notes §4 — 27 July to 9 October 2026 (A4.2)" },
  { value: 336, label: "commits authored", source: "CV notes §4 — 336 of 363 on release/events (A4.1)" },
];

/** Secondary figures — used in the case study, not the homepage strip. */
export const caseStudyMetrics: Metric[] = [
  { value: 28, label: "modules", source: "CV notes §3 (A3.1)" },
  { value: 60, label: "controllers", source: "CV notes §3 (A3.9)" },
  { value: 81, label: "services", source: "CV notes §3 (A3.9)" },
  { value: 15, label: "scheduled jobs", source: "CV notes §3 (A3.10)" },
  { value: 194, label: "error codes", source: "CV notes §3 (A3.11)" },
  { value: 63213, label: "lines of TypeScript, specs excluded", source: "CV notes §3 (A3.8)" },
  { value: 19297, label: "lines of specs", source: "CV notes §3 (A3.8)" },
  { value: 91, label: "conditional updateMany claims", source: "CV notes §6 (A6.2)" },
  { value: 69, label: "$transaction call sites", source: "CV notes §6 (A6.2)" },
  { value: 11, label: "removal proofs in tests", source: "CV notes §6 (A6.6)" },
];

/** Facts for the hero proof panel — strings, not count-ups. */
export const proofPanelLines = [
  { key: "host", value: "api.mrosew.com", note: "live", source: "CV notes §7" },
  { key: "stack", value: "NestJS 11 · PostgreSQL 16 · Prisma 6", source: "CV notes §2" },
  { key: "endpoints", value: "249 across 28 modules", source: "CV notes §3" },
  { key: "tests", value: "829 passing · 54 suites · 81 s", source: "CV notes §3 (A3.6)" },
  { key: "migrations", value: "82, zero-downtime policy", source: "CV notes §3, §7" },
  { key: "money", value: "integer minor units, no floats", source: "CV notes §6 (A6.1)" },
] as const;
