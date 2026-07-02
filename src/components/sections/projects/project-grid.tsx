"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { projects } from "./project-data";
import ProjectCard from "./project-card";
import PopButton from "@/components/ui/pop-button";

const INITIAL_COUNT = 4;
const LOAD_COUNT = 2;

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.96,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function ProjectGrid() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const gridRef = useRef<HTMLDivElement>(null);
  const visibleProjects = projects.slice(0, visibleCount);

  return (
    <>
      <motion.div
        ref={gridRef}
        layout
        className="
          grid
          grid-cols-1
          gap-8
          md:grid-cols-2
        "
      >
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                y: -20,
                transition: {
                  duration: 0.25,
                },
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleCount < projects.length && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mt-14 flex justify-center"
        >
        <PopButton
  onClick={() => {
    const previousCount = visibleCount;

    setVisibleCount((prev) =>
      Math.min(prev + LOAD_COUNT, projects.length)
    );

    setTimeout(() => {
      if (!gridRef.current) return;

      const newCard = gridRef.current.children[
        previousCount
      ] as HTMLElement;

      if (!newCard) return;

      const y =
        newCard.getBoundingClientRect().top +
        window.pageYOffset -
        100;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }, 500);
  }}
  className="px-8 py-3 text-sm"
>
  Load More Projects
</PopButton>
        </motion.div>
      )}
    </>
  );
}