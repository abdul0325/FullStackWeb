"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

import { SectionHeader } from "@/components/ui/section-header";
import ProjectGrid from "./project-grid";

export default function Projects() {
  
  return (
    <Section
  id="projects"
  className="relative overflow-hidden py-20 lg:py-16"
>
  {/* Purple Glow */}

  <div
    className="
      pointer-events-none
      absolute
      -left-32
      top-32
      h-[420px]
      w-[420px]
      rounded-full
      bg-violet-500/15
      blur-[160px]
    "
  />

  {/* Blue Glow */}

  <div
    className="
      pointer-events-none
      absolute
      -right-32
      bottom-16
      h-[420px]
      w-[420px]
      rounded-full
      bg-cyan-500/10
      blur-[160px]
    "
  />

  {/* Glass Blur */}

  <div
    className="
      absolute
      inset-0
      bg-[radial-gradient(circle_at_top,rgba(255,255,255,.03),transparent_65%)]
      pointer-events-none
    "
  />

  <Container className="relative z-10 space-y-24">
    <SectionHeader
          eyebrow="Featured Projects"
          title="Building products, not just applications."
          lede="A selection of production-ready full stack applications, AI-powered systems, scalable backend architectures, and modern web platforms built with performance, maintainability, and exceptional user experience in mind."
          align="center"
        />
    <ProjectGrid />
  </Container>
</Section>
  );
}