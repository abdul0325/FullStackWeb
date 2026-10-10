"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

import SectionHeader from "./section-header";
import SkillsGrid from "./skills-grid";

export default function Skills() {
  return (
    <Section
      id="skills"
      className="relative overflow-hidden py-10 lg:py-15"
    >
      {/* Purple Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-24
          h-[520px]
          w-[520px]
          rounded-full
          bg-violet-500/15
          blur-[180px]
        "
      />

      {/* Blue Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-16
          h-[520px]
          w-[520px]
          rounded-full
          bg-cyan-500/10
          blur-[180px]
        "
      />

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

        <SectionHeader />

        <SkillsGrid />

      </Container>
    </Section>
  );
}