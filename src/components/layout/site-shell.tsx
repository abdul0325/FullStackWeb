"use client";

// Client island that owns cross-cutting shell state: the command palette
// (lazy — nothing ships until the first ⌘K / Ctrl+K or button press), the
// custom cursor (lazy, desktop-gated inside), the first-visit intro and the
// scroll rail. Page content is server-rendered and passed through as children.

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { IntroLoader } from "@/components/layout/intro-loader";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteHeader } from "@/components/layout/site-header";
import { useIsDesktopPointer } from "@/hooks/use-media-query";

const CommandPalette = dynamic(
  () => import("@/components/layout/command-palette").then((m) => m.CommandPalette),
  { ssr: false }
);

const CustomCursor = dynamic(
  () => import("@/components/layout/custom-cursor").then((m) => m.CustomCursor),
  { ssr: false }
);

export function SiteShell({ logo, children }: { logo: ReactNode; children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Only mount the palette chunk after the first request for it.
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  // The cursor chunk is fetched only on a desktop fine-pointer device.
  const desktopPointer = useIsDesktopPointer();

  const openPalette = useCallback(() => {
    setPaletteLoaded(true);
    setPaletteOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteLoaded(true);
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <IntroLoader />
      <ScrollProgress />
      <SiteHeader logo={logo} onOpenPalette={openPalette} />
      {children}
      {paletteLoaded ? <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} /> : null}
      {desktopPointer ? <CustomCursor /> : null}
    </>
  );
}
