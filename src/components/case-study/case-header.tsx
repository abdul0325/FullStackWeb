import { Badge } from "@/components/ui/badge";
import type { CaseStudy } from "@/content/projects";
import { clientRef } from "@/content/client";

// Server component: title + summary bar (role · timeline · team · stack · outcome).

export function CaseHeader({ study }: { study: CaseStudy }) {
  const rows: Array<[string, React.ReactNode]> = [
    ["Role", study.summary.role],
    ["Timeline", study.summary.timeline],
    ["Team", study.summary.team],
    [
      "Stack",
      <ul key="stack" className="flex flex-wrap gap-1.5">
        {study.summary.stack.map((s) => (
          <li key={s}>
            <Badge size="sm">{s}</Badge>
          </li>
        ))}
      </ul>,
    ],
    ["Outcome", study.summary.outcome],
  ];

  return (
    <header className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="label">Case study — {clientRef("short")}</p>
        <h1 className="max-w-[22ch] text-h1 text-fg">{study.title}</h1>
        <p className="measure-lede text-body-lg text-fg-muted">{study.description}</p>
      </div>

      <dl className="grid gap-x-8 gap-y-4 rounded-xl border border-line bg-bg-elevated p-5 sm:grid-cols-2 md:p-6 lg:grid-cols-5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex min-w-0 flex-col gap-1.5">
            <dt className="label">{k}</dt>
            <dd className="text-sm leading-relaxed text-fg">{v}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
