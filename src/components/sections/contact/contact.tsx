"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { motion } from "motion/react";
import SectionHeader from "./section-header";
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
                <div className="absolute left-[-15%] top-[-20%] h-[800px] w-[800px] rounded-full bg-violet-500/10 blur-[160px] animate-pulse" />
                <div className="absolute right-[-10%] bottom-[-30%] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[160px] animate-pulse delay-700" />
                <div className="absolute left-1/3 top-1/2 h-[400px] w-[400px] rounded-full bg-fuchsia-500/5 blur-[120px] animate-pulse delay-1000" />
            </div>

            <Container className="relative z-10 space-y-20">
                <SectionHeader />

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