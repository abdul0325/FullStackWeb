"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: 2,
    suffix: "+",
    label: "Years Experience",
  },
  {
    value: 15,
    suffix: "+",
    label: "Projects Built",
  },
  {
    value: 20,
    suffix: "+",
    label: "Core Technologies",
  },
  {
    value: 100,
    suffix: "%",
    label: "Client Satisfaction",
  },
];

export default function AboutStats() {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  return (
    <div
      ref={ref}
      className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            delay: index * 0.12,
          }}
          className="
            rounded-3xl
            border
            border-violet-100
            bg-white/[0.03]
            p-8
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-violet-500/30
            hover:shadow-[0_20px_60px_rgba(139,92,246,.12)]
          "
        >
          <h3 className="text-5xl font-black tracking-tight">
            {inView && (
              <CountUp
                end={item.value}
                duration={2}
              />
            )}
            <span className="text-violet-400">
              {item.suffix}
            </span>
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}