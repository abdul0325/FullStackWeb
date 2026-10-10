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
