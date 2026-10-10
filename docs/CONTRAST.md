# Contrast Matrix

Generated 11 October 2026 from the token values in `src/app/globals.css` (OKLCH → sRGB → WCAG 2.x contrast). Dark is an engineered palette in its own right (§3.2.1), not an inversion of light.
✅ ≥ 4.5:1 (body text) · ◐ ≥ 3:1 (large text, UI boundaries, disabled) · ❌ below 3:1.

Rules: `fg`, `fg-muted`, `fg-subtle` are the only tokens allowed for readable text. `fg-faint` is for disabled controls, watermarks and placeholder glyphs only — never for text the reader must read. `border` is decorative; any control whose boundary is the only affordance (inputs, toggles) uses `border-strong` (≥3:1). No pure #000 surface and no pure #fff text exist in either theme.

## dark

| token | hex |
|---|---|
| bg | #090b10 |
| bg-subtle | #11141a |
| bg-elevated | #191d25 |
| bg-overlay | #22262f |
| bg-inset | #05060a |
| fg | #e9ebef |
| fg-muted | #b0b4bc |
| fg-subtle | #8e929b |
| fg-faint | #70747d |
| accent | #63b0fc |
| accent-fg | #090b10 |
| success | #59c886 |
| warning | #edb345 |
| danger | #fe6c66 |
| border | #272b34 |
| border-strong | #5e636f |

| fg  bg | bg | bg-subtle | bg-elevated | bg-overlay | bg-inset |
|---|---|---|---|---|---|
| fg | 16.50 ✅ | 15.49 ✅ | 14.17 ✅ | 12.64 ✅ | 16.95 ✅ |
| fg-muted | 9.49 ✅ | 8.91 ✅ | 8.15 ✅ | 7.27 ✅ | 9.75 ✅ |
| fg-subtle | 6.32 ✅ | 5.94 ✅ | 5.43 ✅ | 4.84 ✅ | 6.50 ✅ |
| fg-faint | 4.23 ◐ | 3.97 ◐ | 3.63 ◐ | 3.24 ◐ | 4.34 ◐ |
| accent | 8.57 ✅ | 8.05 ✅ | 7.36 ✅ | 6.57 ✅ | 8.81 ✅ |
| success | 9.37 ✅ | 8.79 ✅ | 8.04 ✅ | 7.18 ✅ | 9.62 ✅ |
| warning | 10.39 ✅ | 9.75 ✅ | 8.92 ✅ | 7.96 ✅ | 10.67 ✅ |
| danger | 7.06 ✅ | 6.63 ✅ | 6.06 ✅ | 5.41 ✅ | 7.25 ✅ |

accent-fg on accent: 8.57  | border on bg: 1.39 | border-strong on bg: 3.28 | accent on bg (UI 3:1): 8.57

## light

| token | hex |
|---|---|
| bg | #fdfdff |
| bg-subtle | #f5f7fa |
| bg-elevated | #ffffff |
| bg-overlay | #ffffff |
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

| fg  bg | bg | bg-subtle | bg-elevated | bg-overlay | bg-inset |
|---|---|---|---|---|---|
| fg | 18.54 ✅ | 17.50 ✅ | 18.81 ✅ | 18.81 ✅ | 16.75 ✅ |
| fg-muted | 9.08 ✅ | 8.57 ✅ | 9.21 ✅ | 9.21 ✅ | 8.20 ✅ |
| fg-subtle | 5.92 ✅ | 5.58 ✅ | 6.00 ✅ | 6.00 ✅ | 5.34 ✅ |
| fg-faint | 3.89 ◐ | 3.67 ◐ | 3.95 ◐ | 3.95 ◐ | 3.51 ◐ |
| accent | 5.79 ✅ | 5.47 ✅ | 5.88 ✅ | 5.88 ✅ | 5.23 ✅ |
| success | 5.43 ✅ | 5.12 ✅ | 5.51 ✅ | 5.51 ✅ | 4.90 ✅ |
| warning | 5.34 ✅ | 5.04 ✅ | 5.42 ✅ | 5.42 ✅ | 4.82 ✅ |
| danger | 6.03 ✅ | 5.69 ✅ | 6.12 ✅ | 6.12 ✅ | 5.45 ✅ |

accent-fg on accent: 5.79  | border on bg: 1.33 | border-strong on bg: 3.07 | accent on bg (UI 3:1): 5.79
