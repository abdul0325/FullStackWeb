# Performance Baseline

Measured figures, recorded per phase. Lighthouse runs use the mobile preset with simulated
throttling (`lighthouse --preset=perf --form-factor=mobile --throttling-method=simulate`),
median of the runs listed. First-load JS is the gzip total of every `<script>` referenced by
the prerendered `.next/server/app/index.html` (Next 16 + Turbopack no longer prints a
per-route table).

## Before — live site, 11 October 2026 (pre-Phase 0)

Target: https://abdulfullstackdev.vercel.app/ (commit `10acde1`), 1 run.

| Metric | Value |
|---|---|
| Lighthouse Performance | **52** |
| Lighthouse Accessibility | 92 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 92 |
| First Contentful Paint | 1.0 s |
| Largest Contentful Paint | **6.1 s** |
| Total Blocking Time | **1,080 ms** |
| Cumulative Layout Shift | 0.022 |
| Speed Index | 4.9 s |
| Total byte weight | 1,247 KiB |
| First-load JS on `/` | **541.3 KB gzip** (1,875.9 KB raw, 13 files) |
| Largest single chunk | 251.4 KB gzip (three.js + react-three) |
| `public/` image weight | ~17.0 MB (seven PNGs over 1 MB; largest 2.27 MB) |
| Client components | 44 of 52 source files |

## After Phase 0 — local production build, 11 October 2026

| Metric | Value | Δ vs before |
|---|---|---|
| First-load JS on `/` | **304.6 KB gzip** (974.8 KB raw, 13 files) | **−236.7 KB (−44%)** |
| Largest single chunk | 69.3 KB gzip | −182 KB |
| `public/` image weight | ~0.66 MB (largest 85 KB WebP) | **−16.3 MB** |
| Dependencies removed | `three`, `@react-three/fiber`, `@react-three/drei`, `maath`, `@types/three`, `gsap`, `framer-motion`, `react-intersection-observer`, `@emailjs/browser`; `shadcn` → devDependencies | 10 fewer runtime packages |

Lighthouse after Phase 0 (local `next start`, 1 run) — see the Phase 0 report; the
authoritative after-figure is the Vercel preview run, recorded below once available.

**Preview column blocked (11 October 2026):** the `flash` preview
(`full-stack-4pu90asyq-abdul-rehmans-projects-315a6ea5.vercel.app`) is behind Vercel
Authentication — every route 302s to SSO and `/api/contact` returns 401 "Protected
deployment". Lighthouse and the contact-form test need either Deployment Protection turned
off for Preview, or a Protection Bypass for Automation secret (sent as the
`x-vercel-protection-bypass` header). Local prod-build figures stand in until then.

| Metric | Before (live) | Local prod after Phase 0 | Vercel preview |
|---|---|---|---|
| Performance | 52 | **67** | _pending_ |
| Accessibility | 92 | 92 | _pending_ |
| Best Practices | 100 | 100 | _pending_ |
| SEO | 92 | **100** | _pending_ |
| FCP | 1.0 s | 0.9 s | _pending_ |
| LCP | 6.1 s | **3.9 s** | _pending_ |
| TBT | 1,080 ms | 770 ms (460 ms on a prior run — noisy) | _pending_ |
| CLS | 0.022 | 0.018 | _pending_ |
| Speed Index | 4.9 s | 4.2 s | _pending_ |
| Total byte weight | 1,247 KiB | **381 KiB** | _pending_ |

## After Phase 2 — local production build, 11 October 2026

| Metric | Before (live) | Phase 0 | Phase 2 |
|---|---|---|---|
| Performance | 52 | 67 | **80** |
| Accessibility | 92 | 92 | **96** |
| Best Practices | 100 | 100 | 100 |
| SEO | 92 | 100 | 100 |
| FCP | 1.0 s | 0.9 s | 1.5 s |
| LCP | 6.1 s | 3.9 s | **4.2 s** |
| TBT | 1,080 ms | 770 ms | **230 ms** |
| CLS | 0.022 | 0.018 | **0.002** |
| Speed Index | 4.9 s | 4.2 s | 3.7 s |
| Total byte weight | 1,247 KiB | 381 KiB | 507 KiB |

Remaining failing binary audits — `color-contrast` and `svg-img-alt` — are in legacy section
markup (hero availability badge, hero terminal) that Phases 3–7 rebuild. Preview column still
blocked by Vercel Authentication (see above).

## After Phase 3 — local production build, 11 October 2026

| Metric | Phase 2 | Phase 3 (simulated) | Phase 3 (devtools throttling) |
|---|---|---|---|
| Performance | 80 | 81 | 82 |
| Accessibility | 96 | 96 | — |
| FCP | 1.5 s | 1.4 s | 2.1 s |
| LCP | 4.2 s | 4.7 s * | **2.1 s (= FCP)** |
| TBT | 230 ms | 140 ms | 470 ms |
| CLS | 0.002 | **0.003** (glow fixed from 0.067) | 0 |
| Speed Index | 3.7 s | 2.6 s | 4.6 s |

LCP element is now `h1#hero-heading` (PerformanceObserver: 220–240 ms, 75,400 px², CLS 0 in
both themes). \* Simulated LCP is inflated on localhost: every JS chunk arrives before the observed
LCP (399 ms), so Lighthouse's lantern model counts all JS as an LCP dependency. Real throttling
shows the headline painting at first paint. The remaining score gap is TBT / Speed Index from the
legacy client sections (About, Projects, Skills, Contact) — Phases 6–7 and 9.

Also verified: reduced motion → no intro, no covers, marquee static, `h1` opacity 1; proof strip
screen-reader text carries the final values (249 · 829 · 59 · 82 · 11 · 336); hero overflow
0/16 widths in both themes (remaining 8 failures are the legacy About block, 6 px at ≤600 px).

Two hidden costs surfaced by the byte-weight audit and fixed in Phase 0: `next/link` was
prefetching the 561 KB résumé PDF as an RSC payload on every page load (now plain `<a>`
links), and `preview.png` (409 KB) loaded as a CSS background (now a 32 KB WebP).

Remaining Phase 0 gap to the ≥95 target is JavaScript execution — main-thread work 3.9 s,
bootup 1.7 s — which is the Phase 2 (server-first shell) and Phase 9 work.

## Per-phase JS budget log

| Phase | `/` first-load JS (gzip) | Note |
|---|---|---|
| Before | 541.3 KB | — |
| 0 | 304.6 KB | WebGL and duplicate animation runtime removed |
| 1 | 306.9 KB (+2.3) | `next-themes` provider + toggle; CSS 18.5 KB gz. `/styleguide` 273.9 KB |
| 2 | 354.9 KB (+48.0) | **Over the 10 KB rule — reason:** the shell's interaction features are genuinely new code: Radix Dialog for the mobile menu (7.7 KB), motion scroll/spring/presence modules for header hide, scroll rail and back-to-top (≈26 KB across two chunks), `next/dynamic` + Suspense runtime for the lazy palette/cursor, intro and template islands (≈15 KB). The command palette (cmdk) and custom cursor are **not** in the initial bundle — verified: one chunk loads on first Ctrl+K, cursor chunk only on desktop fine-pointer. The ≤130 KB target is Phase 9 work: `LazyMotion`/`m` to drop the full motion feature set, and the legacy client sections (hero terminal, skills, about cards) being rebuilt as server components in Phases 3–7. `/styleguide` 264.6 KB |
