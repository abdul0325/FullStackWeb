import { proofPanelLines } from "@/data/metrics";

// Server component, zero JS. A terminal-styled card of real facts (each line
// cites its source in a title). Themed through tokens; the only decoration
// is the window chrome. Replaces the 177-line client terminal.

export function ProofPanel() {
  return (
    <figure
      aria-label="Production facts"
      className="w-full overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-lift"
    >
      <figcaption className="flex items-center gap-2 border-b border-line bg-bg-subtle px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
        </span>
        <span className="ml-2 truncate font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
          mrosew-backend — production
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.6875rem] text-success">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
          live
        </span>
      </figcaption>

      <dl className="grid gap-y-2.5 p-4 font-mono text-[0.8125rem] leading-relaxed sm:p-5 sm:text-sm">
        {proofPanelLines.map((line) => (
          <div key={line.key} className="grid grid-cols-[minmax(5.5rem,auto)_1fr] gap-x-3" title={line.source}>
            <dt className="text-fg-subtle">
              <span aria-hidden="true" className="text-brand">
                ${" "}
              </span>
              {line.key}
            </dt>
            <dd className="min-w-0 break-words text-fg">
              {line.value}
              {"note" in line && line.note ? <span className="ml-2 text-fg-subtle">— {line.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center gap-2 border-t border-line px-4 py-2 font-mono text-[0.6875rem] text-fg-faint sm:px-5">
        <span aria-hidden="true" className="text-brand">
          $
        </span>
        <span>every figure above traces to a command that was run</span>
      </div>
    </figure>
  );
}
