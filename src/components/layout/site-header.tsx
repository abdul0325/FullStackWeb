"use client";

// Client island (hide-on-scroll-down needs scroll state). Everything inside
// that can be static is: Logo is a server component passed through; the nav
// islands own their own state. Sticky, blurred — one of the two surfaces
// allowed backdrop-blur (§3.4).

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState, type ReactNode } from "react";
import { Command } from "lucide-react";

import { NavDesktop } from "@/components/layout/nav/nav-desktop";
import { NavMobile } from "@/components/layout/nav/nav-mobile";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SiteHeader({ logo, onOpenPalette }: { logo: ReactNode; onOpenPalette?: () => void }) {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const nextHidden = latest > previous && latest > 160;
    if (nextHidden !== hidden) setHidden(nextHidden);
    const nextScrolled = latest > 8;
    if (nextScrolled !== scrolled) setScrolled(nextScrolled);
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: reduce ? 0 : duration.base, ease: ease.inOut }}
      className="fixed inset-x-0 top-0 z-50"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className={cn(
          "mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 md:px-8 lg:px-12",
          "transition-[background-color,border-color] duration-base ease-out-expo",
          "border-b",
          scrolled
            ? "border-line bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70"
            : "border-transparent bg-transparent"
        )}
      >
        {logo}

        <NavDesktop />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenPalette ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open command palette"
              title="Command palette (⌘K)"
              onClick={onOpenPalette}
              className="hidden lg:inline-flex"
            >
              <Command aria-hidden="true" className="size-[18px]" />
            </Button>
          ) : null}
          <ThemeToggle className="hidden lg:inline-flex" />
          <Button asChild variant="secondary" size="sm" className="hidden lg:inline-flex">
            <a href={site.resumePdf} target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
          </Button>
          <ThemeToggle className="lg:hidden" />
          <NavMobile />
        </div>
      </div>
    </motion.header>
  );
}
