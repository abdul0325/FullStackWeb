"use client";

import { motion } from "framer-motion";
import { techStack } from "@/data/tech-stack";
import TechBadge from "@/components/ui/tech-badge";

export default function HeroBadges() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="
        grid
        grid-cols-2
        gap-3
        sm:flex
        sm:flex-wrap
      "
    >
      {techStack.map(({ icon: Icon, title, color, skills }, index) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6 + index * 0.05,
          }}
          className="flex items-center justify-center"
        >
          <TechBadge
  index={index}
  total={techStack.length}
  title={title}
  icon={Icon}
  color={color}
  skills={skills}
/>
        </motion.div>
      ))}
    </motion.div>
  );
}