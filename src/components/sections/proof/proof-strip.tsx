import { Container } from "@/components/ui/container";
import { heroMetrics } from "@/data/metrics";

import { MetricTile } from "./metric-tile";

// Server component. Six real figures; each tile's final value is in the SSR
// HTML and is what screen readers get. The count-up is a small client island
// that only animates the visible digits once on view.

export function ProofStrip() {
  return (
    <section aria-labelledby="proof-heading" className="relative border-y border-line bg-bg-subtle/60">
      <Container className="py-10 md:py-12">
        <h2 id="proof-heading" className="sr-only">
          Proof in numbers
        </h2>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
          {heroMetrics.map((m) => (
            <li key={m.label} className="min-w-0">
              <MetricTile metric={m} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
