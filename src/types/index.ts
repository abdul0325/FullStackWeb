// Shared content types. Content modules in src/content and src/data satisfy
// these; components consume them. Keep this file free of React imports so
// server and client code can both use it.

export interface Metric {
  /** The figure as rendered, e.g. 249. */
  value: number;
  /** Optional suffix rendered after the number, e.g. "+" or "%". Use sparingly. */
  suffix?: string;
  label: string;
  /** Where the figure came from — a section of docs/CV-PROJECT-NOTES.md. Required. */
  source: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  /** One line: what it achieved, not what it is. */
  outcome: string;
  summary: string;
  role: string;
  year: number;
  image: string;
  technologies: string[];
  links: ProjectLink[];
  featured?: boolean;
  metrics?: Metric[];
}

export interface Experience {
  role: string;
  organisation: string;
  /** ISO month, e.g. "2026-07". */
  start: string;
  /** ISO month or null for current. */
  end: string | null;
  bullets: string[];
  technologies: string[];
}

export interface Principle {
  statement: string;
  evidence: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  organisation: string;
}

export interface SkillGroup {
  title: string;
  /** One short line of evidence, never a percentage or a self-assigned level. */
  evidence: string;
  skills: Array<{
    name: string;
    /** simple-icons slug, e.g. "nestjs". Omit for skills with no brand mark. */
    icon?: string;
    /** Brand hex from simple-icons, used only for hover tint. */
    color?: string;
  }>;
}
