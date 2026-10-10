import type { HardProblem as HardProblemData } from "@/content/projects";

import { CaseSection, Paragraphs } from "./case-section";
import { CodeBlock } from "./code-block";

// Server component. Problem → approach → why → result → snippet, each
// labelled so the structure reads the same for every hard problem.

function Part({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
      <p className="label pt-1.5">{label}</p>
      <div className="flex flex-col gap-3">
        <Paragraphs items={items} />
      </div>
    </div>
  );
}

export function HardProblem({ problem, index }: { problem: HardProblemData; index: number }) {
  return (
    <CaseSection id={problem.id} title={problem.title} eyebrow={`Hard problem ${String(index + 1).padStart(2, "0")}`} level={3}>
      <p className="text-body-lg text-fg">{problem.hook}</p>
      <div className="mt-2 flex flex-col gap-6">
        <Part label="Problem" items={problem.problem} />
        <Part label="Approach" items={problem.approach} />
        <Part label="Why" items={problem.why} />
        <Part label="Result" items={problem.result} />
      </div>
      {problem.snippet ? <CodeBlock snippet={problem.snippet} /> : null}
    </CaseSection>
  );
}
