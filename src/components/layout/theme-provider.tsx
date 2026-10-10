"use client";

// Client island: next-themes needs a context provider and reads localStorage.
// It injects a blocking inline script before first paint, which is what
// prevents a flash of the wrong theme.

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

// Dark is the designed default. It is deliberately "light" until Phase 7: the
// sections still carry hardcoded zinc/white classes and would read broken under
// dark. Flip this one value once the last section is rebuilt.
export const DEFAULT_THEME = "light";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      // Transitions are not disabled: the toggle sets html[data-theme-transition]
      // for one duration.base so colours cross-fade (globals.css), unless the
      // user prefers reduced motion.
    >
      {children}
    </NextThemesProvider>
  );
}
