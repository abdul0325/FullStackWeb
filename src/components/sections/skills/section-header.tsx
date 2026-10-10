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
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl text-center"
    >
      <span
        className="
          text-sm
          font-semibold
          uppercase
          tracking-[0.35em]
          text-violet-400
        "
      >
        Skills & Technologies
      </span>

      <h2
        className="
          mt-5
          text-4xl
          font-black
          leading-tight
          tracking-tight
          md:text-5xl
        "
      >
        Building reliable software
        <br />

        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          with modern technologies.
        </span>
      </h2>

      <p
        className="
          mx-auto
          mt-7
          max-w-2xl
          text-lg
          leading-8
          text-muted-foreground
        "
      >
        A curated toolkit of frontend, backend, cloud, AI, and
        development technologies used to build production-ready
        applications that are scalable, maintainable, and performant.
      </p>
    </motion.div>
  );
}