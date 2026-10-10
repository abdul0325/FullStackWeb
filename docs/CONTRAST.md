# Contrast Matrix

Generated 11 October 2026 from the token values in `src/app/globals.css` (OKLCH → sRGB → WCAG 2.x contrast).
✅ ≥ 4.5:1 (body text) · ◐ ≥ 3:1 (large text, UI boundaries, disabled) · ❌ below 3:1.

Rules: `fg`, `fg-muted`, `fg-subtle` are the only tokens allowed for readable text. `fg-faint` is for disabled controls, watermarks and placeholder glyphs only — never for text the reader must read. `border` is decorative; any control whose boundary is the only affordance (inputs, toggles) uses `border-strong` (≥3:1).

## dark

| token | hex |
|---|---|
| bg | #080a0f |
| bg-subtle | #101319 |
| bg-elevated | #181c23 |
| bg-inset | #040609 |
| fg | #f5f7fa |
| fg-muted | #b4b7bf |
| fg-subtle | #8e929b |
| fg-faint | #686c74 |
| accent | #66b6ff |
| accent-fg | #080a0f |
| success | #52cd86 |
| warning | #f7b83d |
| danger | #ff6a65 |
| border | #252931 |
| border-strong | #5b606c |

| fg  bg | bg | bg-subtle | bg-elevated | bg-inset |
|---|---|---|---|---|
| fg | 18.42 ✅ | 17.35 ✅ | 15.92 ✅ | 18.89 ✅ |
| fg-muted | 9.89 ✅ | 9.31 ✅ | 8.55 ✅ | 10.14 ✅ |
| fg-subtle | 6.36 ✅ | 5.99 ✅ | 5.50 ✅ | 6.52 ✅ |
| fg-faint | 3.75 ◐ | 3.53 ◐ | 3.24 ◐ | 3.84 ◐ |
| accent | 9.18 ✅ | 8.64 ✅ | 7.93 ✅ | 9.41 ✅ |
| success | 9.80 ✅ | 9.23 ✅ | 8.47 ✅ | 10.05 ✅ |
| warning | 11.17 ✅ | 10.52 ✅ | 9.66 ✅ | 11.46 ✅ |
| danger | 7.09 ✅ | 6.68 ✅ | 6.13 ✅ | 7.27 ✅ |

accent-fg on accent: 9.18  | border on bg: 1.36 | border-strong on bg: 3.16 | accent on bg (UI 3:1): 9.18

## light

| token | hex |
|---|---|
| bg | #fdfdff |
| bg-subtle | #f5f7fa |
| bg-elevated | #ffffff |
| bg-inset | #f0f2f5 |
| fg | #0f1218 |
| fg-muted | #44484f |
| fg-subtle | #60636a |
| fg-faint | #7d8086 |
| accent | #0063c4 |
| accent-fg | #fdfdff |
| success | #00793d |
| warning | #9d5900 |
| danger | #c21725 |
| border | #dcdee2 |
| border-strong | #8f9299 |

| fg  bg | bg | bg-subtle | bg-elevated | bg-inset |
|---|---|---|---|---|
| fg | 18.54 ✅ | 17.50 ✅ | 18.81 ✅ | 16.75 ✅ |
| fg-muted | 9.08 ✅ | 8.57 ✅ | 9.21 ✅ | 8.20 ✅ |
| fg-subtle | 5.92 ✅ | 5.58 ✅ | 6.00 ✅ | 5.34 ✅ |
| fg-faint | 3.89 ◐ | 3.67 ◐ | 3.95 ◐ | 3.51 ◐ |
| accent | 5.79 ✅ | 5.47 ✅ | 5.88 ✅ | 5.23 ✅ |
| success | 5.43 ✅ | 5.12 ✅ | 5.51 ✅ | 4.90 ✅ |
| warning | 5.34 ✅ | 5.04 ✅ | 5.42 ✅ | 4.82 ✅ |
| danger | 6.03 ✅ | 5.69 ✅ | 6.12 ✅ | 5.45 ✅ |

accent-fg on accent: 5.79  | border on bg: 1.33 | border-strong on bg: 3.07 | accent on bg (UI 3:1): 5.79
