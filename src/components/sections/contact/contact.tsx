"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/section-header";
import ContactForm from "./contact-form";
import MapCard from "./map-card";

export default function Contact() {
    return (
        <Section
            id="contact"
            className="relative overflow-hidden py-16 lg:py-24 bg-zinc-50"
        >
            {/* Soft White Glows */}
            <div className="pointer-events-none absolute inset-0">
            </div>

            <Container className="relative z-10 space-y-20">
                <SectionHeader
          eyebrow="Contact"
          title="Ready to build something legendary?"
          lede="From pixel-perfect frontends to robust backend architecture — let’s turn your vision into a high-impact product."
          align="center"
        />

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                    className="
                        overflow-hidden rounded-3xl border border-zinc-100
                        bg-white shadow-2xl shadow-zinc-300/70
                        lg:grid lg:grid-cols-[1fr_520px] relative min-h-[680px]
                    "
                >
                    {/* Premium Border Glow */}
                    <div className="pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-violet-500/20 via-cyan-500/15 to-transparent" />

                    <ContactForm />
                    <MapCard/>
                </motion.div>
            </Container>
        </Section>
    );
}