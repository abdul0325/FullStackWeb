"use client";

// Client island, lazy-loaded from the site shell. Desktop fine-pointer only
// (hover + pointer:fine + ≥1024px), off under reduced motion, hidden on blur
// and when the pointer leaves the window. The native cursor is never hidden
// on form fields or links — `cursor: none` is scoped to body only when active.
// Dot tracks with no delay; ring follows on a spring. Transform only, in its
// own compositor layer, pointer-events none.

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { useIsDesktopPointer } from "@/hooks/use-media-query";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, summary, label, [data-cursor='interactive']";
const TEXT = "p, h1, h2, h3, h4, li, blockquote, code, [data-cursor='text']";

type Mode = "default" | "interactive" | "text";

export function CustomCursor() {
  const desktop = useIsDesktopPointer();
  const reduce = useReducedMotion();
  const enabled = desktop && !reduce;
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.dataset.customCursor = "on";

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      const t = e.target as Element | null;
      if (!t) return;
      if (t.closest(INTERACTIVE)) setMode("interactive");
      else if (t.closest(TEXT)) setMode("text");
      else setMode("default");
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onBlur = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    window.addEventListener("blur", onBlur);

    return () => {
      delete document.documentElement.dataset.customCursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("blur", onBlur);
    };
    // `visible` intentionally excluded: listeners are stable for the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, x, y]);

  if (!enabled) return null;

  // Transform + opacity only: the ring scales (28px base → 44px over
  // interactive targets), and a separate caret bar cross-fades in over text.
  const ringScale = (mode === "interactive" ? 44 / 28 : 1) * (pressed ? 0.85 : 1);
  const spring = { type: "spring", stiffness: 420, damping: 32, mass: 0.6 } as const;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      {/* Ring — spring follow */}
      <motion.div
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: ringScale, opacity: visible && mode !== "text" ? 0.9 : 0 }}
        transition={spring}
        className="absolute left-0 top-0 size-7 rounded-full border border-brand"
      />
      {/* Caret bar — over text */}
      <motion.div
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && mode === "text" ? 0.6 : 0, scaleY: pressed ? 0.85 : 1 }}
        transition={spring}
        className="absolute left-0 top-0 h-7 w-0.5 rounded-sm bg-brand"
      />
      {/* Dot — no delay */}
      <motion.div
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && mode !== "text" ? 1 : 0, scale: pressed ? 0.7 : 1 }}
        transition={{ duration: 0.12 }}
        className="absolute left-0 top-0 size-1.5 rounded-full bg-brand"
      />
    </div>
  );
}
