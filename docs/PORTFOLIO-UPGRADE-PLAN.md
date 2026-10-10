# Portfolio Upgrade Plan

**Repository:** `D:\Portfolio\Portfolio-Website`
**Branch:** `flash` — all work stays here. Never merge to `main` during this programme.
**Live site:** https://abdulfullstackdev.vercel.app/
**Plan written:** 11 October 2026 · **Decisions confirmed:** 11 October 2026 (see §10.1)
**Source of truth for project facts:** `docs/CV-PROJECT-NOTES.md`

### Workflow rules (binding for every phase)

1. All work stays on `flash`. Never touch `main` until Phase 13.
2. Each phase ends with `npm run typecheck && npm run lint && npm run build` green.
3. Commit at the end of each phase with the planned Conventional Commits type, then **push**
   so Vercel builds a preview URL for phone and desktop review.
4. After each phase, report: what changed, the preview URL, and what to check by eye.
   Then stop and wait for approval before the next phase.
5. From Phase 1 onward, every phase is checked by hand at 360, 768 and 1440px before
   committing (§3.7). Phase 11 automates this.
6. Phase 13 ends by merging `flash` into `main` for production — **only after the preview
   is approved**.

---

## 1. Summary of the vision

The current site reads as a competent frontend template. It needs to read as the
portfolio of a **backend engineer who ships production systems with money in them**.
That is the story the evidence actually supports: sole backend engineer on the
mrosew.com commerce and events platform — 28 modules, 249 endpoints, 59 Prisma models,
82 migrations, 829 passing tests, empty repository to live production in eleven weeks.

So the redesign has one job: make a recruiter or engineering manager understand, within
ten seconds of landing, that this person builds systems where correctness matters, and
can prove it. Everything below serves that.

**Design direction — "Precision Engineering."** Calm, dark by default, dense with real
information, one restrained accent colour, generous whitespace, monospace used as a data
typeface rather than as decoration. No glassmorphism soup, no rainbow gradients, no
three-colour gradient text on every heading. The visual language is instrument panel,
not neon arcade.

**Content direction — proof over adjectives.** Every number on the page traces to a
command that was actually run and is recorded in `docs/CV-PROJECT-NOTES.md`. The
headline artefact is a full engineering case study of the mrosew.com backend: problem,
role, architecture, the hard problems solved (race-safe seat claims, inverted refund
bands, zero-downtime migrations, the GetResponse privacy incident), and the outcome —
written the way a senior engineer writes a post-mortem, not the way a freelancer writes
a sales page. The existing "2+ Years Experience / 100% Client Satisfaction" stat cards
get deleted, because they are unprovable and a reviewer who has seen a hundred
portfolios discounts them instantly.

**Engineering direction — fast and accessible by construction.** Server components by
default, client islands only where interaction demands them, transform-and-opacity-only
animation, `prefers-reduced-motion` honoured everywhere, 95+ Lighthouse on mobile across
all four categories, and a Playwright smoke test so the site cannot silently break.

The outcome is a site that is both the proof and the demonstration. The case study says
"I care about correctness." The Lighthouse score and the keyboard navigation show it.

---

## 2. Current State Audit

### 2.1 Stack as it exists

| Concern | What is there | Notes |
|---|---|---|
| Framework | Next.js `^16.2.10`, App Router | Current. `next.config.mjs` has **no options set at all** |
| Runtime | React `19.2.0`, React DOM `19.2.0` | Pinned exactly — good |
| Language | TypeScript `^6.0.3`, `strict: true` | Plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — unusually rigorous, keep |
| Typecheck gate | `noEmit: true`, no `typecheck` script | Only `npm run build` catches type errors today |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), CSS-first | No `tailwind.config` file; tokens live in `src/app/globals.css` |
| Component kit | shadcn `^4.12.0`, style `radix-nova`, `radix-ui ^1.6.0` | Only `button.tsx` and `sheet.tsx` have actually been generated |
| Animation | `framer-motion ^12.42.2` **and** `motion ^12.42.0` **and** `gsap ^3.13.0` | Three libraries. `framer-motion` and `motion` are the same library under two names; `gsap` is imported nowhere |
| 3D | `three ^0.185.0`, `@react-three/fiber ^9.6.1`, `@react-three/drei ^10.7.7`, `maath ^0.10.8` | Used only by `Star_Background.tsx` |
| Fonts | `Geist` via `next/font/google`, exposed as `--font-sans` | Correctly self-hosted by `next/font`. `--font-mono` is mapped to `--font-geist-mono`, which is **never defined anywhere** |
| Theming | `next-themes ^0.4.6` installed | **No provider is mounted.** Dark tokens exist in CSS but are unreachable |
| Forms | `@hookform/resolvers ^5.4.0`, `zod ^4.4.3` | **Both unused.** The contact form is hand-rolled `useState` |
| Toasts | `sonner ^2.0.7` | **Unused.** The form calls `alert()` on failure |
| Icons | `lucide-react`, `react-icons`, `simple-icons` | Three icon packages. `simple-icons` is unused |
| Email | `@emailjs/browser ^4.4.1` | Service id, template id and public key hardcoded in the component |
| Misc | `react-countup`, `react-intersection-observer`, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge` | `react-intersection-observer` unused — the code uses `motion`'s own `useInView` |
| Routing | Single page plus `[...slug]` catch-all calling `notFound()` | No real routes. Navigation is hash anchors |
| Deployment | Vercel, push-to-`main` auto-deploys production | `flash` produces a preview URL |
| Analytics | None | No `@vercel/analytics`, no Speed Insights |
| Tests | None | No runner, no CI workflow in this repository |

### 2.2 Section and component inventory

`src/app/page.tsx` renders exactly five sections: `Hero → About → Projects → Skills → Contact`.

| Component | LOC | What is good | What is weak |
|---|---|---|---|
| `app/layout.tsx` | 35 | Server component, proper `Metadata` with a title template, `next/font` | No `metadataBase`, no `openGraph`, no `viewport` export, no pre-hydration theme script, no skip link |
| `layout/ClientLayout.tsx` | 87 | Centralises the shell in one place | **The entire site sits inside a client component**, which forces every child client-side. Blocks first paint behind a fixed 800 ms timer on *every* load, not only the first. `AnimatePresence` keyed on `pathname` is dead weight on a one-route site |
| `layout/Loader.tsx` | 209 | The text-scramble effect is genuinely good | Runs on every visit, is not skippable, and ships 209 LOC of client JS that must execute before any content is readable |
| `layout/Star_Background.tsx` | 49 | Looks good | `// @ts-nocheck`. Pulls `three` + `fiber` + `drei` + `maath` into the critical path — the single largest bundle item on the site. Renders a 5,000-point WebGL canvas continuously, on phones, behind content. No `prefers-reduced-motion` check and no device gating |
| `layout/navbar/index.tsx` | 56 | Hide-on-scroll-down is well executed | Depends on `useActiveSection`, which reads layout inside an unthrottled scroll handler |
| `layout/navbar/desktop-nav.tsx` / `mobile-nav.tsx` | 75 / 91 | Clean desktop/mobile split, uses the `sheet` primitive | Reads `src/data/navigation.ts`, while `NAV_ITEMS` in `src/lib/constants.ts` is a stale duplicate listing an `#experience` section that does not exist |
| `layout/Footer.tsx` | 163 | Present and reasonably complete | Builds hrefs as `` `#${item.toLowerCase()}` `` — fragile string coupling to section ids |
| `layout/WhatsappButton.tsx` | 33 | Reasonable idea for a freelance audience | Fixed `z-50` overlay competing with the navbar; accessible name not verified |
| `sections/hero/hero.tsx` | 200 | Strong terminal visual, decent positioning line | The availability badge markup is duplicated verbatim for mobile and desktop. Enormous inline multi-line `className` strings. A client component for what is 90% static text. No social links, no tech marquee |
| `sections/hero/hero-terminal.tsx` | 177 | The best visual on the site — keep the idea | Client-only, animated, above the fold |
| `sections/about/about.tsx` | 25 | Thin composition wrapper — correct shape | — |
| `sections/about/about-stats.tsx` | 94 | Count-up animation works | **Contains the four worst items on the site:** "2+ Years Experience", "15+ Projects Built", "20+ Core Technologies", "100% Client Satisfaction". The last is unfalsifiable. All four must be replaced with real figures |
| `sections/about/about-card.tsx` | 204 | Photo treatment is good | 204 LOC; a `// Your image path` comment left in the source |
| `sections/about/about-story.tsx` | 114 | Decent copy structure | Generic claims with no evidence attached |
| `sections/about/expertise-grid.tsx` | 208 | — | Generic "expertise" cards; nothing ties them to shipped work |
| `sections/projects/project-data.tsx` | 231 | Typed `Project[]` — the right instinct | `caseStudy: "#"` on every one of the twelve entries. All projects carry equal visual weight, so nothing is featured. No `slug`, `role`, `year`, `summary` or `metrics` fields |
| `sections/projects/browser-frame.tsx` | 151 | Browser-chrome framing is a nice touch | `next/image` with `fill` but **no `sizes` prop**, so Next cannot choose a sensible candidate width |
| `sections/projects/project-grid.tsx` | 122 | Works | No filtering, no sorting, no detail route to open |
| `sections/projects/projects.tsx` | 64 | — | — |
| `sections/skills/skills-data.ts` | 229 | Grouped by category, typed, uses real brand icons | Carries a `level: "Advanced"` string per category — a self-assessment with nothing behind it |
| `sections/skills/skill-card.tsx` | 215 | Visually competent | 215 LOC client component |
| `sections/contact/contact-form.tsx` | 212 | Works end to end | EmailJS service id, template id and public key hardcoded in source **and in git history**. No validation beyond `required`. No spam protection. `alert()` on error. No `aria-live` success region. Hardcoded light-mode `zinc`/`white` colours |
| `sections/contact/map-card.tsx` | 42 | The location signal itself is useful | A third-party Google Maps `iframe` for decoration. `className` contains `flex flex-col hidden` *and* `lg:flex` — contradictory classes, so the responsive behaviour is accidental |
| `sections/*/section-header.tsx` | 36–96 | — | **Four separate, mutually diverged copies**, confirmed by checksum. One concept implemented four times |
| `ui/section.tsx`, `ui/container.tsx` | 22 / 22 | Genuinely good primitives. Keep both unchanged | — |
| `ui/pop-button.tsx` | 51 | Chunky 3D press effect with real character | Animates `box-shadow` and `border-color` on hover — neither is compositor-friendly |
| `ui/creepy-resume-button.tsx` | 170 | — | Imported by nothing. 170 LOC of dead code |
| `ui/tech-badge.tsx` | 273 | — | 273 LOC for a badge; the largest file in `ui/` |
| `ui/button.tsx`, `ui/sheet.tsx` | 67 / 147 | Standard shadcn output, fine | — |
| `app/not-found.tsx` | 85 | Decent 404 design | Hardcoded `bg-white` and `zinc` classes — will look broken once dark mode exists. Imports `Home` and never uses it. `history.back()` with no fallback when there is no history |
| `app/[...slug]/page.tsx` | 4 | Correct approach to catching unknown routes | Needs verifying that it returns a real HTTP 404 and not a soft 404 |
| `hooks/use-active-section.ts` | 35 | Does the job | Unthrottled `scroll` listener that reads `section.offsetTop` in the handler — forces synchronous layout on every scroll event |

### 2.3 Performance risks

Ranked by expected impact.

1. **The WebGL starfield is the dominant cost.** `three` + `@react-three/fiber` +
   `@react-three/drei` + `maath` is on the order of several hundred kilobytes of
   JavaScript parsed before anything useful renders, for a decorative background. It
   also runs a continuous `requestAnimationFrame` loop over a 5,000-point buffer, which
   drains battery and competes with scroll on mid-range phones. This single item is very
   likely the largest share of the mobile performance deficit.
2. **Unoptimised source images.** `public/projects/` holds PNGs of 2.27 MB, 2.25 MB,
   1.68 MB, 1.64 MB, 1.35 MB, 1.24 MB and 1.22 MB. Even with `next/image` resizing on
   demand, the originals ship in the deployment and the first optimisation pass is slow.
   `public/pictures/weblogo.png` is 255 KB for a 42×42 render.
3. **`priority` on the wrong images.** The 255 KB logo and the about-section portrait
   both carry `priority`. The real LCP candidate is hero text, which gains nothing from
   it, so two needless preloads compete with the genuine critical path.
4. **No `sizes` on any `fill` image** — `browser-frame.tsx` and `about-card.tsx`.
5. **Everything is a client component.** 44 of 52 source files begin with `"use client"`.
   The whole page tree hangs off `ClientLayout`, so server rendering buys almost nothing:
   the entire UI ships as JavaScript and hydrates.
6. **The 800 ms loader gate is deliberate delay** on every page load, measured in
   wall-clock time rather than readiness, so it does not even track real work.
7. **Guaranteed content replacement.** `ClientLayout` returns *only* the loader for the
   first 800 ms and then swaps in the entire page — a full-viewport content replacement.
   A full-screen overlay may mask the CLS metric, but the user-perceived shift is real.
8. **Layout thrash on scroll** from `use-active-section.ts` (see table above).
9. **Non-compositable transitions**: `box-shadow`, `border-color` and `backdrop-blur`
   transitions in `pop-button.tsx` and several card components repaint rather than
   composite.
10. **Three animation libraries bundled**, two of them the same library under different
    names, plus one (`gsap`) imported nowhere.
11. **Unused dependencies** still in `package.json`: `gsap`, `sonner`, `zod`,
    `@hookform/resolvers`, `simple-icons`, `react-intersection-observer`, and `shadcn`
    (a CLI listed as a runtime dependency).
12. **Google Maps `iframe`** in the contact section — a third-party frame with its own
    connections and cookies, for decoration.
13. **Build artefacts committed**: `tailwindcss-37200.log` (17 KB) and
    `tsconfig.tsbuildinfo` (316 KB) are tracked in the repository.

### 2.4 Accessibility gaps

- No skip-to-content link.
- **No `prefers-reduced-motion` handling anywhere.** Every entrance animation, the
  scramble loader, the floating hero and the WebGL starfield run regardless of the
  user's setting.
- Focus styling relies on the base-layer `outline-ring/50`; `pop-button.tsx` and
  `creepy-resume-button.tsx` define hover and active states but no explicit
  `:focus-visible` ring.
- `a { cursor: pointer !important }` in `globals.css` — a global `!important` override
  that also masks genuinely non-interactive anchors.
- Contact form: `<label>` elements have no `htmlFor` and the inputs have no `id`, so the
  association is positional only. No `aria-live` region announces send success or
  failure; errors surface through `window.alert()`.
- No `aria-current` on the active navigation item — the active section is conveyed
  visually only.
- Heading order is unaudited; several sections jump from the page `h1` straight to `h3`.
- Contrast is unverified, and several places use low-opacity text (`text-zinc-400` on
  near-white, `text-gray-400` on `bg-gray-200/50`) that will fail 4.5:1.
- `map-card.tsx` carries contradictory `hidden` and `flex` classes.
- Dark tokens exist in CSS but there is no toggle, so a user with a dark system
  preference is served a forced light page.
- The WhatsApp floating button's accessible name needs checking.

### 2.5 SEO gaps

- No `metadataBase`, so every relative metadata URL resolves incorrectly.
- **No `openGraph` or `twitter` metadata at all** — a shared link renders as a bare URL.
- No OG image wired up (`public/preview.png` exists but is referenced only from the README).
- No `app/sitemap.ts`, no `app/robots.ts`, no canonical URLs.
- No JSON-LD structured data (`Person`, `WebSite`, `CreativeWork`).
- One route only, so no per-page metadata is possible — twelve project write-ups with no
  indexable pages forfeits all of their long-tail search value.
- The `[...slug]` catch-all needs verifying for a true HTTP 404 status.
- No `author`, no `alternates.canonical`.

### 2.6 Keep / refactor / delete

**Keep as-is**

- `src/components/ui/section.tsx` and `src/components/ui/container.tsx` — correct primitives.
- `src/lib/utils.ts` (`cn`) — canonical, matches `components.json`.
- The TypeScript configuration, including the strict extras.
- `next/font` Geist setup.
- The hero-terminal concept and the loader scramble effect — both reworked, neither discarded.
- `project-data.tsx`'s typed-data approach (the shape gets extended, the approach stays).

**Refactor**

- `ClientLayout` → a server shell plus small client islands (theme provider, nav scroll
  behaviour, command palette).
- `Loader` → first-visit only, ≤1.2 s cap, skippable, reduced-motion aware, and it must
  not remove content from the DOM.
- `Star_Background` → replace with a cheap CSS or 2D-canvas field, or lazy-load it behind
  an idle callback with device and reduced-motion gating. Remove `@ts-nocheck` either way.
- `use-active-section` → `IntersectionObserver` instead of scroll plus `offsetTop`.
- The four `section-header.tsx` copies → one `ui/section-header.tsx`.
- `contact-form.tsx` → React Hook Form + Zod, credentials from env vars, `sonner` toasts,
  honeypot plus submit-timing spam check, `aria-live` status region.
- `about-stats.tsx` → real metrics from `docs/CV-PROJECT-NOTES.md`.
- `project-data.tsx` → add `slug`, `role`, `year`, `summary`, `metrics`, `featured`.
- `not-found.tsx` → theme tokens instead of hardcoded light colours.
- `pop-button.tsx` → transform and opacity only; keep the press feel with `translate3d`
  and a pre-rendered shadow layer whose opacity changes.

**Delete**

- `src/lib/cn.ts` — duplicate of `lib/utils.ts`.
- `src/lib/constants.ts` — `NAV_ITEMS` is a stale duplicate, `MAX_WIDTH` is unused.
- `src/components/ui/creepy-resume-button.tsx` — unused, 170 LOC.
- The Google Maps iframe in `map-card.tsx` — replaced by a static location/timezone block.
- `tailwindcss-37200.log` and `tsconfig.tsbuildinfo`; add both to `.gitignore`.
- The duplicated availability-badge markup in `hero.tsx`.
- Dependencies: `gsap`, `framer-motion` (keep `motion`), `simple-icons`,
  `react-intersection-observer`; move `shadcn` to `devDependencies`; drop
  `three`/`@react-three/*`/`maath` if the starfield is replaced rather than lazy-loaded.
- `src/types/global.d.ts` — verify `declare module "*.css"` is still needed under Next 16,
  delete if not.

---

## 3. Design System

### 3.1 Concept and mood

**"Precision Engineering."**

The mood is a well-designed instrument: dark, quiet, legible, with one accent colour used
sparingly so that when it appears it means something. Think of the aesthetic of good
developer tooling — Linear, Vercel's own dashboards, Stripe's docs — but with more
density, because the content here is evidence and evidence wants to be readable at a
glance.

**Reasoning.** The audience is recruiters and engineering managers reviewing a backend
engineer. Loud visual effects actively work against that read: they signal "frontend
hobbyist" where the content is saying "I handle money correctly under concurrency." A
restrained, information-dense dark interface does three things at once — it looks
expensive, it signals technical seriousness, and it makes the numbers the loudest thing
on the page. The one place flourish is allowed is motion, which is where craft shows
without shouting.

**Rules that enforce the concept:**

- One accent colour. Anything that needs to stand out uses the accent or it uses weight
  and spacing, never a second hue.
- Gradient text appears **at most once per page**, on the hero name only.
- Monospace carries data — metrics, file paths, commit messages, endpoint counts — and
  never body prose.
- Every decorative element must survive the question "does this help someone evaluate
  the work?" If not, it is cut.

### 3.2 Colour tokens

Dark is the default. Light is a first-class alternative, not an afterthought. All values
are OKLCH, continuing the existing `globals.css` convention.

```css
/* src/app/globals.css */

:root {
  /* Dark theme — the default */
  --bg:               oklch(0.145 0.012 265);  /* near-black, faint blue cast */
  --bg-subtle:        oklch(0.185 0.014 265);  /* raised surface */
  --bg-elevated:      oklch(0.225 0.016 265);  /* cards, popovers */
  --bg-inset:         oklch(0.120 0.010 265);  /* wells, code blocks */

  --fg:               oklch(0.975 0.004 265);  /* primary text */
  --fg-muted:         oklch(0.740 0.012 265);  /* secondary text */
  --fg-subtle:        oklch(0.580 0.014 265);  /* tertiary, captions */
  --fg-faint:         oklch(0.440 0.014 265);  /* disabled, watermarks */

  --border:           oklch(0.280 0.016 265);
  --border-strong:    oklch(0.380 0.020 265);
  --border-accent:    oklch(0.620 0.160 255 / 0.40);

  /* Accent — a single cold blue. Technical, calm, not a startup purple. */
  --accent:           oklch(0.680 0.170 250);
  --accent-hover:     oklch(0.730 0.175 250);
  --accent-pressed:   oklch(0.620 0.165 250);
  --accent-fg:        oklch(0.145 0.012 265);  /* text ON accent */
  --accent-subtle:    oklch(0.680 0.170 250 / 0.12);
  --accent-ring:      oklch(0.680 0.170 250 / 0.55);

  /* Semantic — used only for status, never decoration */
  --success:          oklch(0.700 0.150 155);
  --warning:          oklch(0.780 0.150 80);
  --danger:           oklch(0.640 0.210 25);

  --radius:           0.75rem;
}

:root[data-theme="light"] {
  --bg:               oklch(0.995 0.002 265);
  --bg-subtle:        oklch(0.975 0.004 265);
  --bg-elevated:      oklch(1.000 0     0  );
  --bg-inset:         oklch(0.960 0.005 265);

  --fg:               oklch(0.180 0.014 265);
  --fg-muted:         oklch(0.420 0.014 265);
  --fg-subtle:        oklch(0.540 0.012 265);
  --fg-faint:         oklch(0.680 0.010 265);

  --border:           oklch(0.900 0.006 265);
  --border-strong:    oklch(0.820 0.010 265);
  --border-accent:    oklch(0.520 0.170 250 / 0.35);

  --accent:           oklch(0.520 0.180 250);
  --accent-hover:     oklch(0.470 0.185 250);
  --accent-pressed:   oklch(0.430 0.180 250);
  --accent-fg:        oklch(0.995 0.002 265);
  --accent-subtle:    oklch(0.520 0.180 250 / 0.10);
  --accent-ring:      oklch(0.520 0.180 250 / 0.50);

  --success:          oklch(0.520 0.140 155);
  --warning:          oklch(0.600 0.140 70);
  --danger:           oklch(0.530 0.200 25);
}
```

**Theme toggle with no flash.** `next-themes` is already a dependency but unmounted. Wire
it with `attribute="data-theme"`, `defaultTheme="dark"`, `enableSystem`, and
`disableTransitionOnChange`. `next-themes` injects a blocking inline script before paint,
which is what prevents the flash — the critical detail is that `<html>` must carry
`suppressHydrationWarning` (it already does) and the theme attribute must be read before
first paint. Verify with a hard reload in both system preferences and throttled CPU.

**Gradient rules.** Gradients are allowed in exactly three places: (a) the hero name, one
gradient, accent to accent-hover, never three hues; (b) a 1px top border highlight on
elevated cards (`linear-gradient` on a `::before`, `--border-strong` to transparent);
(c) a vertical fade mask on scrolling containers. Nowhere else.

**Glow rules.** Glow is a signal, not a texture. One radial accent glow behind the hero
only, at ≤12% opacity, in a `pointer-events-none` layer. No glow on hover, no glow on
cards, no stacked blur orbs — the current site has five of them and they read as noise.

### 3.3 Typography

Two families, both via `next/font`.

| Role | Font | Loading |
|---|---|---|
| Display + headings + body | **Geist Sans** | `next/font/google`, `subsets: ["latin"]`, `display: "swap"`, variable `--font-sans` |
| Data, code, metrics, labels | **Geist Mono** | `next/font/google`, `subsets: ["latin"]`, `display: "swap"`, variable `--font-mono` |

Geist is already in use for sans; Geist Mono fixes the dangling `--font-geist-mono`
reference. Both are variable fonts, both self-hosted by `next/font`, so there is no
third-party font request and no FOIT. Preload sans only; mono is below the fold.

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --text-display:  clamp(2.75rem, 7vw, 5.5rem);   /* hero name only */
  --text-h1:       clamp(2.25rem, 5vw, 3.5rem);
  --text-h2:       clamp(1.75rem, 3.5vw, 2.5rem); /* section titles */
  --text-h3:       clamp(1.25rem, 2vw, 1.5rem);   /* card titles */
  --text-body-lg:  1.125rem;                      /* lead paragraphs */
  --text-body:     1rem;
  --text-sm:       0.875rem;
  --text-xs:       0.75rem;                       /* mono labels, eyebrows */
}
```

Rules: display weight 800 with `tracking-tight` and `leading-[0.95]`; headings weight 700;
body weight 400 at `leading-relaxed`; mono labels weight 500, `uppercase`,
`tracking-[0.18em]`, `--text-xs`. Measure capped at `max-w-[68ch]` for prose and
`max-w-[46ch]` for lead paragraphs. Never set body text below 1rem on mobile.

### 3.4 Spacing, grid, radius, shadows, borders

**Spacing scale** — Tailwind's default 4px base, restricted to a chosen subset so spacing
stays rhythmic: `1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40`. Section vertical rhythm:
`py-20` mobile, `py-28` tablet, `py-36` desktop. Keep `ui/section.tsx` as the enforcement
point.

**Grid** — a 12-column grid inside `ui/container.tsx` (`max-w-7xl`, gutters `px-5` /
`md:px-8` / `lg:px-12`, retained from the current implementation). Content columns:
full-bleed for the hero, 8-of-12 for prose, 4-column cards on desktop collapsing 4 → 2 → 1.

**Radius** — `--radius: 0.75rem` as the base, with the existing derived scale in
`globals.css` (`sm` 0.6×, `md` 0.8×, `lg` 1×, `xl` 1.4×, `2xl` 1.8×). Cards use `xl`,
buttons `md`, badges `full`, images `lg`. No mixed radii inside one composition.

**Shadows** — in a dark interface, shadow is nearly invisible, so **elevation is expressed
with background steps and borders, not shadow**. Exactly two shadows exist:

```css
--shadow-popover: 0 16px 40px -12px oklch(0 0 0 / 0.55);
--shadow-lift:    0 8px 24px -8px oklch(0 0 0 / 0.40);
```

`--shadow-lift` is used only on hover, and because `box-shadow` is not compositor-friendly
it is applied to a pre-rendered absolutely positioned layer whose **opacity** animates.

**Borders** — 1px, `--border` at rest, `--border-strong` on hover, `--border-accent` on
focus. Borders carry most of the structural weight in this system, so they are never
removed to "clean up" a card.

**Glassmorphism** — `backdrop-blur` is permitted on exactly two surfaces: the sticky
navbar and the command palette overlay. Both are small, both are above everything, and
both already composite on their own layer. Nowhere else, because blur on large scrolling
surfaces is the most expensive thing a portfolio does to a mid-range phone.

**Noise** — one 128×128 tiling SVG noise texture at ≤3% opacity over `--bg`, inlined as a
data URI in CSS, `pointer-events-none`, `fixed`. It gives the dark background depth
without a canvas. This is the replacement for the WebGL starfield.

### 3.5 Motion language

```ts
// src/lib/motion.ts
export const ease = {
  out:     [0.16, 1, 0.3, 1],      // entrances — fast start, long settle
  inOut:   [0.65, 0, 0.35, 1],     // state changes, theme switches
  spring:  { type: "spring", stiffness: 420, damping: 32, mass: 0.7 },
} as const;

export const duration = {
  instant: 0.12,   // press feedback
  fast:    0.20,   // hover, focus ring
  base:    0.35,   // entrances, reveals
  slow:    0.60,   // hero, section headers
  page:    0.45,   // route transitions
} as const;

export const stagger = {
  tight: 0.04,     // list items, badges, marquee
  base:  0.07,     // cards in a grid
  loose: 0.12,     // section-level sequencing
} as const;

export const distance = {
  subtle: 8,       // text lines
  base:   16,      // cards
  large:  28,      // hero blocks
} as const;
```

**What animates:** entrance of sections and cards (opacity + `translateY`), hover lift on
interactive cards (`translateY(-2px)` + shadow-layer opacity), button press
(`translateY(1px)` + `scale(0.99)`), focus rings (opacity), nav active indicator (a shared
`layoutId` underline), count-ups, the hero terminal typing, marquee translation, theme
icon cross-fade, page transitions between routes, command palette open/close.

**What never animates:** body text already on screen, anything on scroll that moves text
horizontally, images sliding in from off-screen (they shift layout perception), `width`,
`height`, `top`, `left`, `box-shadow` directly, `filter: blur()` on anything large, and
nothing animates for longer than 0.6 s except the marquee and the hero terminal.

**Global contract:** animate `transform` and `opacity` only. Every animated element gets
`will-change: transform` only while animating, never permanently. Every entrance uses
`whileInView` with `viewport={{ once: true, margin: "-80px" }}` so content is never
re-animated on scroll-back.

### 3.6 Component inventory

Each component is built with all listed states. States that are not specified are a defect.

| Component | Variants | States required |
|---|---|---|
| **Button** | `primary` (accent fill), `secondary` (bordered), `ghost` (text only), `icon` (square, 40px), `magnetic` (primary + pointer-follow, desktop only) | rest, hover, `:focus-visible`, active/pressed, disabled, loading (spinner replaces label, width locked to prevent reflow) |
| **Link** | `inline` (underline offset 4px, accent on hover), `nav`, `external` (trailing arrow icon, `rel="noopener noreferrer"`) | rest, hover, focus-visible, visited (inline prose only), active |
| **Card** | `static`, `interactive` (hover lift), `linked` (whole card is one anchor, text stays selectable) | rest, hover, focus-visible (ring on the card, not the inner link), active |
| **MetricTile** | `default`, `large` (hero proof strip) | rest, in-view (triggers count-up), reduced-motion (renders the final value immediately) |
| **Badge** | `status` (dot + label, used for availability), `tech` (icon + label), `count` | rest, hover (tech only) |
| **Tag / Filter chip** | `default`, `selected` | rest, hover, focus-visible, selected, selected+hover, disabled (zero results) |
| **SectionHeader** | one component, props `eyebrow` / `title` / `lede` / `align` | in-view reveal, reduced-motion static |
| **Input / Textarea / Select** | `default` | rest, hover, focus, filled, invalid (`aria-invalid`, danger border, message with `role="alert"`), disabled, read-only |
| **Toast** (`sonner`) | `success`, `error`, `loading` | enter, visible, exit, swipe-dismiss, stacked |
| **Tooltip** (radix) | `default` | closed, open, keyboard-triggered on focus, 400 ms open delay, 0 ms close |
| **Cursor** | custom dot + ring, desktop and fine-pointer only | default, hover-interactive (ring expands), hover-text (ring becomes a caret bar), pressed, hidden (on touch, on reduced-motion, when the window loses focus) |
| **Loader** | first-visit only | enter, scramble, exit, **skipped** (any key, click, or scroll), bypassed (reduced-motion or repeat visit) |
| **CommandPalette** (⌘K) | — | closed, open, filtering, empty results, keyboard-navigating, item-selected |
| **Timeline item** | `default` | rest, in-view (line draws, node fills), active (nearest to viewport centre) |
| **ThemeToggle** | icon button | rest, hover, focus-visible, pressed, mid-transition (icon cross-fade) |
| **ProgressRail** | thin top-of-viewport scroll progress bar | hidden at top, visible on scroll, accent fill |

### 3.7 Responsive engineering

Responsiveness is a first-class engineering requirement from Phase 1 onward, not a
final-phase fix. Every component is designed for every screen, not merely "not broken".
The rules below are acceptance criteria in every phase from Phase 1 on.

**Breakpoint behaviour**

| Breakpoint | Width | Layout rules |
|---|---|---|
| fold | 280–319px | Single column, gutter `px-4`, type at the clamp floor, nav collapsed. Must not overflow |
| `xs` | 320–479px | Single column. Gutter `px-5`. No custom cursor, no magnetic buttons, no parallax, marquee one row. Nav collapses to the full-screen menu. Metric tiles 2×3 |
| `sm` | 480–767px | Single column, larger type. Metric tiles 2×3 |
| `md` | 768–1023px | Two-column cards. Timeline switches from left-rail to centre-rail. Metric tiles 3×2 |
| `lg` | 1024–1439px | Full desktop. Hero becomes two-column (text / terminal). Custom cursor and magnetic buttons enable. Three-column project grid. Metric tiles 6×1 |
| `xl` | 1440–1919px | Container caps at `max-w-7xl` (1280px) with wider gutters. Content stops growing; whitespace does |
| `2xl`+ | 1920–4K | Container stays capped. Background noise and the single hero glow scale with the viewport. Type scale caps at the clamp ceiling. The layout must still look intentional at 2560px — not a stretched phone layout |

**Rules**

- **Mobile-first CSS.** Base styles target the smallest screen; `min-width` media queries
  add complexity upward. No `max-width` queries except for `hover`/`pointer` gating.
- **Fluid type and spacing with `clamp()`.** No fixed-pixel font sizes on headings — the
  §3.3 scale is entirely `clamp()`-based. Section padding and large gaps use `clamp()` too.
- **Container queries** for any component that lives in slots of different width: project
  cards (teaser grid vs index grid), case-study blocks (full width vs with sticky sub-nav),
  metric tiles. `@container` with named containers; breakpoints belong to the slot, not the
  viewport.
- **Readable measure on large screens.** Body prose capped at `max-w-[68ch]` (60–75
  characters), lead paragraphs at `max-w-[46ch]`. Container width caps at 1280px.
- **Zero horizontal scroll at any width.** `document.documentElement.scrollWidth <= window.innerWidth`
  holds at every width in the matrix below.
- **No text overflow, clipping, or orphaned single words in headings.** Headings use
  `text-wrap: balance`; body uses `text-wrap: pretty`. Long unbreakable strings (URLs,
  endpoint paths) get `break-words` or `overflow-wrap: anywhere`.
- **No overlapping elements** at any width. Absolutely positioned decoration is
  `pointer-events-none` and clipped by its parent.
- **Images never stretch or distort.** Every image sits in a fixed aspect-ratio box with
  `object-fit: cover`.
- **Layout never jumps when fonts load.** `next/font` with `adjustFontFallback` (default on)
  generates size-adjusted fallback metrics; verified by throttling to Slow 3G and watching
  for shift.
- **Viewport units.** `100dvh` / `100svh` instead of `100vh` for full-height sections, so
  mobile browser bars do not cause overflow or jump. `env(safe-area-inset-*)` padding on
  fixed elements (header, back-to-top, toasts) for notched phones.
- **Touch.** Tap targets ≥44×44px. Every hover-only effect is wrapped in
  `@media (hover: hover) and (pointer: fine)`. Custom cursor and magnetic buttons are
  desktop-only. Nothing important is hidden behind hover.
- **Mobile navigation is designed, not squeezed.** A full-screen animated menu (not a
  shrunken desktop nav) with focus trap, scroll lock (`overflow: hidden` on `<html>` plus
  `overscroll-behavior: contain`), Escape to close, and focus returned to the trigger.
- **Animations scale down on small and low-power devices.** Below `lg`: parallax off,
  `distance.large` → `distance.base`, stagger halved, no path-draw animation. Under
  `prefers-reduced-motion`: §5.5 rule 3 applies in full.

**Test matrix** — every component pixel-clean at all of these:

| Class | Widths (px) |
|---|---|
| Foldable | 280 |
| Phones | 320, 360, 375, 390, 414, 430 |
| Phone landscape | 844×390 |
| Tablets | 600, 768, 820, 1024 |
| Desktop / ultrawide | 1280, 1440, 1536, 1920, 2560 |

**Verification**

- Phases 1–10: manual check at 360, 768 and 1440 before every commit, plus the full matrix
  on any component that was touched.
- Phase 11: Playwright screenshot tests at 360, 768, 1280 and 1920 for every route, plus an
  automated assertion that `scrollWidth <= innerWidth` at every width in the matrix.

### 3.8 Best-in-class choices

One decision per concern, one line of reasoning each. When two options were close, the
faster and more accessible one won.

| Concern | Choice | Reason |
|---|---|---|
| **Type families** | **Geist Sans + Geist Mono, no third display face** | The two-family cap is spent on sans and mono, and mono is non-negotiable because it carries every number on the site. Geist at weight 800, `tracking-tight`, `leading-[0.95]` is distinctive enough for display; a single-family hierarchy reads as *engineered*, which is the concept. Both are variable, Latin-subset, self-hosted by `next/font` with `display: "swap"` and `adjustFontFallback` size-adjusted metrics, so font load causes zero layout shift |
| **UI motion** | **`motion` v12 (`motion/react`), only** | Already a dependency; covers declarative entrances, `whileInView`, springs, `layoutId` shared elements and `useReducedMotion`. `LazyMotion` + `domAnimation` keeps the initial bundle small |
| **Scroll choreography** | **`motion`'s `useScroll` + `useTransform`, no GSAP** | Every scroll-linked effect in this plan (progress rail, timeline `pathLength`, 12px glow drift, card image drift) is a scalar bound to scroll progress. That is exactly what `useScroll` does; GSAP ScrollTrigger would add a second animation runtime for no effect this plan needs. Revisit only if a pinned or timeline-sequenced scroll scene is ever added — none is planned |
| **Smooth scroll** | **Native first; Lenis as a measured Phase 9 trial** | Native scroll plus `scroll-behavior: smooth` costs nothing. Lenis is added in Phase 9 behind a flag, INP measured on a real mid-range Android with Speed Insights; it stays only if INP remains <200 ms and trackpad, find-on-page and scroll anchoring all still work. Default outcome is to remove it |
| **Removed** | `framer-motion`, `gsap`, `three`, `@react-three/fiber`, `@react-three/drei`, `maath`, `react-intersection-observer`, `react-icons`, `@emailjs/browser` | Duplicate runtime, unused, decorative-only cost, or replaced by a smaller equivalent |
| **Icons** | **`lucide-react` — the single icon set** | Tree-shakes to the icons imported, consistent 24px grid and stroke, covers every UI glyph. Brand logos are not icons: they come as SVG path data from `simple-icons` (already a dependency, per-icon ESM exports), inlined as data in `data/skills.ts`. `react-icons` goes — it was three icon sets in one package |
| **Images** | **`next/image`, AVIF then WebP, blur placeholders, `sizes` on every `fill`** | Source assets re-encoded to ≤1600px WebP ≤200 KB; Next serves AVIF/WebP on demand; build-time `blurDataURL` for every local image; fixed aspect-ratio boxes so nothing reserves zero space |
| **Component kit** | **shadcn (`radix-nova`) primitives, extended** | Already configured; Radix gives accessible dialogs, tooltips and sheets for free. Every primitive is extended with the full §3.6 state set |
| **Command palette** | **`cmdk`** | Purpose-built, tiny, accessible, lazy-loaded on first `⌘K` |
| **Code highlighting** | **Shiki, build-time in RSCs** | Zero client JS; replaces the usual 40 KB+ client highlighter |
| **Forms** | **React Hook Form + Zod, Route Handler send** | Both already dependencies; the Route Handler holds the secret server-side and adds rate limiting and a honeypot |
| **Syntax for interaction states** | **One `focus-visible` utility, one motion-token set** | Every interactive element — buttons, links, cards, inputs, nav items, toggles — gets designed hover, `:focus-visible`, active/pressed, disabled and loading states using the §3.5 tokens. A component missing a state is a defect, not a polish item |
| **Quality bar** | **Studio-grade consistency** | Same spacing rhythm, alignment grid, type scale and motion tokens everywhere. The `/design` route is the review surface; anything that looks different from its neighbour without a reason is wrong |

---

## 4. Information Architecture & Sections

Routes:

```
/                      single-page scroll experience (sections below)
/projects              full project index, filterable
/projects/[slug]       per-project case study
/resume                web résumé (print stylesheet + PDF download)
/notes                 optional, MDX technical writing index
/notes/[slug]          optional, MDX article
/api/og                dynamic Open Graph image generation
sitemap.xml, robots.txt
not-found              custom 404
```

### 4.1 Intro loader

- **Purpose:** one moment of craft before the content, and nothing more.
- **Content:** "ABDUL REHMAN" scramble-resolving, a single mono status line, a thin
  progress rail.
- **Rules:** hard cap 1.2 s; first visit only (`sessionStorage` flag); skippable by any
  key, click, tap or scroll; bypassed entirely under `prefers-reduced-motion`; the page
  content is **rendered in the DOM underneath** and only visually covered, so the LCP
  element exists from the first byte and crawlers see the full page.
- **Animation:** scramble on the name, mono line cross-fades, exit is an opacity fade plus
  a 2% scale-up, 0.4 s, `ease.out`.

### 4.2 Hero

- **Purpose:** the ten-second verdict.
- **Content:** name (display, one gradient); positioning line — *"Backend engineer. I
  build commerce systems where correctness is the product."*; a one-sentence substantiation
  naming NestJS, PostgreSQL and production; an availability status badge (single
  implementation, not duplicated); primary CTA **View the case study**; secondary CTAs
  **Download CV** and **Contact**; social links (GitHub, LinkedIn, email); the hero
  terminal, reworked to print real facts (`249 endpoints`, `829 tests passing`,
  `82 migrations`); a tech marquee beneath.
- **Layout:** `lg:grid-cols-[1.05fr_0.95fr]`, text left, terminal right. Single column below
  `lg` with the terminal retained but shortened.
- **Animation:** per-line text reveal, `stagger.base`, `distance.large`, `duration.slow`;
  terminal types on a 0.3 s delay; marquee is a pure CSS/transform infinite translation,
  paused on hover and under reduced motion; one radial accent glow, static.
- **Server/client:** the text block is a server component. Only the terminal, the marquee
  and the magnetic CTA are client islands.

### 4.3 Proof in numbers

- **Purpose:** convert the claim into evidence before the visitor has scrolled twice.
- **Content — real figures only, all from `docs/CV-PROJECT-NOTES.md`:**

| Value | Label | Source |
|---|---|---|
| 249 | HTTP endpoints shipped | §3, `release/events` |
| 829 | tests passing, 54 suites | §3, A3.6 |
| 59 | Prisma data models | §3 |
| 82 | database migrations | §3 |
| 11 | weeks, empty repo to production | §4 |
| 336 | commits authored | §4 |

  A secondary row, used in the case study rather than the homepage strip: 28 modules,
  60 controllers, 81 services, 15 scheduled jobs, 194 error codes, 63,213 lines of
  TypeScript, 19,297 lines of specs.
- **Layout:** 6 tiles, `2×3` on mobile, `3×2` at `md`, `6×1` at `lg`. Mono numerals,
  `tabular-nums`, label beneath in mono uppercase.
- **Animation:** count-up on in-view, 1.2 s, `ease.out`, `stagger.tight`. Under reduced
  motion the final value renders immediately. Numbers are in the server-rendered HTML as
  text so they are indexable and visible without JS.
- **Note:** every tile carries a `title`/tooltip naming where the figure came from. That
  detail is the whole point — it says the numbers are audited.

### 4.4 About

- **Purpose:** establish the person behind the numbers in under 150 words.
- **Content:** three short blocks — *What I do* (backend systems for commerce: payments,
  refunds, concurrency, data correctness); *How I work* (read the policy against the code;
  tests that fail when the guard is removed; migrations that are backward-compatible with
  what is already running; document the decision, not just the change); *Where I am*
  (Bahawalpur, Pakistan · PKT UTC+5 · remote, open to relocation). Portrait, kept.
- **Layout:** portrait left on `lg`, prose right, 5/7 split. Stacked on mobile.
- **Animation:** `stagger.loose` on blocks, `distance.base`. Portrait fades only — no scale,
  no rotation.
- **Server/client:** fully server-rendered. No client island at all.

### 4.5 Featured case study — mrosew.com backend

The centrepiece. It lives at `/projects/mrosew-backend` **and** gets a condensed hero
block on the homepage that links through. Structured as an engineer's write-up, not a
screenshot card.

| Block | Content |
|---|---|
| **Header** | Title: "Commerce, events and ticketing platform — backend". Role: **sole backend engineer**. Window: 27 July – 9 October 2026 (11 weeks). Status: live at `api.mrosew.com`. Stack line. Links: live API host, not a public repo (private client work — state that explicitly rather than leaving a dead link) |
| **The problem** | A UK founder's business selling books, digital products, video courses, consultations, workshops and ticketed events needed one backend behind three consumers: a public marketing site, a customer dashboard and an admin back office. Money, VAT, statutory cancellation rights and finite seat inventory all in one system |
| **My role** | Sole backend engineer. 336 of 363 commits on the release branch. Owned `src/`, `prisma/` and the repository's documentation. DevOps owned the pipeline, Docker and compose files — audited, not authored. Honest note: 165 of 336 commits carry a `Co-Authored-By: Claude` trailer (49%), disclosed because disclosure is the correct default |
| **Architecture diagram** | Hand-authored inline SVG, theme-aware, two themes via `currentColor` and CSS vars. Shows: three consumers → NestJS API (28 modules grouped into Commerce / Bookings / Events / Platform) → PostgreSQL 16 via Prisma; side integrations PayPal REST, Cloudflare R2 (S3 API), Cloudflare Stream, GetResponse, SMTP; 15 scheduled jobs on a timer rail; GitHub Actions 4-stage pipeline below. No Mermaid runtime — static SVG, zero JS |
| **Scale** | 28 modules · 249 endpoints (112 GET / 98 POST / 21 PATCH / 3 PUT / 15 DELETE) · 60 controllers · 81 services · 58 DTOs · 59 Prisma models · 47 enums · 82 migrations · 194 error codes across 258 definitions in 21 files · 15 cron jobs · 63,213 LOC source · 19,297 LOC specs |
| **Hard problem 1 — race-safe seat claims** | Capacity is claimed in one raw SQL statement with the availability test inside its own `WHERE` (`UPDATE ... SET sold = sold + n WHERE id = ? AND sold + n <= capacity`), because read-then-decide leaves a window where two customers both see six seats left, both ask for four, and both are allowed. Raw SQL because Prisma cannot compare one column against another in a `where`. Release floored at zero. Door admission uses the same shape, with the test in both the insert and conflict branches of an upsert. Proven by two overlapping transactions on a real Postgres instance admitting exactly one |
| **Hard problem 2 — refund correctness** | The `STANDARD` refund bands were inverted: a £50.00 ticket cancelled 90 days out refunded £42.50 while one cancelled at 45 days refunded £50.00. The thresholds were spread across three functions, which is why nobody could see the whole scale. Consolidated into one `REFUND_BANDS` block and locked with a **monotonic property test** across every category, a price set including odd values, and every day from 400 down to 0: the refund may never rise as notice falls. Also: three routes to double-charging closed in one pass, and a Stripe session-expiry bug caught by reading rather than testing — expiry was `order.createdAt + 30 minutes` while Stripe refuses anything under 30 minutes from creation, so every Stripe ticket checkout would have failed by milliseconds |
| **Hard problem 3 — zero-downtime migrations** | Stage 4 of the pipeline applies Prisma migrations while the previous container is still serving traffic, so the question for any migration is not "does the new code work with this?" but "does the code currently in production still work with this?" Wrote the policy: the safe/unsafe table, the two-release add-backfill-switch-drop pattern for renames and required columns, and isolation of enum changes — each proven on a throwaway Postgres 16 container first. Removing an enum value is a two-release change even when no row uses it, because `Record<Enum, T>` maps fail at runtime under old code |
| **Hard problem 4 — the newsletter incident** | A soft-deleted user's address was being pushed to GetResponse once an hour, indefinitely, against an account whose plan does not include the API — HTTP 403, code 1023, *"API is available in paid plans only"*. Two defects in one: a retry that could never succeed, and a deleted account's personal data going to a third party. Fixed with a send-time eligibility check (not sign-up time, because eligibility changes), three-way failure classification — permanent-account errors cool down six hours with one log line per window, permanent-per-subscriber errors suppress that subscriber, transient errors retry with doubling backoff to five attempts — plus email masking and API-key redaction in every log line |
| **Quality signals** | Integer minor units throughout, never a float. VAT computed backwards from inclusive prices in basis points. Cumulative apportionment when splitting an amount across lines. Gapless document numbers allocated inside the caller's transaction. 91 conditional `updateMany` state claims, 69 `$transaction` call sites, row locks where a rule spans rows. "Record in the transaction, execute after commit" in four services. 11 removal proofs — tests that fail when the guard they cover is deleted. Constant-time token comparison with an explicit length check first, because `timingSafeEqual` throws on mismatched lengths |
| **Results** | Live at `api.mrosew.com`. First deploy of own work through the full four-stage pipeline on 5 October 2026, verified in production rather than taken from the pipeline's report. Test suite grown from 2 spec files to 54 suites and 829 passing tests in 81 seconds. 10 deployment findings raised with DevOps, 3 closed by them. Events release delivered as 36 commits and 27,358 lines, with a runbook of before/after SQL, verification steps and a rollback path |
| **Artefacts** | A 1,306-line frontend API contract, 820-line release notes, a 9,590-line manual test plan across 27 numbered sections, and a cross-repository audit that named four live frontend/backend contract breaks before they reached customers |

- **Animation:** the architecture SVG draws its connector paths on in-view (`pathLength`
  0 → 1, `stagger.base`, static under reduced motion); metric rows count up; hard-problem
  blocks reveal with `distance.base`; sticky sub-navigation on `lg` tracks the current
  block via `IntersectionObserver`; a code/SQL snippet per hard problem, syntax-highlighted
  **at build time** (Shiki in an RSC, zero client JS).
- **Server/client:** entirely server-rendered except the count-ups, the SVG draw and the
  sticky sub-nav.

### 4.6 Other projects

- **Purpose:** show range without diluting the featured work.
- **Homepage:** a 6-card teaser grid plus "View all 12 projects →".
- **`/projects`:** full filterable index. Filters derived from the data, not hardcoded.
  Filter state in the URL (`?tech=nextjs`) so a filtered view is shareable and
  server-renderable.
- **Card content:** screenshot in the existing browser frame (keep it, add `sizes`),
  title, one-line outcome, role, year, 3–4 tech badges, live and repo links.
- **`/projects/[slug]`:** a scaled-down version of the case-study template — problem,
  what was built, stack, one or two notable details, screenshots, links. Generated from
  `src/content/projects/*.ts` with `generateStaticParams`, so every project is a static
  page with its own metadata and OG image.
- **Data shape change:** extend `Project` with `slug`, `role`, `year`, `summary`,
  `outcome`, `metrics?`, `featured`, `caseStudy` (real MDX/TS content, not `"#"`).
- **Animation:** `stagger.base` grid entrance; hover lift on the card with a 1.03 scale on
  the inner image only, clipped by the frame; filter changes animate with a shared
  `layoutId` so cards move rather than pop.

### 4.7 Experience timeline

- **Purpose:** chronology and progression at a glance.
- **Content:** entries with role, organisation, dates, 2–3 outcome bullets, tech. The
  mrosew.com engagement is fully evidenced (27 July – 9 October 2026, sole backend
  engineer). **Everything else needs confirming — see §9.**
- **Layout:** left rail on mobile, centre rail at `md`+. Dates in mono.
- **Animation:** the rail is an SVG line whose `pathLength` is bound to section scroll
  progress via `useScroll`; nodes fill as they pass the viewport centre; the nearest entry
  gets an accent border. Under reduced motion the rail renders complete and nodes are
  filled.

### 4.8 Skills

- **Purpose:** searchable keyword surface for recruiters, honest about depth.
- **Grouping by real usage, with evidence attached rather than percentage bars:**

| Group | Contents |
|---|---|
| Backend | NestJS 11, Node.js, TypeScript, REST API design, Passport (JWT + Google OAuth 2.0), class-validator, Joi, scheduled jobs |
| Databases | PostgreSQL 16, Prisma 6, schema design (59 models), migrations (82), transactions, row locks, conditional atomic claims |
| Payments & commerce | PayPal REST (hand-written client), Stripe, webhooks with an event ledger, idempotency keys, refunds, store credit, VAT, invoicing |
| Testing | Jest 30, 54 suites / 829 tests, property tests, concurrency fakes modelling row locks and commit visibility, removal proofs, a 27-section manual test plan |
| DevOps & cloud | Docker (multi-stage), GitHub Actions, Trivy scanning, zero-downtime migration policy, Cloudflare R2 via the S3 API, Cloudflare Stream |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Motion |
| Security | Argon2id, HMAC signed tokens, constant-time comparison, redirect allow-lists, helmet, rate limiting, log redaction and email masking, CSV-injection escaping |
| AI tooling | Claude Code in a disclosed-co-authorship workflow (165 of 336 commits carry the trailer) |

- **Rules:** **no percentage bars and no self-assigned "Advanced" labels.** Each group
  carries one short evidence line instead. Delete the `level` field from `skills-data.ts`.
- **Animation:** `stagger.tight` chip entrance per group; hover tints the chip with the
  brand colour already present in the data; no flipping, no 3D.
- **Server/client:** fully server-rendered.

### 4.9 Engineering principles

- **Purpose:** this is what separates a senior portfolio from a junior one — it shows
  *how* someone thinks.
- **Content:** four to six principles, each one sentence plus one concrete instance from
  the work:
  - *A test that still passes when the guard is deleted is not testing the guard.* — 11
    removal proofs; restoring the old refund bands fails 11 tests including the monotonic one.
  - *Read the written policy against the code.* — found the inverted refund bands that way.
  - *Put the decision in the database, not in the application.* — single-statement
    conditional claims for anything finite.
  - *A migration must be compatible with the code already running.* — the pipeline migrates
    while the old container still serves traffic.
  - *A closed finding whose reasoning has been deleted is a finding waiting to recur.* —
    why every closed audit item keeps its rationale.
  - *Disclose the AI assistance.* — 49% of commits carry the co-author trailer, and the
    number is on the page.
- **Layout:** two-column list at `lg`, single column below. Mono principle, sans evidence.
- **Animation:** `stagger.loose`, `distance.subtle`. Deliberately the quietest section.

### 4.10 Testimonials

**Not built in the first pass.** No quote in `docs/CV-PROJECT-NOTES.md` is attributable
and consented. The component gets built, left unmounted, and mounted only when real
quotes arrive. See §9. Inventing one is not an option — a fabricated testimonial is the
fastest way to lose a technical reviewer, and this is a hiring document.

### 4.11 Notes / blog

- **Purpose:** proof of technical writing, which the evidence strongly supports — 9,590
  lines of manual test plan, a 1,306-line API contract, 820 lines of release notes.
- **Implementation:** MDX via `@next/mdx`, files in `src/content/notes/*.mdx`, frontmatter
  parsed at build, `generateStaticParams`, Shiki highlighting in an RSC. Zero client JS on
  an article page beyond the shared shell.
- **Scope decision:** build the plumbing in a late phase; ship with two or three posts or
  do not link it at all. An empty blog is worse than no blog. Candidate first posts, all
  from existing material: "Claiming a finite resource without a race", "Why the refund
  bands were upside down, and the test that keeps them right", "Migrating a database while
  the old code is still serving traffic".

### 4.12 Contact

- **Purpose:** remove every obstacle to being contacted.
- **Content:** form (name, email, subject, message) with React Hook Form + Zod; direct
  email, shown as a real `mailto:` link and copyable in one click; a scheduling link
  (Cal.com or Calendly — URL needed, see §9); location and timezone — Bahawalpur,
  Pakistan · PKT (UTC+5) · remote, open to relocation, with a live local-time clock;
  GitHub and LinkedIn; current availability status.
- **Send path (decided):** `POST /api/contact`, a Next.js Route Handler. Server-only env
  vars (`EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`,
  `EMAILJS_PRIVATE_KEY`), Zod validation of the body, a honeypot field, a minimum
  submit-time check (reject under 2 s), and per-IP rate limiting. The browser never sees
  a key. `@emailjs/browser` is removed; the handler calls the EmailJS REST API directly.
  No CAPTCHA — it costs a third-party script and real conversions.
- **Credentials:** the previously hardcoded keys are in git history and were rotated on
  11 October 2026. New values live only in Vercel environment variables and `.env.local`.
- **WhatsApp:** one contact option inside this section, alongside email and the
  scheduling link. The floating bubble is removed.
- **Success state:** inline success panel replacing the form with a checkmark draw
  (`pathLength` 0 → 1, 0.4 s) plus a `sonner` toast. `role="status"` and `aria-live="polite"`
  so the result is announced. Failure shows an inline message with `role="alert"` — never
  `alert()`.
- **Animation:** field focus animates the border and ring opacity only; the submit button
  locks its width before swapping to the loading state so nothing reflows.
- **Replaces:** the Google Maps iframe, with a static location block.

### 4.13 Footer

- **Content:** section nav (generated from the same `navigation.ts` the navbar uses — one
  source), route nav (Projects, Résumé, Notes), socials, email, "Built with Next.js 16,
  React 19, Tailwind v4 and Motion — source on GitHub", a last-updated date from the git
  commit timestamp at build time, copyright, and a back-to-top control.
- **Animation:** back-to-top fades in past 60% scroll and uses native `scrollIntoView`
  with `behavior: "smooth"`, which respects `prefers-reduced-motion` at the platform level.
- **Server/client:** server-rendered except the back-to-top button.

### 4.14 Cross-cutting features

| Feature | Detail |
|---|---|
| **CV download** | `public/resume/AbdulRehman_FullStack.pdf` already exists (561 KB). Keep the PDF, drop the `.docx` from the public folder, add `download` on the anchor, and track the click in analytics |
| **Résumé page** | `/resume` renders the same data as HTML — indexable, linkable, printable via a `@media print` stylesheet, with the PDF as a secondary action |
| **GitHub activity** | Contribution stats fetched in an RSC with `revalidate: 3600`, rendered server-side. No client-side API call, no third-party image embed, no token in the browser. Degrades to hidden if the request fails |
| **Availability badge** | One component, one source of truth in `src/data/site.ts`, consumed by hero, contact and footer. Replaces the duplicated hero markup |
| **Site URL** | One constant: `src/lib/site.ts` → `SITE_URL`, read from `NEXT_PUBLIC_SITE_URL` with `https://abdulfullstackdev.vercel.app` as the fallback. `metadataBase`, canonicals, OG URLs, sitemap and JSON-LD all read it, so a later domain change is a one-line edit |
| **WhatsApp float** | **Removed.** WhatsApp survives only as a contact option inside the Contact section |
| **Custom 404** | Rebuild on theme tokens, keep the design energy, add real navigation (home, projects, contact) rather than only `history.back()` |
| **Command palette (⌘K)** | `cmdk` or a Radix-based dialog. Jump to any section or route, toggle theme, copy email, download CV, open GitHub/LinkedIn. Lazy-loaded on first `⌘K`/`Ctrl+K` or button press, so it costs nothing on load. Full keyboard support, `role="dialog"`, focus trap, Escape to close |
| **Scroll progress rail** | 2px accent bar at the top of the viewport, driven by `useScroll` with a transform-only `scaleX` |

---

## 5. Animation & Interaction Spec

### 5.1 Library decisions

| Library | Verdict | Reasoning |
|---|---|---|
| **`motion` (v12)** | **Keep — the only animation library** | It is Framer Motion's current package name and already a dependency. It covers everything needed: declarative entrances, `whileInView`, `useScroll` for scroll-linked progress, `layoutId` for shared-element transitions, springs, and `useReducedMotion` as a first-class hook. It tree-shakes, and `motion/react-m` with `LazyMotion` lets the full feature set be deferred |
| **`framer-motion`** | **Remove** | The same library under its old name. Having both risks two copies of the animation runtime in one bundle |
| **`gsap`** | **Remove** | Imported nowhere today. Its advantage is complex orchestrated timelines and ScrollTrigger, and `motion`'s `useScroll` plus `useTransform` covers every scroll-linked effect in this plan. Adding GSAP would mean two animation runtimes for one site — the exact overlap this plan forbids |
| **`lenis`** | **Measured trial in Phase 9, default remove** | Smooth scroll hijacking adds a scroll-wheel listener on every frame, is a known INP and accessibility liability, breaks native scroll anchoring and browser find-on-page scrolling, and fights trackpad momentum on macOS. Native scrolling plus `scroll-behavior: smooth` for anchors achieves the same perceived polish at zero cost. Decision (§10.1): add behind a flag in Phase 9, measure INP on a real mid-range Android, keep only if INP stays <200 ms with no regressions |
| **`react-icons`** | **Remove (Phase 6)** | Three icon sets in one package. `lucide-react` is the single UI icon set; brand logos come from `simple-icons` path data. Removal happens when skills and hero are rebuilt, not in Phase 0, so the look does not change mid-cleanup |
| **`@emailjs/browser`** | **Remove (Phase 0)** | Replaced by a Route Handler calling the EmailJS REST API with server-only keys |
| **`three` / `@react-three/fiber` / `drei` / `maath`** | **Remove** | The decorative starfield is the single largest performance cost on the site. Replaced by a static SVG noise layer plus one CSS radial glow. If a WebGL moment is wanted later, it returns as a `next/dynamic` import gated on `matchMedia("(min-width: 1024px)")`, `navigator.hardwareConcurrency >= 8`, `!prefers-reduced-motion` and `saveData === false` |
| **`react-countup`** | **Keep** | Small, does one job well, and the proof strip needs it. Must render the final value directly under reduced motion |
| **`cmdk`** | **Add** | Purpose-built command palette, tiny, accessible by default, and lazy-loaded so it costs nothing at first paint |
| **`shiki`** | **Add, build-time only** | Syntax highlighting for the case-study code snippets inside RSCs. Produces static HTML, ships **zero** client JavaScript, and replaces the usual 40 KB+ client highlighter |

Net effect: one animation library, one count-up helper, two build-time or lazy additions,
and four runtime packages removed.

### 5.2 Per-section specification

| Section | Entrance | Scroll-triggered | Parallax | Micro-interaction |
|---|---|---|---|---|
| **Loader** | opacity 0→1, 0.2 s | — | — | Any key, click or scroll skips immediately |
| **Hero** | Headline splits per **line** (not per character — per-character splitting on a hero is a layout-shift and screen-reader hazard), `stagger.base`, `distance.large`, `duration.slow`. Terminal fades in at +0.3 s then types | — | None on the text. The single accent glow translates at most 12px against scroll, `transform` only, desktop only | Magnetic primary CTA: pointer-tracked `translate3d` capped at 6px, spring return, desktop and fine-pointer only. Marquee pauses on hover |
| **Proof strip** | Tiles `stagger.tight`, `distance.base` | Count-up fires once on in-view | — | Hover raises the tile 2px and reveals the figure's source as a tooltip |
| **About** | Blocks `stagger.loose`. Portrait opacity only | — | None | — |
| **Case study** | Header `distance.large`; each block `distance.base` on in-view | Architecture SVG draws connectors (`pathLength` 0→1, `stagger.base`, 0.8 s). Sticky sub-nav highlights the current block | None | Metric rows count up. Code blocks get a copy button with a 1.2 s "Copied" state |
| **Projects grid** | Cards `stagger.base`, `distance.base` | — | Card image translates 8px on card hover only, clipped by the frame | Hover: card lifts 2px, border → `--border-strong`, shadow layer opacity 0→1. Filter changes animate via shared `layoutId` |
| **Timeline** | Entries `stagger.base` | Rail `pathLength` bound to section scroll progress; nodes fill at the viewport centre | None | Nearest entry takes an accent border |
| **Skills** | Group headers, then chips `stagger.tight` | — | None | Chip hover tints with the stored brand colour; 0.2 s |
| **Principles** | `stagger.loose`, `distance.subtle` | — | None | None — this section is deliberately still |
| **Contact** | Form fields `stagger.tight` from the left, map/info block from the right | — | None | Focus animates border and ring opacity; submit locks width then swaps to a spinner; success draws a checkmark `pathLength` |
| **Footer** | opacity only | Back-to-top fades in past 60% scroll | None | — |

### 5.3 Route transitions

- `/` ↔ `/projects` ↔ `/projects/[slug]` ↔ `/resume` ↔ `/notes`.
- Exit: opacity 1→0 plus `translateY(-8px)`, `duration.page × 0.5`. Enter: the reverse.
  `ease.inOut`.
- Use Next 16's view-transition support where available, with a `motion`
  `AnimatePresence` fallback. **Scroll restoration must keep working** — the current
  implementation force-scrolls to top on every path change, which is wrong when a browser
  back-navigation should restore position.
- Shared element: a project card's image flows into the case-study hero via `layoutId`
  where the browser supports it, and simply cross-fades where it does not.
- Prefetch on hover and on in-view for every internal link, so a transition never waits
  on the network.

### 5.4 Custom cursor

- Desktop only, gated on `(pointer: fine)` **and** `(min-width: 1024px)` **and**
  `!prefers-reduced-motion`.
- A 6px dot tracking the pointer with no delay, plus a 28px ring following with a spring
  (`stiffness: 300`, `damping: 28`).
- States: default; over an interactive element the ring expands to 44px and takes an accent
  border; over text the ring becomes a 2px caret bar; on press the dot scales to 0.8;
  hidden when the window loses focus or the pointer leaves the viewport.
- The native cursor is **never** hidden on form fields, links or anything a user might
  need to position precisely. `cursor: none` is scoped, never global.
- Implemented with `transform` on a `position: fixed` element inside a
  `requestAnimationFrame` loop, in its own stacking context, `pointer-events: none`.

### 5.5 Hard rules

1. Animate `transform` and `opacity` only. Any other animated property is a review failure.
2. 60fps on a mid-range Android phone. Verified in Chrome DevTools performance traces with
   6× CPU throttling and the frame-rendering overlay on.
3. `prefers-reduced-motion: reduce` is honoured everywhere. Implementation: a `useReducedMotion`
   guard in shared motion variants plus a global CSS fallback:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

   Under reduced motion: no loader, no marquee, no custom cursor, no parallax, no count-up
   animation (final values render immediately), no SVG path drawing (paths render complete),
   and all entrance animations become instant — content is never hidden behind a disabled
   animation.
4. No animation may delay content from being readable or clickable. Every animated element
   starts at `opacity: 0` **only** if it reaches `opacity: 1` within 600 ms of entering the
   viewport, and no interactive element is `pointer-events: none` while animating in.
5. Heavy effects are lazy-loaded and device-gated. No WebGL, 3D or canvas in the initial
   bundle, and the gate checks viewport, `prefers-reduced-motion`, `navigator.connection.saveData`
   and `hardwareConcurrency`.
6. One reveal per element, ever. `viewport={{ once: true }}` everywhere.
7. No scroll-jacking, no scroll-driven horizontal sections, no pinned full-screen scenes.
8. Marquee and the hero terminal are the only looping animations on the page, and both
   pause on hover and stop entirely under reduced motion.

---

## 6. Performance / Accessibility / SEO Budgets

### 6.1 Core targets

| Metric | Target | How it is verified |
|---|---|---|
| Lighthouse Performance (mobile) | **≥95** | Chrome DevTools Lighthouse, Moto G Power preset, 4× CPU throttle, three runs, median reported. Plus PageSpeed Insights against the `flash` preview URL |
| Lighthouse Accessibility | **100** | Lighthouse, then a manual axe DevTools pass, then a full keyboard-only walkthrough |
| Lighthouse Best Practices | **≥95** | Lighthouse; console must be clean |
| Lighthouse SEO | **100** | Lighthouse plus manual metadata inspection per route |
| LCP | **<2.0 s** | Lighthouse lab plus Vercel Speed Insights field data after launch |
| CLS | **<0.05** | Lighthouse; `web-vitals` logging in dev; manual check with images and fonts throttled |
| INP | **<200 ms** | Vercel Speed Insights field data; interaction traces on the nav, filters and command palette |
| TBT | **<200 ms** | Lighthouse |
| TTFB | **<600 ms** | Vercel analytics; everything static or ISR, nothing dynamic on the critical path |

### 6.2 JavaScript budget per route

| Route | First-load JS budget | Notes |
|---|---|---|
| `/` | **≤130 KB** gzipped | Framework baseline plus theme provider, nav, count-ups, terminal, marquee. The command palette, cursor and any WebGL are excluded because they are lazy |
| `/projects` | ≤120 KB | Adds filter state; the grid is server-rendered |
| `/projects/[slug]` | ≤110 KB | Static content; Shiki output is HTML, not JS |
| `/resume` | ≤90 KB | Near-static |
| `/notes/[slug]` | ≤100 KB | MDX compiled at build |

Enforcement: `npm run build` prints per-route first-load JS; record the numbers in each
phase's acceptance criteria and fail the phase on a regression over 10 KB without a
written reason. Add `@next/bundle-analyzer` behind an `ANALYZE=true` env flag.

### 6.3 Image strategy

- `next/image` everywhere, no raw `<img>` (currently true — keep it true).
- **Re-encode every source asset before use.** The seven PNGs over 1 MB in
  `public/projects/` get resized to a 1600px maximum width and converted to WebP/AVIF at
  source. Target under 200 KB each. `public/pictures/weblogo.png` goes from 255 KB to an
  optimised 96px asset or, better, an inline SVG mark.
- `formats: ["image/avif", "image/webp"]` in `next.config.mjs`.
- Every `fill` image gets an explicit `sizes`. Project cards:
  `sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"`.
- `priority` on exactly **one** image site-wide, and only if the LCP element turns out to
  be an image. If the LCP element is hero text, no image gets `priority`.
- Blur placeholders: `placeholder="blur"` with a static `blurDataURL` generated at build
  time for every local image, so no card pops in.
- Explicit `width`/`height` or a fixed aspect-ratio wrapper on every image, so nothing
  reserves zero space.
- Decorative images get `alt=""`; every content image gets a description of the content,
  not the filename.

### 6.4 Font strategy

- Geist Sans and Geist Mono via `next/font/google` — self-hosted at build, no third-party
  request, no `@import`.
- `display: "swap"` on both.
- Preload sans only. Mono is `preload: false` since it appears below the fold.
- `adjustFontFallback` left on (the default) so the fallback metrics match and the font
  swap does not shift layout.
- Latin subset only.
- No icon fonts anywhere — `lucide-react` tree-shakes to the icons actually imported.

### 6.5 Server vs client components

- **Default is server.** A `"use client"` directive must be justified in review.
- Target: no more than 10 client components in the whole tree. Permitted: `ThemeProvider`,
  nav scroll behaviour, mobile nav sheet, command palette, contact form, count-up tiles,
  hero terminal, marquee, custom cursor, back-to-top.
- Every section's text, headings, data and images are server-rendered. Client islands wrap
  the smallest possible subtree — a count-up tile is a client component, the proof strip
  around it is not.
- Delete `ClientLayout` as a wrapper of everything. The root layout composes server
  children and mounts providers as leaves.
- Data modules (`project-data`, `skills-data`, `tech-stack`) must stay importable from
  server components — no `"use client"` and no browser APIs in them.

### 6.6 Code splitting and prefetching

- `next/dynamic` with `ssr: false` for: command palette, custom cursor, and any WebGL.
- `LazyMotion` with `domAnimation` features for the common case, so the full `motion`
  feature bundle is not in the initial payload.
- Route-level splitting comes free with the App Router; verify in the build output that no
  route pulls the case-study content into `/`.
- `<Link prefetch>` (the default) for in-viewport internal links; explicit `prefetch` on
  hover for the primary CTAs.
- `revalidate: 3600` on the GitHub stats fetch; everything else fully static.

### 6.7 WCAG 2.2 AA

| Requirement | Implementation | Verification |
|---|---|---|
| Keyboard navigation | Every interactive element reachable and operable by keyboard, in DOM order. Focus trap in the mobile sheet and the command palette, with focus returned to the trigger on close | Full keyboard-only walkthrough of every route, no mouse |
| Focus visible | A single `:focus-visible` treatment — 2px `--accent-ring` offset 2px — applied via a shared utility class, on every custom control including `pop-button` | Tab through every route and confirm the ring is always visible against both themes |
| Contrast | 4.5:1 for body text, 3:1 for large text and UI boundaries. Audit every `--fg-*` on every `--bg-*` pairing in both themes | APCA/WCAG contrast check on the token matrix before any component is built |
| Target size (2.5.8) | ≥24×24px minimum, ≥44×44px on touch for all primary actions | Manual measurement at 360px |
| Alt text | Content images described; decorative images `alt=""`; the architecture SVG gets `role="img"` and an `aria-label`, plus a `<figcaption>` describing it in prose for screen readers | axe pass plus manual review |
| Semantic HTML | One `h1` per route, no skipped heading levels, `<nav>`/`<main>`/`<section>`/`<footer>` landmarks, lists as `<ul>` | axe landmark and heading-order checks |
| Skip link | "Skip to content" as the first focusable element, visually hidden until focused, targeting `#main` | Tab once from page load |
| Forms | `<label for>` ↔ `id` on every field, `aria-invalid` and `aria-describedby` on errors, `role="alert"` for errors, `role="status"` + `aria-live="polite"` for success, `autocomplete` attributes | Screen-reader pass (NVDA or VoiceOver) through a failed and a successful submission |
| Reduced motion | §5.5 rule 3 | Toggle the OS setting and re-walk every route |
| Zoom / reflow | Usable at 400% zoom and at 320px CSS width with no horizontal scroll | Manual |
| Active nav state | `aria-current="true"` on the active section link, not colour alone | Screen-reader pass |
| Language | `lang="en"` on `<html>` | Already correct |

### 6.8 SEO

| Item | Implementation |
|---|---|
| `metadataBase` | Set in the root layout to the production origin — currently missing, which breaks every relative metadata URL |
| Per-route metadata | `generateMetadata` on `/projects/[slug]` and `/notes/[slug]`; static `metadata` exports elsewhere. Unique title and description per route |
| Open Graph | Full `openGraph` block per route: `title`, `description`, `url`, `siteName`, `images`, `type`, `locale` |
| Twitter | `summary_large_image`, with creator handle if there is one |
| Dynamic OG images | `next/og` `ImageResponse` at `/api/og?title=…&kind=…`, rendering a branded 1200×630 card with the design-system tokens. One static fallback at `public/og-default.png` |
| JSON-LD | `Person` (name, job title, URL, `sameAs` socials, `knowsAbout`) in the root layout; `WebSite` with `potentialAction` on `/`; `CreativeWork` per project page; `BlogPosting` per note. Injected as a `<script type="application/ld+json">` from a server component |
| Sitemap | `app/sitemap.ts` enumerating every static route plus every project and note slug, with `lastModified` |
| Robots | `app/robots.ts` allowing everything, pointing at the sitemap |
| Canonical | `alternates.canonical` on every route |
| 404 status | Verify `[...slug]` returns HTTP 404, not 200 with 404 content |
| Semantic HTML | Headings and landmarks as per §6.7 — these are an SEO input as much as an accessibility one |
| Image SEO | Descriptive `alt` on every project screenshot |

### 6.9 Analytics, console, headers

- `@vercel/analytics` and `@vercel/speed-insights` — both tiny, both server-injected, and
  Speed Insights is the only source of real field Core Web Vitals.
- Track: CV downloads, case-study scroll depth, contact submissions, command-palette opens,
  outbound project-link clicks.
- **Zero console output in production.** No `console.log`, no React warnings, no hydration
  mismatches, no 404s on assets. This is a Lighthouse Best Practices input and a credibility
  signal when a reviewer opens DevTools — which, on a backend engineer's portfolio, they will.
- Security headers in `next.config.mjs`: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
  `Permissions-Policy` denying camera, microphone and geolocation, and a Content Security
  Policy. The CSP must be built last, after the final third-party list is known (EmailJS,
  Vercel Analytics), and verified with the console open on every route.

### 6.10 Testing

| Layer | Command | Gate |
|---|---|---|
| Types | `npm run typecheck` (`tsc --noEmit`, to be added) | Zero errors |
| Lint | `npm run lint` | Zero errors, zero warnings |
| Build | `npm run build` | Succeeds; per-route JS within §6.2 budgets |
| Smoke | `npm run test:e2e` — Playwright | One spec per route: page loads, `h1` is present, no console errors, primary CTA is visible, nav reaches every section, theme toggle flips `data-theme`, contact form shows a validation error on empty submit, 404 route returns 404 |
| Accessibility | `@axe-core/playwright` inside the smoke suite | Zero violations of serious or critical severity on every route |
| CI | `.github/workflows/ci.yml` on push to `flash` | typecheck → lint → build → Playwright, all four green before any phase is called done |

---

## 7. Folder Structure & Component Architecture

Target tree. `*` marks a new file or directory.

```
src/
├── app/
│   ├── layout.tsx                      # server: fonts, metadata, providers, skip link, JSON-LD
│   ├── page.tsx                        # server: section composition
│   ├── globals.css                     # tokens, theme, base layer, reduced-motion fallback
│   ├── not-found.tsx                   # rebuilt on tokens
│   ├── [...slug]/page.tsx              # catch-all → notFound()
│   ├── projects/
│   │   ├── page.tsx                  * # server: filterable index, filters from searchParams
│   │   └── [slug]/
│   │       ├── page.tsx              * # server: case study, generateStaticParams
│   │       └── opengraph-image.tsx   * # per-project OG image
│   ├── resume/page.tsx               * # HTML résumé + print stylesheet
│   ├── notes/                        * # optional, MDX
│   │   ├── page.tsx                  *
│   │   └── [slug]/page.tsx           *
│   ├── api/og/route.tsx              * # dynamic OG images
│   ├── sitemap.ts                    *
│   └── robots.ts                     *
│
├── components/
│   ├── layout/
│   │   ├── site-header.tsx           * # server shell
│   │   ├── nav/
│   │   │   ├── nav-desktop.tsx         # client island: active-section indicator
│   │   │   ├── nav-mobile.tsx          # client island: sheet
│   │   │   └── logo.tsx                # server
│   │   ├── site-footer.tsx           * # server
│   │   ├── theme-provider.tsx        * # client: next-themes
│   │   ├── theme-toggle.tsx          * # client
│   │   ├── command-palette.tsx       * # client, lazy
│   │   ├── custom-cursor.tsx         * # client, lazy, desktop-gated
│   │   ├── scroll-progress.tsx       * # client
│   │   ├── intro-loader.tsx            # client, first-visit only
│   │   ├── back-to-top.tsx           * # client
│   │   ├── whatsapp-button.tsx         # server anchor
│   │   └── background.tsx            * # server: noise layer + single glow
│   │
│   ├── sections/
│   │   ├── hero/
│   │   │   ├── hero.tsx                # server
│   │   │   ├── hero-terminal.tsx       # client island
│   │   │   └── tech-marquee.tsx      * # client island
│   │   ├── proof/
│   │   │   ├── proof-strip.tsx       * # server
│   │   │   └── metric-tile.tsx       * # client island: count-up
│   │   ├── about/about.tsx             # server
│   │   ├── featured/
│   │   │   ├── featured-case.tsx     * # server: homepage teaser
│   │   │   └── architecture-diagram.tsx * # server-rendered SVG, client only for the draw
│   │   ├── projects/
│   │   │   ├── projects-teaser.tsx     # server
│   │   │   ├── project-grid.tsx        # server
│   │   │   ├── project-card.tsx        # server
│   │   │   ├── project-filters.tsx   * # client island
│   │   │   └── browser-frame.tsx       # server, sizes added
│   │   ├── timeline/
│   │   │   ├── timeline.tsx          * # server
│   │   │   └── timeline-rail.tsx     * # client island: scroll-linked
│   │   ├── skills/skills.tsx           # server, level field removed
│   │   ├── principles/principles.tsx * # server
│   │   ├── testimonials/             * # built, unmounted until real quotes exist
│   │   └── contact/
│   │       ├── contact.tsx             # server
│   │       ├── contact-form.tsx        # client island: RHF + Zod
│   │       └── contact-info.tsx      * # server, replaces the maps iframe
│   │
│   ├── case-study/                   * # the case-study template primitives
│   │   ├── case-header.tsx           *
│   │   ├── case-section.tsx          *
│   │   ├── hard-problem.tsx          *
│   │   ├── metric-row.tsx            *
│   │   └── code-block.tsx            * # Shiki, build-time, zero client JS
│   │
│   └── ui/
│       ├── button.tsx                  # extended with the §3.6 variants
│       ├── container.tsx               # unchanged
│       ├── section.tsx                 # unchanged
│       ├── section-header.tsx        * # replaces four diverged copies
│       ├── card.tsx                  *
│       ├── badge.tsx                 *
│       ├── tag.tsx                   *
│       ├── input.tsx                 *
│       ├── textarea.tsx              *
│       ├── tooltip.tsx               *
│       ├── sheet.tsx                   # unchanged
│       ├── magnetic.tsx              * # client wrapper
│       ├── reveal.tsx                * # client: the one entrance-animation wrapper
│       └── copy-button.tsx           *
│
├── content/                          * # all content as typed data
│   ├── projects/
│   │   ├── index.ts                  * # registry + Project type
│   │   ├── mrosew-backend.ts         * # the full featured case study
│   │   └── <slug>.ts                 * # one per project
│   ├── notes/*.mdx                   * # optional
│   ├── experience.ts                 * # timeline entries
│   ├── principles.ts                 *
│   └── testimonials.ts               * # empty array until real quotes arrive
│
├── data/
│   ├── site.ts                       * # name, role, socials, email, availability, timezone
│   ├── navigation.ts                  # single nav source; constants.ts deleted
│   ├── skills.ts                       # renamed from skills-data.ts, level removed
│   └── metrics.ts                    * # the real proof numbers, each with a source note
│
├── hooks/
│   ├── use-active-section.ts           # rewritten on IntersectionObserver
│   ├── use-media-query.ts            *
│   ├── use-prefers-reduced-motion.ts * # wraps motion's useReducedMotion
│   └── use-mounted.ts                *
│
├── lib/
│   ├── utils.ts                        # cn — canonical; lib/cn.ts deleted
│   ├── motion.ts                     * # ease, duration, stagger, distance, variants
│   ├── seo.ts                        * # metadata builders, JSON-LD builders
│   ├── env.ts                        * # typed, validated env access
│   └── shiki.ts                      * # build-time highlighter singleton
│
└── types/
    └── index.ts                      * # Project, Note, Experience, Metric, Principle
```

Architectural rules:

1. **Server by default.** `"use client"` requires a reason, and the reason is written in a
   one-line comment at the top of the file.
2. **Content is data, never JSX.** Everything in `src/content/` and `src/data/` is typed,
   importable from a server component, and free of browser APIs.
3. **One component per concept.** No second `section-header`, no second `cn`, no second
   nav source. A duplicate is a bug.
4. **`ui/` knows nothing about the site.** Primitives take props; they never import from
   `content/` or `data/`.
5. **Motion constants live in `lib/motion.ts`.** No inline easing arrays or magic durations
   in components.
6. **Every metric renders from `data/metrics.ts`**, where each entry carries a `source`
   field naming where in `docs/CV-PROJECT-NOTES.md` it came from. If a number has no
   source it does not go on the site.

---

## 8. Phased Roadmap

Rules for every phase:

- The site must build, deploy and work at the end of the phase. No phase leaves it broken.
- Each phase ends with `npm run typecheck && npm run lint && npm run build` green.
- Commit at the end of each phase with a Conventional Commits message.
- **All work stays on `flash`.** Never merge to `main`. Vercel's preview URL for `flash` is
  the review surface.
- Record the per-route first-load JS from the build output in the phase's completion note,
  so regressions are visible.

---

### Phase 0 — Foundation and cleanup

**Goal:** remove the dead weight, add the quality gates, and get an honest performance
baseline, without changing how the site looks.

- [ ] Capture a baseline: Lighthouse mobile on the live site, and `npm run build`
      per-route JS. Paste both into `docs/BASELINE.md`.
- [ ] Add `"typecheck": "tsc --noEmit"` to `package.json` scripts.
- [ ] Add `.github/workflows/ci.yml`: typecheck → lint → build on push to `flash`.
- [ ] Delete `src/lib/cn.ts`; repoint any import to `@/lib/utils`.
- [ ] Delete `src/lib/constants.ts`.
- [ ] Delete `src/components/ui/creepy-resume-button.tsx`.
- [ ] Remove `tailwindcss-37200.log` and `tsconfig.tsbuildinfo` from git; add both to
      `.gitignore`.
- [ ] Remove dependencies: `gsap`, `framer-motion`, `react-intersection-observer`,
      `@emailjs/browser`. Move `shadcn` to `devDependencies`. Repoint every
      `framer-motion` import to `motion/react`. (`simple-icons` stays — it becomes the
      brand-logo source in Phase 6; `react-icons` goes in Phase 6 with the skills rebuild.)
- [ ] Replace `Star_Background.tsx` with `components/layout/background.tsx` — an inline SVG
      noise data URI plus one CSS radial glow, both `pointer-events-none fixed`. Remove
      `three`, `@react-three/fiber`, `@react-three/drei`, `maath`, `@types/three`. No WebGL
      anywhere on the site.
- [ ] Add the `prefers-reduced-motion` CSS fallback block to `globals.css`.
- [ ] Remove `a { cursor: pointer !important }` from `globals.css`.
- [ ] Re-encode every image in `public/projects/` to ≤1600px WebP at ≤200 KB; replace the
      42×42 logo asset; delete `public/resume/AbdulRehman_FullStack.docx`.
- [ ] Add `sizes` to every `fill` image; remove `priority` from the logo and the about portrait.
- [ ] Set `next.config.mjs`: `images.formats`, `poweredByHeader: false`, and the security
      headers from §6.9 **except** the CSP.
- [ ] Create `src/lib/site.ts` exporting `SITE_URL` from `NEXT_PUBLIC_SITE_URL` with
      `https://abdulfullstackdev.vercel.app` as the fallback.
- [ ] Create `src/lib/env.ts` (server-only, validated) and `POST /api/contact` as a Route
      Handler: Zod-validated body, honeypot field, minimum submit-time check, per-IP rate
      limit, EmailJS REST call with server-only keys. Point `contact-form.tsx` at it.
      Remove every hardcoded key from the source. Add `.env.example`.
- [ ] Remove the floating `WhatsappButton` from the layout (it returns inside the Contact
      section in Phase 7).
- [ ] Confirm the EmailJS keys were rotated (user reported done 11 October 2026). If not,
      remind at the end of the phase.

**Files touched:** `package.json`, `next.config.mjs`, `.gitignore`, `tsconfig.json`,
`.github/workflows/ci.yml`, `src/app/globals.css`, `src/lib/{cn,constants}.ts` (deleted),
`src/components/layout/Star_Background.tsx` → `background.tsx`,
`src/components/ui/creepy-resume-button.tsx` (deleted),
`src/components/layout/ClientLayout.tsx`, `src/components/layout/WhatsappButton.tsx`,
`src/components/sections/contact/contact-form.tsx`, `src/app/api/contact/route.ts`,
`src/components/sections/projects/browser-frame.tsx`, `src/components/sections/projects/project-data.tsx`,
`src/components/layout/navbar/logo.tsx`, `src/components/sections/about/about-card.tsx`,
`public/**`, `src/lib/{env,site}.ts`, `.env.example`, `docs/BASELINE.md`.

**Acceptance criteria**

- `npm run typecheck`, `npm run lint`, `npm run build` all green.
- CI green on `flash`.
- `node_modules` no longer contains `three` or `gsap`; `npm ls three` reports nothing.
- First-load JS on `/` drops by at least 150 KB against the baseline.
- No image in `public/` exceeds 300 KB.
- Lighthouse mobile Performance improves by at least 15 points against the baseline.
- The site looks essentially unchanged apart from the background.
- No EmailJS credential appears in any source file.

**How to verify:** run the three scripts; `npm run build` and diff the route table against
`docs/BASELINE.md`; Lighthouse mobile three runs on the `flash` preview, median recorded;
`du -b public/**`; `grep -rn "service_\|template_" src` returns nothing.

**Commit:** `chore(foundation): remove dead deps, optimise assets, add CI and quality gates`

---

### Phase 1 — Design system and theming

**Goal:** the token layer, the type scale, dark/light with no flash, and the motion
constants — everything later phases build on.

- [ ] Replace the colour section of `globals.css` with the §3.2 token set, both themes.
- [ ] Build the contrast matrix: every `--fg-*` against every `--bg-*`, both themes, recorded
      in `docs/CONTRAST.md`. Adjust any pair below 4.5:1 for body or 3:1 for UI.
- [ ] Add Geist Mono via `next/font/google`; define `--font-geist-mono`; fix the dangling
      `--font-mono` mapping.
- [ ] Add the §3.3 type scale to `@theme inline`.
- [ ] Create `src/lib/motion.ts` with `ease`, `duration`, `stagger`, `distance` and the
      shared variants.
- [ ] Create `src/components/layout/theme-provider.tsx` (`next-themes`,
      `attribute="data-theme"`, `defaultTheme="dark"`, `enableSystem`,
      `disableTransitionOnChange`) and mount it in the root layout.
- [ ] Create `src/components/layout/theme-toggle.tsx` with all five states from §3.6.
- [ ] Create `src/data/site.ts` — name, role, email, socials, availability, location, timezone.
- [ ] Create `src/types/index.ts`.
- [ ] Build a `/design` route (not linked, excluded from the sitemap) rendering every token,
      type size, and both themes side by side. This is the review surface for the rest of
      the programme.

**Files touched:** `src/app/globals.css`, `src/app/layout.tsx`, `src/lib/motion.ts`,
`src/components/layout/theme-{provider,toggle}.tsx`, `src/data/site.ts`,
`src/types/index.ts`, `src/app/design/page.tsx`, `docs/CONTRAST.md`.

**Acceptance criteria**

- Theme toggle flips `data-theme` and persists across reloads.
- **No flash of the wrong theme** on a hard reload, in either system preference, with CPU
  throttled 4×.
- Every token pair in `docs/CONTRAST.md` passes its threshold.
- `/design` renders every token and type size in both themes.
- Zero hydration warnings in the console.
- Build green, JS budget unchanged within 5 KB.
- **Responsive (§3.7):** `/design` checked at 360, 768 and 1440 — zero horizontal scroll,
  no clipped or overflowing type at the clamp floor and ceiling, token swatches reflow
  without overlap. Headings use `text-wrap: balance`.

**How to verify:** hard-reload `/design` ten times in each system preference with 4× CPU
throttle and watch for a flash; axe DevTools on `/design` in both themes; read the contrast
table; check the console on every route.

**Commit:** `feat(design-system): colour tokens, type scale, dual theme and motion constants`

---

### Phase 2 — Shell, navigation and motion primitives

**Goal:** dismantle `ClientLayout`, rebuild the shell server-first, and ship the shared
interaction primitives.

- [ ] Delete `ClientLayout.tsx`. Compose the shell in `app/layout.tsx` as a server component
      with providers and client islands as leaves.
- [ ] Add a skip-to-content link as the first focusable element, targeting `#main`.
- [ ] Rebuild `intro-loader.tsx`: first visit only via `sessionStorage`, ≤1.2 s hard cap,
      skippable on any key/click/scroll, bypassed under reduced motion, and **it must overlay
      content that is already in the DOM** rather than replace it.
- [ ] Rewrite `use-active-section.ts` on `IntersectionObserver`.
- [ ] Rebuild the navbar: server `site-header.tsx`, client islands for the active indicator
      (shared `layoutId` underline) and the mobile sheet. `aria-current` on the active item.
- [ ] Single source of navigation truth in `src/data/navigation.ts`; footer consumes the same
      module instead of building hrefs from strings.
- [ ] Create `ui/reveal.tsx` — the one entrance-animation wrapper, reduced-motion aware,
      `once: true`.
- [ ] Create `ui/section-header.tsx` and delete all four `sections/*/section-header.tsx` copies.
- [ ] Extend `ui/button.tsx` with the §3.6 variants and all six states; rebuild `pop-button`'s
      press feel using transform plus a shadow-layer opacity.
- [ ] Create `ui/{card,badge,tag,input,textarea,tooltip,copy-button,magnetic}.tsx`, each with
      its full state set, all rendered on `/design`.
- [ ] Add `scroll-progress.tsx` and `back-to-top.tsx`.
- [ ] Add the command palette (`cmdk`), lazy-loaded on first `⌘K`/`Ctrl+K` or button press.
- [ ] Add `custom-cursor.tsx`, lazy and gated per §5.4.
- [ ] Wire `@vercel/analytics` and `@vercel/speed-insights`.

**Files touched:** `src/app/layout.tsx`, `src/components/layout/**`, `src/components/ui/**`,
`src/hooks/**`, `src/data/navigation.ts`, `src/app/design/page.tsx`, `package.json`.

**Acceptance criteria**

- Client-component count across the tree is ≤10, each with a justifying comment.
- Keyboard-only: skip link works; every nav item, the theme toggle, the palette and the
  mobile sheet are reachable and operable; focus returns to the trigger on close.
- The loader does not appear on a second visit in the same session, is skippable, and never
  appears under reduced motion. Content is present in the DOM during it — verify in
  Elements, not visually.
- `⌘K` opens the palette and its JS is **not** in the initial bundle (confirm in the network
  panel).
- No custom cursor on touch, below 1024px, or under reduced motion.
- `/design` shows every primitive in every state, both themes.
- First-load JS on `/` ≤130 KB.
- **Responsive (§3.7):** the mobile menu is a designed full-screen menu with focus trap,
  scroll lock and Escape — checked at 280, 360, 768 and 844×390 landscape. Header respects
  `env(safe-area-inset-top)`. Every primitive on `/design` is clean at 360, 768 and 1440
  with zero horizontal scroll. Hover-only effects are wrapped in
  `@media (hover: hover) and (pointer: fine)`; tap targets ≥44×44px.

**How to verify:** full keyboard walkthrough with the mouse unplugged; DevTools network
panel filtered to JS before and after the first `⌘K`; `grep -rc "use client" src` and read
every hit; `npm run build` route table; axe on `/` and `/design`.

**Commit:** `refactor(shell): server-first layout, accessible nav, shared motion primitives`

---

### Phase 3 — Hero and proof strip

**Goal:** win the first ten seconds.

- [ ] Create `src/data/metrics.ts` — the six homepage figures from §4.3, each with a `source`
      field citing `docs/CV-PROJECT-NOTES.md`.
- [ ] Rebuild `hero.tsx` as a server component: name, positioning line, substantiation,
      availability badge (one implementation), primary and secondary CTAs, social links.
- [ ] Extract the availability badge into one component fed by `data/site.ts`; delete the
      duplicated markup.
- [ ] Rework `hero-terminal.tsx` to print real figures; keep it a small client island.
- [ ] Build `tech-marquee.tsx` — CSS/transform infinite translation, paused on hover, stopped
      under reduced motion, one row at `xs`.
- [ ] Build `proof-strip.tsx` (server) and `metric-tile.tsx` (client count-up), with the final
      value in server-rendered HTML and a tooltip naming each figure's source.
- [ ] Hook the CV download to `public/resume/AbdulRehman_FullStack.pdf` with `download` and an
      analytics event.
- [ ] **Delete `about-stats.tsx`** and its four unprovable figures.

**Files touched:** `src/components/sections/hero/**`, `src/components/sections/proof/**`,
`src/components/sections/about/about-stats.tsx` (deleted), `src/data/{metrics,site}.ts`,
`src/app/page.tsx`.

**Acceptance criteria**

- Every number on screen traces to a `source` field, and every `source` resolves to a real
  line in `docs/CV-PROJECT-NOTES.md`.
- "Years Experience", "Projects Built" and "Client Satisfaction" appear nowhere in the codebase.
- With JavaScript disabled, the hero text, all CTAs and all six metric values render and the
  links work.
- LCP element identified in a Lighthouse trace and under 2.0 s on mobile.
- CLS under 0.05 with the loader active.
- 60fps during the marquee under 6× CPU throttle.
- Count-ups render final values instantly under reduced motion.
- **Responsive (§3.7):** hero and proof strip checked across the full matrix (280 → 2560
  plus 844×390). Display heading uses `clamp()` and `text-wrap: balance` with no orphaned
  word at any width. Hero section height uses `dvh`/`svh`, not `vh`. Metric tiles 2×3 /
  3×2 / 6×1 with no overflow of `tabular-nums` figures. Marquee one row at `xs`.

**How to verify:** disable JS in DevTools and reload; Lighthouse trace and read the LCP
element; performance recording with 6× throttle and the FPS meter during marquee and scroll;
`grep -rn "Years Experience\|Client Satisfaction" src` returns nothing; toggle reduced motion
and reload.

**Commit:** `feat(hero): evidence-led hero, real metrics proof strip, tech marquee`

---

### Phase 4 — Featured case study: mrosew.com backend

**Goal:** the single artefact that makes the portfolio senior.

- [ ] Create `src/content/projects/index.ts` with the extended `Project` type and registry.
- [ ] Write `src/content/projects/mrosew-backend.ts` — every §4.5 block, facts only from
      `docs/CV-PROJECT-NOTES.md`, using the anonymised variant if §10 decides against naming
      the client.
- [ ] Build the `components/case-study/` primitives: `case-header`, `case-section`,
      `hard-problem`, `metric-row`, `code-block`.
- [ ] Add Shiki as a build-time highlighter in `lib/shiki.ts`; `code-block.tsx` renders static
      HTML with zero client JS.
- [ ] Hand-author `architecture-diagram.tsx` as inline SVG — theme-aware, `role="img"`, an
      `aria-label`, and a `<figcaption>` describing it in prose.
- [ ] Build `app/projects/[slug]/page.tsx` with `generateStaticParams` and `generateMetadata`.
- [ ] Build `featured-case.tsx` — the homepage teaser linking through.
- [ ] Add the sticky sub-navigation on `lg`, driven by `IntersectionObserver`.
- [ ] Add the SVG connector draw animation, static under reduced motion.

**Files touched:** `src/content/projects/**`, `src/components/case-study/**`,
`src/components/sections/featured/**`, `src/app/projects/[slug]/page.tsx`,
`src/lib/shiki.ts`, `src/app/page.tsx`, `src/types/index.ts`.

**Acceptance criteria**

- Every factual claim on the page traces to a specific section of `docs/CV-PROJECT-NOTES.md`;
  nothing from §I of that file (the unconfirmed list) appears anywhere.
- The route is statically generated — confirm it shows as `●` or `○`, not `ƒ`, in the build
  output.
- First-load JS on `/projects/mrosew-backend` ≤110 KB; the Shiki output contributes 0 KB of JS.
- The diagram is legible at 360px and at 2560px, in both themes.
- A screen reader announces the diagram's `aria-label` and reads the `figcaption`.
- Readable and navigable with JavaScript disabled.
- Reduced motion: connectors render complete, metrics show final values.
- **Responsive (§3.7):** case-study blocks use container queries so they are clean both at
  full width and beside the sticky sub-nav. Checked across the full matrix. Code blocks
  scroll horizontally inside their own box and never widen the page. Endpoint paths and
  SQL use `overflow-wrap: anywhere`. The diagram SVG scales with `viewBox` and stays
  legible at 280 and 2560.

**How to verify:** read the page against `docs/CV-PROJECT-NOTES.md` claim by claim; build
output route table; disable JS; NVDA or VoiceOver pass over the diagram; screenshot at 360px
and 2560px in both themes; axe.

**Commit:** `feat(case-study): mrosew.com backend engineering case study`

---

### Phase 5 — Projects index and per-project pages

**Goal:** range, without diluting the featured work, and twelve new indexable pages.

- [ ] Migrate all twelve projects from `project-data.tsx` into `src/content/projects/<slug>.ts`
      with the extended shape; delete the old file.
- [ ] Build `app/projects/page.tsx` — server-rendered, filterable, filter state in
      `searchParams`.
- [ ] Build `project-filters.tsx` as a client island that updates the URL.
- [ ] Rebuild `project-card.tsx` as a server component with outcome, role and year; add `sizes`
      to `browser-frame.tsx`.
- [ ] Shared `layoutId` animation on filter changes.
- [ ] Reuse the case-study template for each project's own page.
- [ ] Homepage teaser: six cards plus "View all 12 projects →".
- [ ] Generate and store `blurDataURL` for every project image.
- [ ] Replace every `caseStudy: "#"` with a real link, or remove the field from that project.

**Files touched:** `src/content/projects/**`, `src/components/sections/projects/**`,
`src/app/projects/**`, `src/app/page.tsx`.

**Acceptance criteria**

- All twelve projects have a static page with unique metadata, confirmed in the build output.
- `?tech=nextjs` renders server-side, correctly filtered, on a cold load.
- No `href="#"` anywhere in the codebase.
- No layout shift when switching filters.
- Lighthouse mobile ≥95 on both `/projects` and one `/projects/[slug]`.
- Every image carries `sizes` and a blur placeholder.
- **Responsive (§3.7):** project cards use a named container query so the same card is
  clean in the 6-up teaser, the 12-up index and at full width on a project page. Grid
  collapses 3 → 2 → 1 with no overflow; filter chips wrap, never scroll the page. Checked
  across the full matrix.

**How to verify:** build output route list; load `/projects?tech=nextjs` with JS disabled;
`grep -rn 'href="#"' src`; record a performance trace while switching filters and check for
layout-shift entries; Lighthouse both routes.

**Commit:** `feat(projects): typed project content, filterable index and per-project pages`

---

### Phase 6 — About, timeline, skills, principles

**Goal:** the supporting narrative, fully server-rendered.

- [ ] Rewrite `about.tsx` as one server component with the three §4.4 blocks; delete
      `about-card`, `about-story` and `expertise-grid` in favour of a single composition.
- [ ] Create `src/content/experience.ts`. Fill the mrosew.com entry from evidence; leave other
      entries as explicit `TODO` placeholders tied to §9 rather than inventing them.
- [ ] Build `timeline.tsx` (server) and `timeline-rail.tsx` (client, scroll-linked `pathLength`).
- [ ] Rebuild skills from `src/data/skills.ts` using the §4.8 groups; **delete the `level`
      field** and add one evidence line per group.
- [ ] Create `src/content/principles.ts` and `principles.tsx`.
- [ ] Build `testimonials/` components, leave them unmounted, and keep `testimonials.ts` an
      empty array.
- [ ] Audit heading order across the homepage: exactly one `h1`, no skipped levels.

**Files touched:** `src/components/sections/{about,timeline,skills,principles,testimonials}/**`,
`src/content/{experience,principles,testimonials}.ts`, `src/data/skills.ts`, `src/app/page.tsx`.

**Acceptance criteria**

- Zero `"use client"` in the about, skills and principles sections.
- No percentage bar and no self-assigned skill level anywhere.
- The timeline rail renders complete under reduced motion, and scroll-links at 60fps otherwise.
- Heading order passes axe with no violations.
- No placeholder or lorem text is visible on the deployed preview — unconfirmed entries are
  omitted, not stubbed in public.
- `react-icons` removed; brand logos render from `simple-icons` path data; `lucide-react`
  is the only icon component set.
- **Responsive (§3.7):** timeline switches left-rail → centre-rail at `md` with no overlap
  of dates and body at 320 or 844×390. Skill chips wrap within their group. About portrait
  keeps its aspect ratio at every width. Checked across the full matrix.

**How to verify:** `grep -rn "use client" src/components/sections/{about,skills,principles}`
returns nothing; axe heading-order check; performance trace while scrolling the timeline with
6× throttle; read the preview for placeholder text.

**Commit:** `feat(sections): about, scroll-linked timeline, evidence-based skills, principles`

---

### Phase 7 — Contact, footer, résumé page, 404

**Goal:** close every loop between a convinced reader and a conversation.

- [ ] Rebuild `contact-form.tsx` with React Hook Form + Zod and per-field error messages.
- [ ] Add spam protection: hidden honeypot plus a minimum submit-time check.
- [ ] Move the EmailJS send behind a Route Handler if §10 decides so; otherwise keep the
      client send with env-var credentials.
- [ ] Replace `alert()` with `sonner` toasts plus an inline `role="alert"` message.
- [ ] Add the success panel with the checkmark draw and a `role="status" aria-live="polite"` region.
- [ ] Build `contact-info.tsx`: copyable email, scheduling link, location, timezone, a live
      local-time clock, socials, availability. **Delete `map-card.tsx` and the Google Maps iframe.**
- [ ] Rebuild the footer as a server component consuming `navigation.ts` and `site.ts`; add the
      "built with" note and a build-time last-updated date.
- [ ] Build `app/resume/page.tsx` — HTML résumé, print stylesheet, PDF as a secondary action.
- [ ] Rebuild `not-found.tsx` on theme tokens with real navigation; remove the unused `Home`
      import; give `history.back()` a fallback.
- [ ] Verify `[...slug]` returns an HTTP 404 status.

**Files touched:** `src/components/sections/contact/**`, `src/components/layout/site-footer.tsx`,
`src/app/resume/page.tsx`, `src/app/not-found.tsx`, `src/app/[...slug]/page.tsx`, `src/lib/env.ts`.

**Acceptance criteria**

- Submitting an empty form shows per-field errors, announced by a screen reader, with no
  `alert()`.
- A successful submission announces via `aria-live` and the email arrives.
- The honeypot and the sub-2-second timing check both reject.
- Every field has a `<label for>` ↔ `id` pair and an `autocomplete` attribute.
- `/resume` prints to one or two clean pages with no dark background and no clipped content.
- `curl -I` on an unknown path returns `HTTP/2 404`.
- No Google Maps request in the network panel.
- WhatsApp appears as one option inside the Contact section; no floating bubble anywhere.
- **Responsive (§3.7):** form inputs are full-width at `xs` with ≥44px height; the
  form/info split stacks below `lg`; toasts respect `env(safe-area-inset-bottom)`;
  `/resume` reflows cleanly at 320 and prints to A4/Letter. Checked across the full matrix.

**How to verify:** submit empty, then valid, with a screen reader running; submit via `curl`
with the honeypot filled; `Ctrl+P` on `/resume`; `curl -sI <preview>/does-not-exist | head -1`;
network panel filtered to `google`.

**Commit:** `feat(contact): validated form with spam protection, résumé page, rebuilt footer and 404`

---

### Phase 8 — SEO, metadata and structured data

**Goal:** make the work findable and make a shared link look deliberate.

- [ ] Add `metadataBase` and complete the root `metadata` with `openGraph`, `twitter`,
      `authors` and `alternates.canonical`.
- [ ] Create `src/lib/seo.ts` with metadata and JSON-LD builders.
- [ ] Add `generateMetadata` to every dynamic route; unique title and description per route.
- [ ] Build `/api/og` with `next/og` `ImageResponse` using the design tokens; add
      `opengraph-image.tsx` per project; add a static fallback at `public/og-default.png`.
- [ ] Add JSON-LD: `Person` and `WebSite` in the root layout, `CreativeWork` per project page.
- [ ] Create `app/sitemap.ts` (every static route plus every project slug, with `lastModified`)
      and `app/robots.ts`.
- [ ] Exclude `/design` from the sitemap and add `noindex` to it.
- [ ] Add descriptive `alt` text to every project screenshot.
- [ ] Add the Content Security Policy to `next.config.mjs`, now that the third-party list is final.

**Files touched:** `src/app/layout.tsx`, `src/lib/seo.ts`, `src/app/api/og/route.tsx`,
`src/app/projects/[slug]/opengraph-image.tsx`, `src/app/{sitemap,robots}.ts`,
`next.config.mjs`, `src/content/projects/**`.

**Acceptance criteria**

- Lighthouse SEO 100 on every route.
- Every route's OG card renders correctly in a card validator or by loading the OG URL directly.
- JSON-LD passes Google's Rich Results Test with no errors.
- `/sitemap.xml` lists every real route and nothing else; `/robots.txt` points at it.
- Every route has a unique, non-templated description.
- CSP is active and the console is clean on every route.
- `metadataBase`, canonicals, OG URLs, sitemap and JSON-LD all read `SITE_URL` from
  `src/lib/site.ts` — `grep -rn "abdulfullstackdev" src` matches only that file.
- **Responsive (§3.7):** OG images render correctly at 1200×630; no responsive regressions
  introduced (spot-check 360, 768, 1440 on every route).

**How to verify:** Lighthouse SEO per route; open each `/api/og?...` URL directly; paste the
JSON-LD into the Rich Results Test; `curl <preview>/sitemap.xml`; walk every route with the
console open watching for CSP violations.

**Commit:** `feat(seo): full metadata, dynamic OG images, JSON-LD, sitemap and CSP`

---

### Phase 9 — Performance pass

**Goal:** hit the numbers, with evidence.

- [ ] Add `@next/bundle-analyzer` behind `ANALYZE=true`; record a report per route.
- [ ] Bring every route inside its §6.2 budget; name and remove the largest contributor on
      any route that is over.
- [ ] Wrap non-critical motion in `LazyMotion` with `domAnimation`.
- [ ] Confirm the command palette, custom cursor and any WebGL are absent from the initial
      bundle via the network panel.
- [ ] Audit every `"use client"` against the ≤10 target; convert what can be converted.
- [ ] Generate `blurDataURL` for every local image at build time.
- [ ] Confirm the LCP element on every route and make it the first thing the page can paint.
- [ ] Hunt CLS: fixed dimensions on every image, reserved space for the nav and any
      late-mounting island, font fallback metrics verified.
- [ ] Profile INP on the nav, filters, theme toggle and palette; keep every handler under 50 ms.
- [ ] Add `revalidate: 3600` to the GitHub stats fetch and make it degrade to hidden on failure.
- [ ] **Lenis trial (§10.1 decision 3):** add `lenis` behind a `NEXT_PUBLIC_SMOOTH_SCROLL`
      flag. Measure INP on a real mid-range Android via Speed Insights for 48 hours; check
      trackpad momentum, find-on-page and scroll anchoring by hand. Keep only if INP stays
      <200 ms with no regressions; otherwise remove it and the dependency.

**Files touched:** `next.config.mjs`, `package.json`, most components (lazy boundaries and
client/server boundaries only).

**Acceptance criteria**

- Lighthouse mobile ≥95 Performance on `/`, `/projects`, `/projects/mrosew-backend`, `/resume`,
  median of three runs.
- LCP <2.0 s, CLS <0.05, TBT <200 ms on mobile.
- Every route within its JS budget, recorded in `docs/BASELINE.md` alongside the Phase 0 figures.
- 60fps during every animation at 6× CPU throttle.
- No layout-shift entries in a performance trace of a full page scroll.
- Lenis trial concluded and recorded in `docs/BASELINE.md` with the INP figures.
- **Responsive (§3.7):** below `lg`, parallax is off, entrance distances drop to
  `distance.base` and stagger is halved — verified in a 6× throttled trace at 360.
  Spot-check 360, 768, 1440 on every route for regressions from lazy boundaries.

**How to verify:** three Lighthouse runs per route, median recorded; `ANALYZE=true npm run build`
reports; performance traces at 6× throttle for scroll, filter and palette interactions; network
panel JS totals before and after first interaction.

**Commit:** `perf(bundle): route budgets, lazy boundaries, image placeholders, CLS and INP fixes`

---

### Phase 10 — Accessibility and reduced-motion audit

**Goal:** 100 on Accessibility, and genuinely usable without a mouse or without motion.

- [ ] axe DevTools on every route, in both themes. Fix every violation.
- [ ] Full keyboard-only walkthrough of every route with the mouse unplugged, including the
      mobile sheet, the palette, the filters and the form.
- [ ] Verify the focus ring is visible on every interactive element in both themes.
- [ ] Screen-reader pass (NVDA or VoiceOver): landmarks, heading order, the diagram, form errors
      and the success announcement.
- [ ] Re-verify the contrast matrix against the as-built colours, not the planned ones.
- [ ] Reduced-motion pass: toggle the OS setting and walk every route confirming no loader, no
      marquee, no cursor, no parallax, no count-up animation, no path drawing, and that nothing
      is left invisible.
- [ ] Measure touch targets at 360px; everything primary ≥44×44px.
- [ ] Test at 400% zoom and 320px CSS width for reflow with no horizontal scroll.
- [ ] Confirm `aria-current` on the active nav item and `aria-label` on every icon-only control.

**Files touched:** wherever the audits point — expect small fixes across `ui/` and `layout/`.

**Acceptance criteria**

- Lighthouse Accessibility 100 on every route, both themes.
- Zero serious or critical axe violations.
- Every route fully operable by keyboard alone, with focus never lost or trapped.
- Under reduced motion, every route is complete and readable with no animation running.
- No horizontal scroll at 320px or 400% zoom.
- **Responsive (§3.7):** the full matrix (280 → 2560 plus 844×390) walked by hand on every
  route in both themes — zero horizontal scroll, no overflow, no overlap, no distorted
  image, no orphaned heading word. Findings fixed in this phase, not deferred.

**How to verify:** axe per route per theme; the keyboard walkthrough with the mouse physically
unplugged; a screen-reader recording of the contact-form error and success paths; OS
reduced-motion toggled for a full second walkthrough; DevTools responsive mode at 320px and
browser zoom at 400%.

**Commit:** `fix(a11y): WCAG 2.2 AA compliance and full reduced-motion support`

---

### Phase 11 — Testing and CI

**Goal:** make it impossible to break the site quietly.

- [ ] Add Playwright with a Chromium and a Mobile Chrome project.
- [ ] One smoke spec per route: loads, `h1` present, no console errors, primary CTA visible.
- [ ] Specs for: nav reaching every section, theme toggle flipping `data-theme` and persisting,
      the command palette opening by keyboard, the contact form rejecting an empty submit,
      project filters updating the URL and the results, the 404 route returning 404.
- [ ] Add `@axe-core/playwright` and assert zero serious or critical violations per route.
- [ ] Add a JS-disabled spec asserting the hero, metrics and navigation still render.
- [ ] **Responsive screenshot tests:** `toHaveScreenshot()` at 360, 768, 1280 and 1920 for
      every route, both themes, reduced-motion forced on so captures are deterministic.
      Baselines committed under `e2e/__screenshots__/`.
- [ ] **Overflow guard:** one spec that visits every route at every width in the §3.7
      matrix (280, 320, 360, 375, 390, 414, 430, 600, 768, 820, 1024, 1280, 1440, 1536,
      1920, 2560, plus 844×390) and asserts
      `document.documentElement.scrollWidth <= window.innerWidth`.
- [ ] Add `"test:e2e": "playwright test"` and extend CI to typecheck → lint → build → e2e.
- [ ] Add a CI step asserting per-route first-load JS stays within budget.

**Files touched:** `playwright.config.ts`, `e2e/**`, `package.json`,
`.github/workflows/ci.yml`.

**Acceptance criteria**

- `npm run test:e2e` passes locally and in CI, on desktop and mobile projects.
- The axe assertions pass on every route.
- Screenshot baselines exist for every route × {360, 768, 1280, 1920} × {dark, light}.
- The overflow guard passes at all 17 widths on every route, and fails when a deliberate
  `w-[3000px]` element is temporarily added — proven once, then reverted.
- The budget step fails the build when a route exceeds its budget — prove it by temporarily
  lowering a budget and watching CI go red.
- CI green on `flash`.

**How to verify:** run the suite locally; push and read the CI log; deliberately break one
assertion and confirm CI fails; temporarily tighten a budget and confirm the gate fires.

**Commit:** `test(e2e): Playwright smoke and accessibility suite with CI budget gates`

---

### Phase 12 — Optional: notes / MDX

**Goal:** demonstrate technical writing — or skip cleanly. Only run this phase if at least
two posts are actually ready.

- [ ] Add `@next/mdx` and the content pipeline for `src/content/notes/*.mdx`.
- [ ] Build `/notes` and `/notes/[slug]` with `generateStaticParams` and per-post metadata.
- [ ] Shiki highlighting in RSCs; zero client JS added to an article page.
- [ ] Write two or three posts from existing material (§4.11 candidates).
- [ ] Add `BlogPosting` JSON-LD, sitemap entries, and OG images per post.
- [ ] Link `/notes` from the nav and footer **only** once posts exist.

**Files touched:** `next.config.mjs`, `src/app/notes/**`, `src/content/notes/**`,
`src/lib/seo.ts`, `src/app/sitemap.ts`, `src/data/navigation.ts`.

**Acceptance criteria**

- Every post is a static route with unique metadata and its own OG image.
- An article page adds no client JS beyond the shared shell.
- Lighthouse ≥95 on an article route.
- `/notes` is unlinked and absent from the sitemap if there are no posts.
- **Responsive (§3.7):** article prose capped at `max-w-[68ch]`; code blocks scroll inside
  their box; tables wrap or scroll inside a container; checked at 360, 768, 1440 and 2560.

**Commit:** `feat(notes): MDX technical writing with static generation and per-post metadata`

---

### Phase 13 — Polish, QA and launch

**Goal:** ship it.

- [ ] Cross-browser QA: Chrome, Firefox, Safari (macOS and iOS), Edge. Note any Safari
      backdrop-filter or `clamp` discrepancy.
- [ ] Device QA: a real mid-range Android and a real iPhone, not only DevTools emulation.
- [ ] Viewport QA at 360, 390, 768, 1024, 1440, 2560 and 3840px.
- [ ] Final content proofread: every number re-checked against `docs/CV-PROJECT-NOTES.md`;
      no placeholder, no lorem, no `TODO`, no unresolved `§9` item on a public page.
- [ ] Confirm nothing from §I of the CV notes (the unconfirmed list) has leaked onto the site.
- [ ] Delete `/design`, or keep it `noindex` and unlinked — decide and record.
- [ ] Confirm the console is clean on every route in every browser.
- [ ] Verify the CSP triggers no violation in any browser.
- [ ] Final Lighthouse: all four categories, every route, mobile and desktop. Record in
      `docs/BASELINE.md`.
- [ ] Verify analytics events fire: CV download, contact submit, palette open, outbound click.
- [ ] Test the contact form end to end from a real device and confirm the email arrives.
- [ ] Confirm the EmailJS keys were rotated after the Phase 0 exposure.
- [ ] Update `README.md` and `CLAUDE.md` to describe the new architecture.
- [ ] Final `docs/BASELINE.md` comparison table: before and after, every metric.
- [ ] Present the `flash` preview URL for approval.
- [ ] **After approval only:** merge `flash` into `main` (`git merge --no-ff flash`), push,
      confirm the Vercel production deploy is green and the live site matches the preview.

**Files touched:** `README.md`, `CLAUDE.md`, `docs/BASELINE.md`, plus whatever QA surfaces.

**Acceptance criteria**

- Lighthouse ≥95 in all four categories on every route, mobile, median of three runs.
- Accessibility 100 everywhere.
- Zero console output in production on every route in every browser.
- Every number on the site traceable to `docs/CV-PROJECT-NOTES.md`.
- The before/after table in `docs/BASELINE.md` is complete.
- CI green on `flash`; the preview URL is the release candidate.
- **Responsive (§3.7):** the full matrix walked on real devices (one Android phone, one
  iPhone, one tablet if available) plus 2560 on a desktop — not emulation only.
- Preview approved by the user before the merge; production deploy verified after it.

**Commit:** `chore(launch): cross-browser QA, final audits and documentation`

---

## 9. CONTENT I NEED FROM ABDUL

Nothing below can be invented. Anything still unchecked when its phase arrives gets
**omitted** from the site rather than filled with a guess.

### Identity and positioning

- [ ] **Positioning line** — one sentence, how you want to be read in ten seconds. Draft for
      approval: *"Backend engineer. I build commerce systems where correctness is the product."*
- [ ] **Availability status** — exact wording and whether it is true today (open to full-time /
      contract / both / not looking).
- [ ] **Years of experience** — a real number, or confirmation to omit it entirely. The CV notes
      prove an 11-week engagement, not a career length. The current site claims "2+" with nothing
      behind it.
- [ ] **Location and relocation** — confirm "Bahawalpur, Pakistan · PKT (UTC+5) · remote, open to
      relocation" is accurate and that you want the city published.
- [ ] **Preferred professional name and pronunciation**, if you want it shown.

### The mrosew.com case study

- [x] **Can the client be named?** Yes — Mbango Rose Whittaker / mrosew.com (11 Oct 2026).
      Fallback: anonymised build if unconfirmed at Phase 4 start.
- [ ] **Is the repository private?** Assumed yes. Confirm, so the page can say so explicitly
      rather than leaving a dead "Source" link.
- [ ] **Can `api.mrosew.com` be linked?** It is an API, not a site — probably better named than
      linked.
- [x] **AI-assistance disclosure** — Yes (11 Oct 2026). Shown on the case-study page as
      "165 of 336 commits carry a `Co-Authored-By: Claude` trailer (49%)", framed as the
      working method — AI tooling with review, tests and removal proofs.
- [ ] **Has `release/events` been merged and deployed since the notes were written?** (CV notes §I.8)
- [ ] **`main`'s real test count** — the notes only have a static floor of 162 declarations.
      `git switch main && npm test` settles it. The site will quote the `release/events` figure
      (829) unless you say otherwise.
- [ ] **Screenshots or diagrams you are permitted to publish** — any admin UI, any dashboard.
      If none, the architecture diagram carries the page alone, which is fine.
- [ ] **Is VAT switched on now?** (CV notes §I.14) — only matters if the page mentions current state.

### Experience timeline

- [ ] **Every role before mrosew.com**: title, organisation (or "confidential client"), start and
      end month/year, 2–3 outcome bullets, tech. Nothing goes on the timeline without this.
- [ ] **Education** — institution, qualification, years. Include or omit?
- [ ] **Employment status during the mrosew.com work** — contract, employed, freelance? The
      notes say "sole backend engineer" but not the engagement type.
- [ ] **Certifications**, if any.

### Other projects

- [ ] For each of the twelve existing projects: a **real one-line outcome** (what it achieved,
      not what it is), **your role**, the **year**, and whether the repo link is public and live.
- [x] Which projects should be **cut**? None — all twelve stay (11 Oct 2026). Six on the
      homepage teaser, all twelve on `/projects`, mrosew.com featured.
- [ ] Any project with **real metrics** (users, transactions, load time, revenue)?
- [ ] Any project that must stay **unnamed** for client reasons?

### Testimonials

- [ ] **Any real, attributable, consented quote?** Name, role, organisation, and permission to
      publish. If none, the section stays unmounted. It will not be filled with an invention.

### Contact and links

- [ ] **Scheduling link** — Cal.com, Calendly, or none.
- [ ] **Confirm the public email.** `docs/CV-PROJECT-NOTES.md` context and the README give
      `abdulrehman.fullstackdev@gmail.com`; the git author email differs. Which is public?
- [ ] **Socials to show** — GitHub `abdul0325` and LinkedIn `abdul-rehman-961428265` are in the
      README. X/Twitter? Any others?
- [x] **Keep the WhatsApp button?** Float removed; one option inside Contact (11 Oct 2026).
- [ ] **CV file** — is `public/resume/AbdulRehman_FullStack.pdf` current, and does it match the
      numbers this site will publish? The two must not disagree.

### Operational

- [x] **Rotate the EmailJS keys.** Reported rotated 11 Oct 2026. New values go in Vercel env
      vars (`EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`,
      `EMAILJS_PRIVATE_KEY`) and local `.env.local`. **Still needed: set them in Vercel.**
- [x] **Confirm the production domain** — `abdulfullstackdev.vercel.app` (11 Oct 2026).
      Held in `src/lib/site.ts` → `SITE_URL`.
- [ ] **Vercel Analytics** — enabled on the project?
- [ ] **Google Search Console** — do you want it verified, and do you have the token?

---

## 10. Risks and Decisions

### 10.1 Decisions made — 11 October 2026

| # | Decision | Outcome |
|---|---|---|
| 1 | Name the client? | **Named — Mbango Rose Whittaker / mrosew.com.** If unconfirmed when Phase 4 starts, build anonymised so that naming later is a content swap only |
| 2 | Disclose AI co-authorship? | **Yes.** On the case-study page, framed as how the work is done with AI tooling — review, tests and removal proofs — not as a caveat |
| 3 | Lenis? | **Measured trial in Phase 9** behind a flag; keep only if INP stays <200 ms on a real mid-range Android with no regressions. Default: remove |
| 4 | WebGL? | **Removed completely** — `three`, `@react-three/fiber`, `@react-three/drei`, `maath`. Static SVG noise plus one CSS glow. No WebGL anywhere on the site |
| 5 | EmailJS send path? | **Route Handler** with server-only env vars, Zod validation, honeypot, rate limiting. Keys rotated 11 October 2026 |
| 6 | How many projects? | **All twelve kept.** mrosew.com is the featured case study; six on the homepage teaser, all twelve on `/projects` |
| 7 | Custom cursor? | **Yes**, desktop-gated, conservative |
| 8 | Blog? | **Plumbing in Phase 12, unlinked until two posts exist** |
| 9 | Intro loader? | **Keep**, fixed per §4.1 |
| 10 | Themes? | **Both**, dark default |
| 11 | WhatsApp float? | **Removed.** One contact option inside the Contact section only |
| 12 | Domain? | **Staying on `abdulfullstackdev.vercel.app`.** One constant `SITE_URL` in `src/lib/site.ts`, read from `NEXT_PUBLIC_SITE_URL` with that value as fallback |
| 13 | Scope? | **All phases**, Phase 8 remains a legitimate stopping point |
| — | `.docx` résumé? | **Deleted.** PDF stays |
| — | Fonts? | **Geist Sans + Geist Mono confirmed**, no third display face (§3.8) |
| — | Animation stack? | **`motion` only** for UI and scroll choreography; no GSAP (§3.8) |
| — | Icons? | **`lucide-react` only**; brand logos from `simple-icons` path data; `react-icons` removed in Phase 6 (§3.8) |

### 10.2 Rationale

The table below is kept as the record of why each call went the way it did.

| # | Decision | Options | Recommendation |
|---|---|---|---|
| 1 | **Name the client or anonymise?** | (a) Name Mbango Rose Whittaker / mrosew.com. (b) Use the §H anonymised version — "a UK founder's commerce and events platform" | **(a), if you have permission.** A named, live, verifiable platform is dramatically more persuasive than an anonymous one, and the API host is publicly resolvable anyway. Ask the client. If the answer is no or unclear, (b) loses very little — every technical bullet works unchanged |
| 2 | **Disclose the AI co-authorship?** | (a) Put "49% of commits carry a Claude co-author trailer" on the case study. (b) Omit it | **(a).** It is in the git history of a repository a prospective employer may one day see. Volunteering it, with the engineering rigour visible beside it, reads as professional honesty. Concealing something discoverable is the worse risk, and in 2026 the disclosure is closer to normal practice than to a confession |
| 3 | **Add Lenis for smooth scrolling?** | (a) No — native scroll plus `scroll-behavior: smooth`. (b) Yes | **(a).** Scroll hijacking is an INP and accessibility liability, breaks native scroll anchoring and find-on-page, and fights trackpad momentum. It is also the single most common reason a visually impressive portfolio scores badly on Core Web Vitals. The polish is not worth the budget |
| 4 | **Keep any WebGL?** | (a) Remove entirely; static noise plus one CSS glow. (b) Keep a lazy, device-gated version. (c) Keep as-is | **(a) for Phase 0, with (b) available later.** The starfield is the largest single performance cost on the site, and the design concept does not need it. If a WebGL moment is wanted afterwards, it returns gated on viewport, core count, `saveData` and `prefers-reduced-motion` — and only if the budget still holds |
| 5 | **EmailJS from the client, or a Route Handler?** | (a) Client-side with `NEXT_PUBLIC_*` keys. (b) Server Route Handler holding the secret with a rate limit | **(b).** A public EmailJS key is abusable by anyone who reads the bundle, and a backend engineer's portfolio sending mail from the browser with an exposed key is a bad look if a reviewer checks. A Route Handler costs about thirty lines, removes the key from the client, and gives you rate limiting. Either way, **rotate the current keys** |
| 6 | **Twelve projects, or fewer?** | (a) All twelve, six featured. (b) Cut to the best six. (c) Cut to four plus the case study | **(b), six.** Twelve equal cards says "I take any job." Six strong ones with real outcomes says "I choose my work." If some of the twelve are template or tutorial builds, they actively dilute the mrosew.com case study. Keep the index page for all of them only if each has a genuine outcome line |
| 7 | **Custom cursor — yes or no?** | (a) Yes, desktop-gated. (b) No | **(a), implemented conservatively.** It is a strong craft signal on a portfolio and costs almost nothing when lazy and gated. The risk is overdoing it — so: never hide the native cursor on form fields or links, no trailing particles, no lag on the dot itself. If it tests badly on a real trackpad, cut it in Phase 13 without regret |
| 8 | **Build the blog?** | (a) Yes, 2–3 posts. (b) Build the plumbing, ship unlinked. (c) Skip | **(b) initially, then (a) when posts exist.** The evidence for technical-writing ability is genuinely strong — 9,590 lines of manual test plan, a 1,306-line API contract — so a blog is well supported. But an empty or single-post blog is worse than none, and the three candidate posts in §4.11 are extractions from work already written, so the cost is lower than it looks. Do not link it until two posts are live |
| 9 | **Keep the intro loader at all?** | (a) Yes, ≤1.2 s, first visit only, skippable. (b) Remove it | **(a).** The scramble effect is genuinely good and worth keeping — but the current implementation's sins (every visit, 800 ms minimum, content removed from the DOM) are exactly what makes loaders a liability. Fixed per §4.1 it costs nothing measurable and adds a moment of character |
| 10 | **Dark-only, or both themes?** | (a) Both, dark default. (b) Dark only | **(a).** `next-themes` is already a dependency, the light tokens are already drafted, and some reviewers read on a bright screen or print pages. The cost is one contrast matrix and discipline about using tokens instead of literal colours — which this plan requires anyway |
| 11 | **Keep the WhatsApp float?** | (a) Keep. (b) Move into the contact section. (c) Remove | **(b).** A floating WhatsApp bubble signals "freelance gigs" to exactly the audience this redesign is targeting, and it permanently occupies a corner of the viewport. As a contact option inside the contact section it keeps its utility and loses the signal |
| 12 | **Custom domain before launch?** | (a) Buy one now. (b) Ship on `abdulfullstackdev.vercel.app` | **(a), if you will ever buy one.** `metadataBase`, every canonical URL, every OG image URL and every Search Console verification depends on the origin. Moving it after launch means redoing all of that and losing whatever indexing has accumulated. Decide before Phase 8 |
| 13 | **Scope risk: 13 phases is a long programme** | (a) Run all phases. (b) Stop after Phase 8 (a complete, fast, SEO-correct site) and treat 9–13 as follow-up | **(a), but with (b) as a legitimate stopping point.** Phases 0–8 produce a deployable site that beats the current one on every axis. Phases 9–13 are what take it from good to unarguable. If time pressure appears, stop after 8, ship, and continue — do not half-finish a later phase |
| 14 | **Risk: numbers on the site must match the CV** | — | Before Phase 13, read the published PDF against `src/data/metrics.ts`. If the PDF says something the site contradicts, one of them is wrong and a reviewer comparing the two will notice. Fix the PDF, not the site — the site's numbers are the sourced ones |
