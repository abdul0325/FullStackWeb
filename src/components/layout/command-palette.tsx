"use client";

// Client island, lazy-loaded by SiteShell on first ⌘K / Ctrl+K or button
// press. cmdk inside a Radix Dialog: role=dialog, focus trap, Escape, focus
// return. Jump to sections and routes, toggle theme, copy email, open CV
// and socials. Transform + opacity animation only.

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Copy,
  Download,
  FileText,
  Hash,
  Moon,
  Palette,
  Search,
  Sun,
} from "lucide-react";

import { navigation } from "@/data/navigation";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const close = () => onOpenChange(false);

  function go(href: string) {
    close();
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else router.push("/" + href);
    } else {
      router.push(href);
    }
  }

  function external(href: string) {
    close();
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  const isDark = resolvedTheme === "dark";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[65] bg-bg/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "motion-reduce:animate-none"
          )}
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed left-1/2 top-[12vh] z-[66] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2",
            "overflow-hidden rounded-xl border border-line-strong bg-bg-overlay text-fg shadow-popover",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "motion-reduce:animate-none"
          )}
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <Command label="Command palette" loop className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search aria-hidden="true" className="size-4 shrink-0 text-fg-subtle" />
              <Command.Input
                autoFocus
                placeholder="Jump to, toggle, copy…"
                className="h-12 w-full bg-transparent text-base text-fg outline-none placeholder:text-fg-subtle"
              />
              <kbd className="hidden rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[0.6875rem] text-fg-subtle sm:inline">
                esc
              </kbd>
            </div>

            <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2">
              <Command.Empty className="px-3 py-8 text-center text-sm text-fg-subtle">No results.</Command.Empty>

              <Command.Group heading="Sections" className={groupClass}>
                {navigation.map((item) => (
                  <Command.Item key={item.href} value={`section ${item.title}`} onSelect={() => go(item.href)} className={itemClass}>
                    <Hash aria-hidden="true" className="size-4 text-fg-subtle" />
                    {item.title}
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Pages" className={groupClass}>
                <Command.Item value="page styleguide design system" onSelect={() => go("/styleguide")} className={itemClass}>
                  <Palette aria-hidden="true" className="size-4 text-fg-subtle" />
                  Styleguide
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Actions" className={groupClass}>
                <Command.Item
                  value="theme toggle dark light"
                  onSelect={() => {
                    setTheme(isDark ? "light" : "dark");
                    close();
                  }}
                  className={itemClass}
                >
                  {isDark ? <Sun aria-hidden="true" className="size-4 text-fg-subtle" /> : <Moon aria-hidden="true" className="size-4 text-fg-subtle" />}
                  Switch to {isDark ? "light" : "dark"} theme
                </Command.Item>
                <Command.Item value="copy email address" onSelect={copyEmail} className={itemClass}>
                  <Copy aria-hidden="true" className="size-4 text-fg-subtle" />
                  {copied ? "Copied!" : `Copy email — ${site.email}`}
                </Command.Item>
                <Command.Item value="download cv resume pdf" onSelect={() => external(site.resumePdf)} className={itemClass}>
                  <Download aria-hidden="true" className="size-4 text-fg-subtle" />
                  Download CV (PDF)
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Elsewhere" className={groupClass}>
                <Command.Item value="github" onSelect={() => external(site.socials.github)} className={itemClass}>
                  <ArrowUpRight aria-hidden="true" className="size-4 text-fg-subtle" />
                  GitHub
                </Command.Item>
                <Command.Item value="linkedin" onSelect={() => external(site.socials.linkedin)} className={itemClass}>
                  <ArrowUpRight aria-hidden="true" className="size-4 text-fg-subtle" />
                  LinkedIn
                </Command.Item>
                <Command.Item value="email mail contact" onSelect={() => external(`mailto:${site.email}`)} className={itemClass}>
                  <FileText aria-hidden="true" className="size-4 text-fg-subtle" />
                  Email me
                </Command.Item>
              </Command.Group>
            </Command.List>

            <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[0.6875rem] text-fg-subtle">
              <span>↑↓ navigate · ↵ select</span>
              <span>⌘K</span>
            </div>
          </Command>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Email copied to clipboard" : ""}
          </span>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const groupClass =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.6875rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-fg-subtle";

const itemClass = cn(
  "flex cursor-default select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm text-fg-muted",
  "data-[selected=true]:bg-bg-subtle data-[selected=true]:text-fg",
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
);
