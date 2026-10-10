"use client";

import { motion } from "motion/react";
import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

interface Technology {
  name: string;
  icon: IconType | LucideIcon;
  color: string;
}

interface SkillCardProps {
  title: string;
  icon: LucideIcon;
  backgroundIcon: IconType;
  level: string;
  technologies: Technology[];
}

export default function SkillCard({
  title,
  icon: Icon,
  backgroundIcon: BackgroundIcon,
  level,
  technologies,
}: SkillCardProps) {
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
      whileHover={{
        y: -8,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-7
        backdrop-blur-2xl
        transition-all
        hover:border-violet-500/30
        hover:shadow-[0_25px_70px_rgba(139,92,246,.15)]
      "
    >
      {/* Glass Reflection */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-white/10
          via-transparent
          to-transparent
        "
      />

      {/* Background Icon */}

      <BackgroundIcon
        size={120}
        className="
          pointer-events-none
          absolute
          -right-6
          -top-6
          text-white/5
          transition-transform
          duration-500
          group-hover:scale-110
          group-hover:rotate-6
        "
      />

      {/* Header */}

      <div className="relative flex items-start justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-violet-500/10
                text-violet-400
              "
            >
              <Icon size={22} />
            </div>

            <div>

              <h3 className="text-xl font-bold">
                {title}
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Technology Stack
              </p>

            </div>

          </div>

        </div>

        {/* Expertise */}

        <span
          className="
            rounded-full
            border
            border-violet-500/20
            bg-violet-600/10
            px-3
            py-1
            text-xs
            font-semibold
            text-violet-400
            hover:text-violet-600
          "
        >
          {level}
        </span>

      </div>

      {/* Technologies */}

      <div className="relative mt-8 flex flex-wrap gap-3">

        {technologies.map((tech, index) => {
          const TechIcon = tech.icon;

          return (
            <motion.div
              key={tech.name}
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                y: -3,
                scale: 1.05,
              }}
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-violet-100
                bg-white/5
                px-3.5
                py-2
                backdrop-blur-xl
                transition-all
                hover:border-violet-500/40
                hover:bg-violet-500/10
                hover:shadow-[0_0_20px_rgba(139,92,246,.18)]
              "
            >
              <TechIcon
                size={16}
                style={{
                  color: tech.color,
                }}
                className="
                  transition-transform
                  duration-300
                  group-hover:rotate-6
                "
              />

              <span className="text-sm font-medium text-zinc-500">
                {tech.name}
              </span>

            </motion.div>
          );
        })}

      </div>
    </motion.div>
  );
}