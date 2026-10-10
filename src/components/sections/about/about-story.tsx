"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const builds = [
  "Scalable SaaS Platforms",
  "AI-Powered Applications",
  "RESTful & GraphQL APIs",
  "Enterprise Backend Systems",
  "Admin Dashboards",
  "Authentication & Authorization",
];

export default function AboutStory() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-center"
    >
      {/* Heading */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
          My Journey
        </span>

        <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900">
          Building modern software with{" "}
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            purpose
          </span>
          .
        </h3>
      </div>

      {/* Story */}
      <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-600">
        <p>
          I enjoy building{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">scalable software</span>{" "}
          that combines intuitive user experiences with{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">robust backend architecture</span>.
          Every application I develop is designed with{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            performance, maintainability, and long-term scalability
          </span>{" "}
          in mind.
        </p>

        <p>
          Over the past two years, I&apos;ve built{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">full stack SaaS platforms</span>,{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">AI-powered applications</span>,{" "}
          REST APIs, authentication systems, and cloud deployments using modern technologies 
          across the JavaScript and Python ecosystems.
        </p>

        <p>
          My focus is writing{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">clean, production-ready code</span>{" "}
          while creating solutions that are{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            reliable, efficient, and enjoyable to use
          </span>
          .
        </p>
      </div>

      {/* Divider */}
      <div className="my-10 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      {/* What I Build */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
          What I Build
        </span>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {builds.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="
                group
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-zinc-100
                bg-white
                px-5
                py-4
                shadow-sm
                transition-all
                hover:border-violet-200
                hover:shadow-md
                hover:-translate-x-1
              "
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <span className="font-medium text-zinc-800">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}