import { highlight } from "@/lib/shiki";
import { CopyButton } from "@/components/ui/copy-button";
import type { CodeSnippet } from "@/content/projects";

// Async server component: Shiki runs at build time and emits static HTML.
// The copy button is the only client island.

export async function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const html = await highlight(snippet.code, snippet.lang);

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-lg border border-line bg-code-bg">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-bg-subtle px-4 py-2">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">{snippet.lang}</span>
        <CopyButton value={snippet.code} variant="ghost" />
      </div>
      {/* Scrolls inside its own box; never widens the page. */}
      <div
        className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:whitespace-pre"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {snippet.caption ? (
        <figcaption className="border-t border-line px-4 py-2.5 text-sm text-fg-muted">{snippet.caption}</figcaption>
      ) : null}
    </figure>
  );
}
