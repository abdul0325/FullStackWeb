"use client";

import { motion } from "motion/react";

export default function SectionHeader() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.6,
      }}
      className="mx-auto max-w-3xl text-center"
    >
      {/* Badge */}

      <div
        className="
          inline-flex
          items-center
          rounded-full
          border
          border-violet-500/20
          bg-violet-500/10
          px-4
          py-2
          backdrop-blur-xl
        "
      >
        <span
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.28em]
            text-violet-300
          "
        >
          Featured Projects
        </span>
      </div>

      {/* Heading */}

      <h2
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
        Building products,

        <br />

        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          not just applications.
        </span>
      </h2>

      {/* Description */}

      <p
        className="
          mx-auto
          mt-8
          max-w-2xl
          text-base
          leading-8
          text-muted-foreground

          sm:text-lg
        "
      >
        A selection of production-ready full stack applications,
        AI-powered systems, scalable backend architectures,
        and modern web platforms built with performance,
        maintainability, and exceptional user experience in mind.
      </p>
    </motion.div>
  );
}