"use client";

// Client island: first-visit intro. Keeps the scramble effect, drops every
// liability the old loader had:
//   - the overlay is server-rendered and shown before first paint by an
//     inline flag (`html[data-intro]`, set in app/(site)/layout.tsx) — so there
//     is no content→overlay flash, and content is in the DOM underneath for
//     LCP and crawlers;
//   - capped at 1.2 s, skippable on any key / click / tap / scroll;
//   - once per session; never under reduced motion;
//   - exit is opacity + 2% scale only.

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

import { site } from "@/data/site";
import { duration, ease } from "@/lib/motion";

const NAME = site.name.toUpperCase();
const CHARS = "!<>-_\\/[]{}=+*^?#";
const HARD_CAP_MS = 1200;
const SESSION_KEY = "intro-seen";
const STATUS = ["linking design system", "resolving assets", "ready"];

/** Inline script for the layout: decides before paint whether the intro shows. */
export const INTRO_FLAG_SCRIPT =
  `try{if(!sessionStorage.getItem("${SESSION_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-intro","")}}catch(e){}`;

function useScramble(target: string, active: boolean, durationMs = 900) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!active) return;
    const totalFrames = 24;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const reveal = Math.floor((frame / totalFrames) * target.length);
      setDisplay(
        target
          .split("")
          .map((ch, i) => (ch === " " ? " " : i < reveal ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join("")
      );
      if (frame >= totalFrames) window.clearInterval(id);
    }, durationMs / totalFrames);
    return () => window.clearInterval(id);
  }, [active, target, durationMs]);

  return display;
}

const noopSubscribe = () => () => {};
// Read once per page load so the session flag written during the intro does
// not flip the answer mid-render.
let flagged: boolean | null = null;
const readFlag = () => (flagged ??= document.documentElement.hasAttribute("data-intro"));

export function IntroLoader() {
  // Server snapshot `true` → the overlay is in the SSR HTML (hidden by CSS
  // unless html[data-intro] is set). Client snapshot → the pre-paint decision.
  const shouldShow = useSyncExternalStore(noopSubscribe, readFlag, () => true);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(0);
  const open = shouldShow && !dismissed;

  useEffect(() => {
    if (!hydrated || !open) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    const dismiss = () => setDismissed(true);
    // The cap is measured from navigation start, not from hydration, so the
    // intro never holds the page beyond HARD_CAP_MS however long JS took.
    const elapsed = typeof performance !== "undefined" ? performance.now() : 0;
    const remaining = Math.max(250, HARD_CAP_MS - elapsed);
    const cap = window.setTimeout(dismiss, remaining);
    const s1 = window.setTimeout(() => setStep(1), remaining / 3);
    const s2 = window.setTimeout(() => setStep(2), (remaining * 2) / 3);

    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("keydown", dismiss, opts);
    window.addEventListener("pointerdown", dismiss, opts);
    window.addEventListener("wheel", dismiss, opts);
    window.addEventListener("touchstart", dismiss, opts);

    return () => {
      window.clearTimeout(cap);
      window.clearTimeout(s1);
      window.clearTimeout(s2);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [hydrated, open]);

  // Once dismissed, drop the flag so the CSS fallback cannot re-show it.
  useEffect(() => {
    if (dismissed) document.documentElement.removeAttribute("data-intro");
  }, [dismissed]);

  const scrambled = useScramble(NAME, hydrated && open);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="intro"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          initial={false}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: ease.out }}
          // Hidden until the inline flag is present — the flag is set before
          // first paint, so a first visit sees this immediately.
          className="fixed inset-0 z-[80] hidden flex-col items-center justify-center gap-6 bg-bg px-6 text-fg [[data-intro]_&]:flex"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <p className="font-mono text-[clamp(1.25rem,1rem+2vw,2rem)] font-bold tracking-[0.18em] text-fg">
            {scrambled}
          </p>
          <div className="flex h-5 items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
            <span className="text-brand">$</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={step}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: duration.fast }}
              >
                {STATUS[step]}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="h-px w-40 overflow-hidden rounded-full bg-line">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: hydrated ? 1 : 0 }}
              transition={{ duration: HARD_CAP_MS / 1000, ease: "linear" }}
              className="h-full w-full origin-left bg-brand"
            />
          </div>
          <p className="absolute bottom-6 text-xs text-fg-faint">press any key to skip</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
