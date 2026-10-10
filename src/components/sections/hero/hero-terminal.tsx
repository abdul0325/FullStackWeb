"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";

const logs = [
  "Edge Runtime initialized",
  "Server Components enabled",
  "PostgreSQL connected",
  "Redis Cache warmed",
  "Vector Search loaded",
  "AI Orchestrator online",
  "Queue Workers healthy",
  "Monitoring active",
  "CI/CD Pipeline verified",
  "Zero Downtime Deploy ready",
];

export default function HeroTerminal() {
  const [visibleLogs, setVisibleLogs] = useState(0);

  useEffect(() => {
    let current = 0;

    const timer = setInterval(() => {
      current++;
      setVisibleLogs(current);

      if (current >= logs.length) {
        clearInterval(timer);
      }
    }, 180);

    return () => clearInterval(timer);
  }, []);

  const renderedLogs = useMemo(
    () => logs.slice(0, visibleLogs),
    [visibleLogs]
  );

  return (
    <motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7 }}
  className="
    relative
    w-full
    max-w-xl
    overflow-hidden
    rounded-3xl
    border
    border-white/15
    bg-zinc-950/80
    shadow-[0_20px_80px_rgba(0,0,0,.45)]
    backdrop-blur-2xl
ring-1 ring-white/5
    before:absolute
    before:inset-0
    before:bg-gradient-to-br
    before:from-white/10
    before:via-white/5
    before:to-transparent
    before:pointer-events-none
  "
>
      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/15 px-5 py-3">

        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        <span className="font-mono text-[11px] tracking-wider text-zinc-300 uppercase">
          portfolio.production
        </span>

        <Circle className="h-3 w-3 fill-emerald-400 text-emerald-400" />

      </div>

      {/* Body */}

      <div className="bg-gradient-to-b from-[#09090B] to-[#050507] p-5 font-mono">

        {/* Command */}

        <div className="mb-4 text-[13px] text-cyan-400">
          $ deploy --production
        </div>

        {/* Logs */}

        <div className="space-y-1.5">

          {renderedLogs.map((log) => (
            <motion.div
              key={log}
              initial={{
                opacity: 0,
                x: -6,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.18,
              }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />

              <span className="text-[13px] leading-5 text-zinc-300">
                {log}
              </span>
            </motion.div>
          ))}

        </div>

        {/* Status */}

        {visibleLogs === logs.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 border-t border-white/15 pt-4"
          >
            <div className="flex items-center justify-between">

              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                STATUS
              </span>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-sm font-semibold tracking-wide text-emerald-400">
                  READY
                </span>

              </div>

            </div>

            <div className="mt-3 flex items-center font-mono">

              <span className="text-cyan-400">$</span>

              <motion.span
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                }}
                className="ml-2 text-white"
              >
                █
              </motion.span>

            </div>

          </motion.div>
        )}

      </div>
    </motion.div>
  );
}