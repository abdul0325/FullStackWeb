"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

import { SectionHeader } from "@/components/ui/section-header";
import SkillsGrid from "./skills-grid";

export default function Skills() {
  return (
    <Section
      id="skills"
      className="relative overflow-hidden py-10 lg:py-15"
    >
      {/* Purple Glow */}


      {/* Blue Glow */}


      {/* Glass Reflection */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,.03),transparent_65%)]
        "
      />

      {/* Optional Noise Texture */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.02]
          mix-blend-soft-light
          [background-image:url('/preview.webp')]
        "
      />

      <Container className="relative z-10 space-y-20">

        <SectionHeader
          eyebrow="Skills & Technologies"
          title="Building reliable software with modern technologies."
          lede="A curated toolkit of frontend, backend, cloud, AI, and development technologies used to build production-ready applications that are scalable, maintainable, and performant."
          align="center"
        />

        <SkillsGrid />

      </Container>
    </Section>
  );
}