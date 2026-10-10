"use client";

import { useSyncExternalStore } from "react";

// Subscribes to a media query without an effect + setState pair. Server
// snapshot is `false`, so SSR never assumes a pointer or a wide viewport.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Fine pointer + hover capable + desktop width: the gate for cursor and magnetic effects. */
export function useIsDesktopPointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
}
