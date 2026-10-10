# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server on http://localhost:3000
npm run build    # production build (also the only real typecheck gate — tsconfig has noEmit)
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals)
npx tsc --noEmit # typecheck without a full build
```

There is no test suite and no test runner installed.

## What this is

A single-page personal portfolio deployed on Vercel (push to `main` = production deploy).
Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, three.js.

## Architecture

**One page, five sections.** `src/app/page.tsx` renders `Hero → About → Projects → Skills → Contact`.
There are no other routes: `src/app/[...slug]/page.tsx` calls `notFound()` for everything else,
rendering `src/app/not-found.tsx`. Navigation is hash anchors, not routing.

**The section-id contract.** Each section component wraps itself in `<Section id="...">`
(`src/components/ui/section.tsx`, which emits a real `<section>`). `useActiveSection`
(`src/hooks/use-active-section.ts`) queries `section[id]` on mount and tracks the active one by
`offsetTop` on scroll; the navbar highlights from that value. A new section therefore needs:
a `<Section id="x">`, an `{ title, href: "#x" }` entry in `src/data/navigation.ts`, and a mount in
`page.tsx`. Current ids: `home`, `about`, `projects`, `skills`, `contact`.

**`ClientLayout` owns the whole shell.** `src/app/layout.tsx` is a thin server component (metadata,
Geist font) and delegates to `src/components/layout/ClientLayout.tsx`, a client component that:
gates first paint behind an 800 ms `Loader`, mounts the fixed three.js `StarsCanvas` background at
`-z-10`, wraps `children` in an `AnimatePresence` transition keyed on `pathname`, and mounts
`Navbar`, `Footer`, and the floating `WhatsappButton`. Anything global belongs here, not in `layout.tsx`.

**Component layout.** `src/components/layout/` = shell chrome. `src/components/sections/<name>/` =
one folder per page section, with the section entry file plus its private subcomponents.
`src/components/ui/` = shared primitives (`Section`, `Container`, `PopButton`, shadcn `button`/`sheet`).

**Content lives in data modules**, not in JSX: `src/components/sections/projects/project-data.tsx`
(typed `Project[]`, `image` paths point into `public/projects/`), `src/components/sections/skills/skills-data.ts`,
`src/data/tech-stack.ts`, `src/data/navigation.ts`. Edit these to change content.

## Conventions

- `Container` (`max-w-7xl` + responsive gutters) inside `Section` (vertical rhythm) is the standard
  page-width wrapper. Don't hand-roll max-widths.
- Tailwind v4 is CSS-first: there is **no `tailwind.config`**. Theme tokens, the `@theme inline`
  mapping, the radius scale, and the `dark` variant all live in `src/app/globals.css`.
- shadcn is configured for the `radix-nova` style with `@/lib/utils` as the `cn` alias
  (`components.json`); new shadcn components land in `src/components/ui/`.
- TS is strict plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — array/record
  indexing yields `T | undefined`, and `prop?: string` will not accept an explicit `undefined`.
- Icons: `react-icons/si` + `react-icons/fa` for brand marks, `lucide-react` for UI glyphs.
- Animation: `framer-motion` throughout (`whileInView` + `viewport={{ once: true }}` for scroll reveals).

## Known inconsistencies

Worth knowing before editing; fix opportunistically rather than assuming they're intentional.

- **Two `cn` helpers**: `src/lib/utils.ts` (canonical, the shadcn alias) and the identical
  `src/lib/cn.ts` (unused). Import from `@/lib/utils`.
- **Two nav sources**: `src/data/navigation.ts` is live. `NAV_ITEMS` in `src/lib/constants.ts` is
  unused and stale — it lists an `#experience` entry with no matching section.
- **Four diverged `section-header.tsx` copies**, one per section folder — they are not
  interchangeable; edit the one in the section you're touching.
- **EmailJS credentials are hardcoded** in `src/components/sections/contact/contact-form.tsx`
  (service / template / public key, inline, no env vars). The form posts straight from the browser
  via `emailjs.sendForm`; there is no API route.
- **Theming is half-wired**: `globals.css` defines light and dark token sets and `next-themes` is a
  dependency, but no provider is mounted and no theme toggle exists. `not-found.tsx` and the contact
  form hardcode light `zinc`/`white` classes instead of using theme tokens.
- `src/components/layout/Star_Background.tsx` is under `// @ts-nocheck` (untyped r3f props).
