"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import BrowserFrame from "./browser-frame";
import type { Project } from "./project-data";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={project.url} className="block group">
      <motion.article
        whileHover={{ y: -10 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="
          relative overflow-hidden rounded-3xl border border-zinc-100 
          bg-white shadow-lg shadow-zinc-200/70
          hover:shadow-xl hover:shadow-violet-500/10
          transition-all duration-500
        "
      >
        {/* Ice Gradient Border */}
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-cyan-400/25 via-violet-400/25 to-fuchsia-400/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />

        <div className="relative z-10 p-2 lg:p-3">
          {/* Browser Mockup */}
          <div className="overflow-hidden rounded-2xl border border-zinc-100">
            <BrowserFrame
              image={project.image}
              title={project.title}
              url={project.url}
            />
          </div>

          {/* Content */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="inline-block rounded-full bg-gradient-to-r from-cyan-100 to-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[2px] text-violet-600 border border-violet-200">
                {project.category}
              </span>

              <motion.div
                whileHover={{ rotate: 45, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 transition-all group-hover:border-cyan-400 group-hover:text-cyan-600"
              >
                <ArrowUpRight size={20} />
              </motion.div>
            </div>

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
              {project.title}
            </h3>

            <p className="mt-3 h-[72px] overflow-hidden text-sm leading-6 text-zinc-600">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="
                    rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 
                    text-xs font-medium text-zinc-700 
                    hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700
                    transition-all duration-200
                  "
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-7 flex items-center justify-between border-t border-zinc-100 pt-5 text-sm">
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Production Ready</span>
              </div>

              <div className="flex items-center gap-1.5 font-medium text-violet-600 group-hover:text-cyan-600 transition-colors">
                View Project
                <motion.div whileHover={{ rotate: 45 }} transition={{ duration: 0.2 }}>
                  <ArrowUpRight size={17} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}