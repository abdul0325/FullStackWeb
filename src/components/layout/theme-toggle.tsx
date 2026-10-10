"use client";

// Client island: reads the theme from next-themes and toggles it.

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const noopSubscribe = () => () => {};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  // Theme is unknown on the server; render a neutral placeholder until mounted
  // so the icon never mismatches during hydration. useSyncExternalStore gives
  // `false` on the server snapshot and `true` on the client, without an effect.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted
    ? `Switch to ${isDark ? "light" : "dark"} theme`
    : "Toggle theme";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={mounted ? isDark : undefined}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center rounded-md",
        "border border-line bg-bg-subtle text-fg-muted",
        "transition-[background-color,border-color,color,transform] duration-fast ease-out-expo",
        "hoverable:hover:border-line-strong hoverable:hover:text-fg",
        "active:translate-y-px active:bg-bg-inset",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {/* Both icons are always rendered; opacity + rotate cross-fade (transform/opacity only) */}
      <Sun
        aria-hidden="true"
        className={cn(
          "absolute size-[18px] transition-[opacity,transform] duration-base ease-out-expo",
          isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "absolute size-[18px] transition-[opacity,transform] duration-base ease-out-expo",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        )}
      />
    </button>
  );
}
