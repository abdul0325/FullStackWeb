"use client";

import { motion } from "motion/react";
import {
  Server,
  Monitor,
  Cloud,
  BrainCircuit,
} from "lucide-react";

const expertise = [
  {
    title: "Backend",
    icon: Server,
    color: "text-violet-400",
    skills: [
      "NestJS",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Redis",
    ],
  },
  {
    title: "Frontend",
    icon: Monitor,
    color: "text-cyan-400",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    title: "Cloud",
    icon: Cloud,
    color: "text-sky-400",
    skills: [
      "Docker",
      "AWS",
      "CI/CD",
      "Linux",
      "GitHub Actions",
    ],
  },
  {
    title: "AI",
    icon: BrainCircuit,
    color: "text-fuchsia-400",
    skills: [
      "OpenAI",
      "LangChain",
      "RAG",
      "Vector Search",
      "FastAPI",
    ],
  },
];

export default function ExpertiseGrid() {
  return (
    <section className="mt-15">

      {/* Heading */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
          Expertise
        </p>

        <h3 className="mt-3 text-3xl font-bold">
          Technologies I work with daily
        </h3>
      </motion.div>

      {/* Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {expertise.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
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
              }}
              transition={{
                delay: index * .1,
              }}
              whileHover={{
                y: -8,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-violet-100
                bg-white/5
                p-4
                backdrop-blur-2xl
                transition-all
                hover:border-violet-500/30
                hover:shadow-[0_20px_60px_rgba(139,92,246,.15)]
              "
            >

              {/* Reflection */}

              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60" />

              {/* Header */}

              <div className="relative flex items-center gap-4">

                <div
                  className="
                    rounded-2xl
                    bg-white/5
                    p-3
                  "
                >
                  <Icon
                    className={`${item.color} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                    size={24}
                  />
                </div>

                <h4 className="text-xl font-semibold">
                  {item.title}
                </h4>

              </div>

              {/* Divider */}

              <div className="my-6 h-px bg-white/10" />

              {/* Skills */}

              <div className="space-y-3">

                {item.skills.map((skill, i) => (

                  <motion.div
                    key={skill}
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: .15 + i * .05,
                    }}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-zinc-400">
                      {skill}
                    </span>

                  </motion.div>

                ))}

              </div>

            </motion.div>
          );
        })}

      </div>

    </section>
  );
}