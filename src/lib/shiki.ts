import { createHighlighter, type Highlighter } from "shiki";

// Build-time highlighter singleton. Used only from server components, so the
// output is static HTML and no highlighter JS reaches the browser. Dual theme:
// both colours are emitted as CSS variables and globals.css picks one per
// data-theme.

const LANGS = ["sql", "typescript", "tsx", "bash", "json"] as const;

let instance: Promise<Highlighter> | null = null;

function highlighter() {
  instance ??= createHighlighter({
    themes: ["github-light", "github-dark-dimmed"],
    langs: [...LANGS],
  });
  return instance;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const h = await highlighter();
  const resolved = lang === "ts" ? "typescript" : LANGS.includes(lang as (typeof LANGS)[number]) ? lang : "text";
  return h.codeToHtml(code, {
    lang: resolved,
    themes: { light: "github-light", dark: "github-dark-dimmed" },
    defaultColor: false,
  });
}
