"use client";

import { motion } from "framer-motion";

export default function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl text-center"
    >
      {/* Section Label */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 backdrop-blur-xl"
      >
        <span className="h-2 w-2 rounded-full bg-violet-400" />

        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
          About Me
        </span>
      </motion.div>

      {/* Heading */}

      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          duration: 0.6,
        }}
        className="
          mt-8
          text-4xl
          font-black
          leading-tight
          tracking-tight

          sm:text-5xl
          lg:text-6xl
        "
      >
        Building{" "}
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          software
        </span>{" "}
        that scales.
      </motion.h2>

      {/* Description */}

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.35,
          duration: 0.6,
        }}
        className="
          mx-auto
          mt-6
          max-w-2xl
          text-lg
          leading-8
          text-muted-foreground

          md:text-xl
        "
      >
        I specialize in designing modern full stack applications,
        AI-powered products, and production-ready backend systems
        focused on performance, scalability, and maintainability.
      </motion.p>
    </motion.div>
  );
}