"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import AboutCard from "./about-card";
import { SectionHeader } from "@/components/ui/section-header";
import AboutStory from "./about-story";
import ExpertiseGrid from "./expertise-grid";
import AboutStats from "./about-stats";

export default function About() {
    return (
        <Section id="about" className="relative py-0 lg:py-2">
            <Container>
                <SectionHeader
          eyebrow="About"
          title="Building software that scales."
          lede="I specialize in designing modern full stack applications, AI-powered products, and production-ready backend systems focused on performance, scalability, and maintainability."
          align="center"
        />

                <div className="mt-20 grid gap-12 lg:grid-cols-[380px_1fr]">
                    <AboutCard />
                    <AboutStory />
                </div>
                <ExpertiseGrid />
                <AboutStats />
            </Container>
        </Section>
    );
}