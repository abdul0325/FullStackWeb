"use client";

import { motion } from "framer-motion";

import SkillCard from "./skill-card";
import { skillCategories } from "./skills-data";

export default function SkillsGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {skillCategories.map((category) => (
        <motion.div
          key={category.title}
          variants={{
            hidden: {
              opacity: 0,
              y: 40,
            },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
              },
            },
          }}
        >
          <SkillCard
            title={category.title}
            icon={category.icon}
            backgroundIcon={category.backgroundIcon}
            level={category.level}
            technologies={category.technologies}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}