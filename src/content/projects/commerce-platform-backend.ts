import type { CaseStudy } from "./index";
import { clientRef } from "@/content/client";

// Every figure traces to docs/CV-PROJECT-NOTES.md (sources on the Metric
// objects; prose citations were removed from the public copy).
// Anonymised per plan §10.1 until naming is confirmed; client naming is in
// src/content/client.ts. Confidentiality: only problems that were found AND
// fixed are described, at the level of the engineering idea — no internal
// hostnames, ports, env names, document names, open risks, or colleagues.

const C = clientRef("short");

export const commercePlatformBackend: CaseStudy = {
  slug: "commerce-platform-backend",
  title: "Commerce, events and ticketing platform — backend",
  description:
    "Sole backend engineer: NestJS + PostgreSQL API, 28 modules, 249 endpoints, 829 passing tests, empty repository to production in eleven weeks.",

  summary: {
    role: "Sole backend engineer",
    timeline: "27 Jul – 9 Oct 2026 · 11 weeks",
    team: "1 backend (me) · 1 frontend · DevOps",
    stack: ["TypeScript", "NestJS 11", "PostgreSQL 16", "Prisma 6", "Jest 30", "PayPal REST", "Stripe", "Docker", "GitHub Actions"],
    outcome: "Live in production with 829 passing tests and a documented zero-downtime migration policy",
  },

  headlineResults: [
    { value: 249, label: "HTTP endpoints across 28 modules", source: "CV notes §3 (A3.2)" },
    { value: 829, label: "tests passing in 54 suites", source: "CV notes §3 (A3.6)" },
    { value: 82, label: "migrations, zero-downtime policy", source: "CV notes §3, §7" },
    { value: 11, label: "weeks from empty repo to production", source: "CV notes §4" },
  ],

  context: [
    `${C.charAt(0).toUpperCase()}${C.slice(1)} needed one backend behind three consumers — a public marketing site, a customer dashboard and an admin back office — selling books, digital products, video courses, consultations, workshops and ticketed events.`,
    "That scope puts money, VAT, statutory cancellation rights and finite seat inventory in one system. Every one of those is a correctness problem before it is a feature: a refund rounded the wrong way, a seat sold twice, or a migration that breaks the version still serving traffic is a customer-facing failure, not a bug report.",
    "The brief was the full backend from an empty repository, to production, in a fixed window — with the frontend built in parallel by another developer against an API contract I wrote.",
  ],

  role: [
    "I owned the application and its data model end to end — 336 of 363 commits on the release branch, every module, the Prisma schema, and the repository's documentation.",
    "The deployment pipeline, container and compose files were owned by DevOps; I audited them rather than wrote them, and my ten findings fed back into that work.",
    "I also wrote the contract the frontend developer built against (1,306 lines for the events release), the release runbook with before/after SQL and a rollback path, and a 27-section manual test plan.",
  ],

  hardProblems: [
    {
      id: "capacity",
      title: "Race-safe seat and capacity claims",
      hook: "Two customers both see six seats left and both ask for four.",
      problem: [
        "Ticket capacity, discount-code uses and door admissions are all finite. The obvious implementation — read how many remain, decide, then write — leaves a window between the read and the write. Two overlapping requests both pass the check and the event oversells.",
      ],
      approach: [
        "Move the decision into the database. Capacity is claimed in one statement whose availability test lives in its own WHERE clause, so the row is only updated if the claim still fits at the moment the write lands. If zero rows change, the claim failed — no exception handling, no retry loop.",
        "The same shape covers every limited thing: state transitions use a conditional update with the expected current status in the WHERE and check the affected count; door admission uses one upsert whose insert and conflict branches both test the limit. Releases are floored at zero so a double release cannot drive a count negative.",
        "Where a rule spans rows and no index can express it — a customer may hold at most one unpaid booking anywhere — the check sits inside the write transaction behind a row lock on the customer's own row.",
      ],
      why: [
        "The ORM could not compare one column against another in a where clause, so the claim is raw SQL. That is the right trade: one line of SQL that cannot race beats a transaction that only looks safe.",
        "Catching a unique-violation does not restore an aborted PostgreSQL transaction, so uniqueness tests either live inside a single statement's WHERE or are caught outside the transaction — a subtlety that is now written into the engineering rules.",
      ],
      result: [
        "91 conditional updateMany claims and 69 $transaction call sites across the codebase, one canonical pattern.",
        "Proven by two overlapping transactions on a real PostgreSQL instance admitting exactly one — and the concurrency tests fail when the lock is removed, which is the rule: a test of a concurrency guard must fail without the guard or it is not testing it.",
      ],
      snippet: {
        lang: "sql",
        caption: "The claim is the WHERE clause. Zero rows affected means the seats were gone.",
        code: `UPDATE ticket_type
SET    sold = sold + $2
WHERE  id = $1
  AND  sold + $2 <= capacity
RETURNING sold, capacity;

-- release: never below zero, even on a double release
UPDATE ticket_type
SET    sold = GREATEST(sold - $2, 0)
WHERE  id = $1;`,
      },
    },
    {
      id: "payments",
      title: "Payment and refund correctness",
      hook: "Three routes to charging a customer who had already cancelled — and refund bands that paid less for more notice.",
      problem: [
        "Ticket checkout holds seats, so an unpaid order is swept away after a hold window — but the customer may still have the payment provider's page open. Reading the path end to end found three ways money could move for an order that no longer existed: neither cancellation path closed the provider session, the PayPal handler captured on approval unconditionally, and a late payment was logged and queued rather than refunded.",
        "Separately, reading the written ticket-refund policy against the code showed the standard bands were inverted: a £50.00 ticket cancelled 90 days out refunded £42.50, while one cancelled at 45 days refunded £50.00. The thresholds were spread across three functions, so nobody could see the whole scale at once.",
        "And a session-expiry bug was caught by reasoning rather than testing: the card provider refuses any session expiring under 30 minutes from creation, and the expiry was computed as order creation + 30 minutes — every card checkout would have failed by milliseconds.",
      ],
      approach: [
        "Both cancellation paths now close the provider session first — the only step that prevents a charge rather than reversing one. The webhook refuses a capture when approval arrives for an order no longer pending. A payment that lands anyway is refunded in full, automatically — then narrowed to cancelled orders only, so a legitimately part-refunded sale is never over-refunded.",
        "Refund bands were consolidated into one table and locked with a monotonic property test: for every ticket category, a price set including odd values, and every day of notice from 400 down to 0, the refund may never rise as notice falls.",
        "The session window moved to 31 minutes measured from the provider call and stored on the payment, so a resumed checkout replays the same figure and the idempotency key still matches. Hold windows were then aligned to that lifetime plus a buffer for late approvals.",
      ],
      why: [
        "A declared response type is a claim, not a fact: a provider omitted an amount field it had declared, and a real refund was recorded as a failure because reading the field threw. Once a provider has answered success, nothing afterwards is its fault — a mapping error after a 2xx means the money moved and the record did not, which needs the opposite remedy to a refusal.",
        "My own first fix silently did nothing: it looked for a pending payment, and both callers had already marked the payment failed inside the cancelling transaction. I found it by reading the log after a local run and noticing a line that should have been there was absent.",
      ],
      result: [
        "Three defences where there had been none; the test for the session-closing step fails if the status filter is put back.",
        "With the old refund bands restored, 11 tests fail including the monotonic one. With the old hold window restored, 5 fail.",
      ],
      snippet: {
        lang: "ts",
        caption: "The property that keeps the bands honest: more notice can never mean less money.",
        code: `it.each(categories)("refund never rises as notice falls (%s)", (category) => {
  for (const price of [1000, 4999, 5000, 12345]) {
    let previous = Infinity;
    for (let days = 400; days >= 0; days--) {
      const refund = refundFor({ category, priceMinor: price, daysNotice: days });
      expect(refund).toBeLessThanOrEqual(previous);
      previous = refund;
    }
  }
});`,
      },
    },
    {
      id: "migrations",
      title: "Zero-downtime migrations",
      hook: "The question is not \"does the new code work with this?\" but \"does the code still in production work with this?\"",
      problem: [
        "The pipeline applies database migrations while the previous container is still serving traffic, then swaps containers. For the seconds or minutes in between, the old code runs against the new schema. A migration that is correct for the new release can take the live site down.",
      ],
      approach: [
        "I wrote the migration policy the deployment depends on: a safe/unsafe table for single-release changes, and a two-release add-backfill-switch-drop pattern for renames and newly required columns.",
        "Enum changes are isolated into their own migrations and proven on a throwaway PostgreSQL 16 container from empty and over the previous migrations before the development database sees them. Removing an enum value is a two-release change even when no row uses it, because exhaustive maps over the enum fail at runtime under old code.",
        "Sequential document numbers come from a PostgreSQL sequence allocated inside the caller's transaction — never from a row count, which races and is wrong after any deletion.",
      ],
      why: [
        "Backward compatibility with the running version is the only invariant that matters during a rolling deploy. Writing it down as a policy, with the patterns, means it is applied by default rather than rediscovered at 2 a.m.",
      ],
      result: [
        "82 migrations applied through that policy; the events release carried a runbook with read-only SQL to capture before-figures, verification steps and an \"if it has to come back\" section.",
      ],
      snippet: {
        lang: "sql",
        caption: "A rename as two releases. Release 1 is compatible with the old code; release 2 drops the old column once nothing reads it.",
        code: `-- release 1: add, backfill, keep both in step
ALTER TABLE "order" ADD COLUMN customer_email text;
UPDATE "order" SET customer_email = email WHERE customer_email IS NULL;
-- application writes both columns from here

-- release 2 (after release 1 is fully live):
ALTER TABLE "order" ALTER COLUMN customer_email SET NOT NULL;
ALTER TABLE "order" DROP COLUMN email;`,
      },
    },
    {
      id: "third-party-failures",
      title: "Classifying third-party failures",
      hook: "A retry that could never succeed was sending a deleted account's address to a provider once an hour, indefinitely.",
      problem: [
        "The newsletter sync pushed subscribers to an external provider and retried failures hourly. A live incident showed two defects in one: the provider was rejecting every request with a permanent, account-level error that no retry could fix — and one of the rows being retried belonged to a user who had deleted their account, so their personal data was leaving the system on a schedule.",
      ],
      approach: [
        "Eligibility is checked at send time, not sign-up time, because a subscriber who was eligible at confirmation may not be an hour later — deleted, unsubscribed, or without a consent record.",
        "Failures are classified three ways. Permanent whole-account errors stop all sending for a six-hour cool-down with one log line per window. Permanent per-subscriber errors suppress that subscriber. Transient errors retry with doubling backoff to a fixed cap.",
        "Suppression is a marker on the row that the sweep excludes, and the synced timestamp is stamped only when something was actually sent, so the whole backlog stays findable.",
      ],
      why: [
        "Retrying is only correct when the next attempt can succeed. Treating a 403 like a timeout is not resilience; it is a privacy incident on a timer. The classification makes the system's behaviour match what each failure actually means.",
        "Every log line masks the email address and redacts the API key — including addresses a provider echoes back inside its own error body.",
      ],
      result: [
        "Fixed and shipped the same day it was diagnosed; five removal proofs in the service's spec fail if any branch of the classification is deleted.",
      ],
      snippet: {
        lang: "ts",
        caption: "Three kinds of failure, three different correct responses.",
        code: `type Outcome = "cooldown-account" | "suppress-subscriber" | "retry-later";

function classify(status: number | null): Outcome {
  if (status === 401 || status === 403 || status === 404) return "cooldown-account";
  if (status === 400 || status === 422) return "suppress-subscriber";
  return "retry-later"; // 429, 5xx, transport errors
}`,
      },
    },
    {
      id: "money",
      title: "Money arithmetic that reconciles",
      hook: "4999 means £49.99. There is no float anywhere near a price.",
      problem: [
        "Prices, VAT, discounts, apportioned refunds and invoice numbers all have to agree with each other to the penny, forever. Floating point, independent rounding and row-count-based numbering each break that in a way that only shows up in an audit.",
      ],
      approach: [
        "Integer minor units everywhere — stated as a non-negotiable rule and documented in the schema itself. VAT is computed backwards from inclusive prices in basis points through one shared utility; tax falls on what a line actually charges, so a discount reduces the tax with it.",
        "When an amount is split across lines, apportionment is cumulative: each share is rounded against the running total, never independently, because independent rounding overshoots before the last line and clamping the tail cannot repair it.",
        "Invoices, credit notes and tickets carry gapless sequential numbers across seven document types, allocated inside the caller's transaction so the number and the document commit together.",
        "Store credit is withheld rather than absorbed when applying it would leave a remainder below the provider's minimum charge, because absorption is arithmetically impossible.",
      ],
      why: [
        "The direction rule decides everything: what came in as credit goes back as credit, what came in as money goes back as money. Every refund path follows it.",
        "A credit kept its original expiry however long an order ran, so a customer who spent a credit with three days left and waited two weeks for approval got back something that had already expired — every ledger agreed and the customer had nothing. Restored credit now carries the later of its original expiry and 90 days, on money already taken; an unpaid order still restores at the original expiry, or \"apply, cancel, repeat\" would renew a credit forever.",
      ],
      result: [
        "25 source files work in minor units; VAT and apportionment have one implementation each and reimplementation is forbidden by the written rules.",
      ],
      snippet: {
        lang: "ts",
        caption: "Cumulative apportionment: the last line gets whatever is left, and the parts always sum to the whole.",
        code: `function apportion(totalMinor: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  let allocated = 0;
  let running = 0;
  return weights.map((w, i) => {
    running += w;
    const target = Math.round((totalMinor * running) / sum); // cumulative, not per line
    const share = i === weights.length - 1 ? totalMinor - allocated : target - allocated;
    allocated += share;
    return share;
  });
}`,
      },
    },
  ],

  testing: {
    metrics: [
      { value: 829, label: "tests passing", source: "CV notes §3 (A3.6)" },
      { value: 54, label: "suites, 81 s", source: "CV notes §3 (A3.6)" },
      { value: 19297, label: "lines of specs", source: "CV notes §3 (A3.8)" },
      { value: 11, label: "removal proofs", source: "CV notes §6 (A6.6)" },
    ],
    paragraphs: [
      "The suite grew from two spec files to 54 suites and 829 tests. The tests that matter most are removal proofs: a test that fails when the guard it covers is deleted. If a concurrency test still passes without the lock, it is not testing the lock — so the concurrency fakes model a row lock, commit visibility and rollback rather than resolving calls in order.",
      "Alongside the unit suite, a 27-section manual test plan records every run against a real environment, and the release runbook captures before-figures as read-only SQL so a release can be verified against what was actually in the database rather than against the pipeline's report.",
    ],
  },

  aiTooling: {
    metrics: [
      { value: 49, suffix: "%", label: "of my commits carry an AI co-author trailer", source: "CV notes §4 (A4.5)" },
      { value: 165, label: "of 336 commits", source: "CV notes §4 (A4.5)" },
    ],
    paragraphs: [
      "I work with AI tooling openly: 165 of my 336 commits on this project carry a Co-Authored-By trailer. The number is on this page because it is in the git history, and because the way I use it is the point.",
      "Nothing lands without being read. The tool drafts; I review every line against the written engineering rules, run the suite, and add the removal proof that shows the change is doing what it claims. The refund-band inversion, the three double-charge routes and the session-expiry bug were all found by reading — the policy against the code, the log against the expectation — not by generation.",
      "The result is faster delivery with the same bar: the rules in the repository's engineering guide each trace to a real defect, and the tests that enforce them fail when the guard is removed.",
    ],
  },

  next: [
    "Move the manual test plan's most repeated sections into end-to-end tests against a disposable database, so release verification is a command rather than a checklist.",
    "Add a contract test between the frontend and backend repositories, since the cross-repository audit found drift that only a shared contract catches early.",
  ],

  withheld: [
    "Internal hostnames, ports, droplet or proxy configuration, environment variable names, internal document names.",
    "The specific double-refund risk at two replicas, beyond the generic single-instance note above.",
    "Names of colleagues; the client's name, URL and API host while anonymised.",
    "Pipeline stage internals and scanning tools beyond 'four-stage pipeline with security gates'.",
  ],

  toConfirm: [
    "Whether to name the client (plan §9) — flips src/content/client.ts.",
    "Whether 'What I would do next' may mention the single-instance precondition at all, or should be reduced to the second and third items.",
    "Whether the newsletter provider may be named.",
  ],
};
