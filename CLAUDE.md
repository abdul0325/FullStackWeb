# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server on http://localhost:3000
npm run build    # production build (also the only real typecheck gate — tsconfig has noEmit)
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals)
npm run typecheck # tsc --noEmit
npm run test:e2e # Playwright (added in Phase 11 of docs/PORTFOLIO-UPGRADE-PLAN.md)
```

There is no test suite and no test runner installed.

## What this is

A single-page personal portfolio deployed on Vercel (push to `main` = production deploy).
Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, three.js.

## Architecture

**One page, five sections.** `src/app/page.tsx` renders `Hero → About → Projects → Skills → Contact`.
Unknown paths fall through to `src/app/not-found.tsx` (true HTTP 404 — do not add a catch-all
route; one existed and returned 200). Navigation is hash anchors, not routing. The only API
route is `POST /api/contact` (`src/app/api/contact/route.ts`).

**The section-id contract.** Each section component wraps itself in `<Section id="...">`
(`src/components/ui/section.tsx`, which emits a real `<section>`). `useActiveSection`
(`src/hooks/use-active-section.ts`) queries `section[id]` on mount and tracks the active one by
`offsetTop` on scroll; the navbar highlights from that value. A new section therefore needs:
a `<Section id="x">`, an `{ title, href: "#x" }` entry in `src/data/navigation.ts`, and a mount in
`page.tsx`. Current ids: `home`, `about`, `projects`, `skills`, `contact`.

**Shell = `src/app/(site)/layout.tsx`.** Root `layout.tsx` is html/body + fonts + `ThemeProvider` +
Vercel analytics only. The `(site)` route group adds the skip link, static `Background`, `SiteShell`
(client: header with hide-on-scroll, lazy command palette on ⌘K, lazy desktop-only custom cursor,
first-visit intro, scroll rail), `<main id="main">` and the server `SiteFooter`. `/styleguide` sits
outside the group on purpose. Theme toggle lives in `site-header.tsx` and inside the mobile menu
(`nav/nav-mobile.tsx`, a Radix Dialog full-screen sheet).

**Component layout.** `src/components/layout/` = shell chrome (`site-shell`, `site-header`, `nav/*`, `site-footer`, `theme-*`, `intro-loader`, `command-palette`, `custom-cursor`, `scroll-progress`, `back-to-top`, `background`). `src/components/sections/<name>/` =
one folder per page section, with the section entry file plus its private subcomponents.
`src/components/ui/` = shared primitives (`Section`, `Container`, `PopButton`, shadcn `button`/`sheet`).

**Content lives in data modules**, not in JSX: `src/components/sections/projects/project-data.tsx`
(typed `Project[]`, `image` paths point into `public/projects/`), `src/components/sections/skills/skills-data.ts`,
`src/data/tech-stack.ts`, `src/data/navigation.ts`. Edit these to change content.

## Conventions

- `Container` (`max-w-7xl` + responsive gutters) inside `Section` (vertical rhythm) is the standard
  page-width wrapper. Don't hand-roll max-widths. `ui/section-header.tsx` is the one section header
  (eyebrow / title / lede props); `ui/reveal.tsx` is the one scroll-reveal wrapper.
- Design tokens: `bg/bg-subtle/bg-elevated/bg-overlay/bg-inset`, `fg/fg-muted/fg-subtle/fg-faint`,
  `line/line-strong`, `brand*`, `success/warning/danger` — all in `globals.css`, both themes, contrast
  matrix in `docs/CONTRAST.md`. Never use raw `zinc-*`/`white`/`black` classes in new code.
- Hover-only styles go behind the `hoverable:` variant; motion values come from `src/lib/motion.ts`.
- Tailwind v4 is CSS-first: there is **no `tailwind.config`**. Theme tokens, the `@theme inline`
  mapping, the radius scale, and the `dark` variant all live in `src/app/globals.css`.
- shadcn is configured for the `radix-nova` style with `@/lib/utils` as the `cn` alias
  (`components.json`); new shadcn components land in `src/components/ui/`.
- TS is strict plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — array/record
  indexing yields `T | undefined`, and `prop?: string` will not accept an explicit `undefined`.
- Icons: `react-icons/si` + `react-icons/fa` for brand marks, `lucide-react` for UI glyphs.
- Animation: `motion` (import from `motion/react`) — the only animation library. `whileInView` +
  `viewport={{ once: true }}` for scroll reveals. Do not add `framer-motion` or `gsap` back.
- Résumé PDF links must be plain `<a>`, never `next/link` — `Link` prefetches the PDF as an RSC payload.
- Public origin comes from `SITE_URL` in `src/lib/site.ts`; server secrets from `getServerEnv()` in
  `src/lib/env.ts` (never import that from a client component). Keys live in `.env.local` / Vercel —
  see `.env.example`.

## Upgrade programme

`docs/PORTFOLIO-UPGRADE-PLAN.md` is the phase-by-phase plan being executed on the `flash` branch;
`docs/BASELINE.md` holds the measured before/after numbers. Follow the plan's workflow rules
(stay on `flash`, gates green, commit per phase, push, stop and report).

## Known inconsistencies

Worth knowing before editing; fix opportunistically rather than assuming they're intentional.

- `src/data/navigation.ts` is the single nav source (the stale `lib/constants.ts` duplicate is gone).
- The contact form posts JSON to `/api/contact`, which validates with Zod, drops honeypot and
  sub-2-second submissions with a fake `ok`, rate-limits per IP in memory, and calls the EmailJS
  REST API with server-only keys. Old keys that were once in source were rotated.
- **Theming is half-wired**: `globals.css` defines light and dark token sets and `next-themes` is a
  dependency, but no provider is mounted and no theme toggle exists. `not-found.tsx` and the contact
  form hardcode light `zinc`/`white` classes instead of using theme tokens.
