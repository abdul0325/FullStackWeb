"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "ABDUL REHMAN";
const CHARS = "!<>-_\\/[]{}—=+*^?#________";
const LOGS = [
  "booting core modules",
  "linking design system",
  "compiling components",
  "resolving assets",
  "optimizing render tree",
  "portfolio ready",
];

function useScramble(target: string, active: boolean, duration = 1400) {
  const [display, setDisplay] = useState(target.replace(/[^ ]/g, " "));

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      const revealCount = Math.floor((frame / totalFrames) * target.length);

      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < revealCount) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (frame >= totalFrames) clearInterval(interval);
    }, duration / totalFrames);

    return () => clearInterval(interval);
  }, [active, target, duration]);

  return display;
}

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const scrambled = useScramble(NAME, true);

  useEffect(() => {
    const start = Date.now();
    const durationMs = 2600;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);
      setLogIndex(Math.min(LOGS.length - 1, Math.floor((pct / 100) * LOGS.length)));
      if (pct < 100) requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* HUD Ring */}
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-zinc-800"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>

          {/* Outer spinning ticks */}
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute h-[168px] w-[168px]"
            viewBox="0 0 168 168"
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i / 24) * 360;
              const major = i % 6 === 0;
              return (
                <line
                  key={i}
                  x1="84"
                  y1={major ? "4" : "8"}
                  x2="84"
                  y2="14"
                  stroke={major ? "#22d3ee" : "#3f3f46"}
                  strokeWidth={major ? 1.5 : 1}
                  transform={`rotate(${angle} 84 84)`}
                />
              );
            })}
          </motion.svg>

          {/* Percentage */}
          <div className="flex flex-col items-center">
            <span className="font-mono text-3xl font-bold tabular-nums text-white">
              {progress}
              <span className="text-cyan-400">%</span>
            </span>
          </div>
        </div>

        {/* Scrambled name */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-mono text-2xl font-bold tracking-[0.15em] text-white sm:text-3xl">
            {scrambled}
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>

        {/* Status log */}
        <div className="flex h-6 items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 uppercase">
          <span className="text-cyan-400">$</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={logIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              {LOGS[logIndex]}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="ml-0.5 text-cyan-400"
              >
                _
              </motion.span>
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Progress bar segments */}
        <div className="flex gap-1">
          {Array.from({ length: 20 }).map((_, i) => {
            const filled = progress >= (i + 1) * 5;
            return (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: filled ? "#22d3ee" : "#27272a",
                  boxShadow: filled ? "0 0 8px #22d3ee" : "none",
                }}
                transition={{ duration: 0.2 }}
                className="h-1.5 w-2 rounded-full"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}