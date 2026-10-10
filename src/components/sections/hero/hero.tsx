"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PopButton } from "@/components/ui/pop-button"
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

import HeroTerminal from "./hero-terminal";
import HeroBadges from "./hero-badges";

export default function Hero() {
    return (
        <Section
            id="home"
            className="pt-24 lg:pt-25"
        >
            <Container className="space-y-16 xl:space-y-20">

                {/* ================= HERO ================= */}

                <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

                    {/* LEFT */}

                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .6 }}
                        className="flex flex-col justify-center"
                    >
                        {/* Mobile Availability Badge */}
                        <div className="mb-6 flex lg:hidden">
                            <div
                                className="
    inline-flex
    items-center
    gap-2
    rounded-full
    border
    border-white/5
    bg-gray-200/50
    px-4
    py-2
    text-sm
    text-gray-400
    backdrop-blur-xl
  "
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-70" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400/50" />
                                </span>

                                Available for Full Stack & AI Projects
                            </div>
                        </div>
                        <h1 className="
              max-w-xl
              text-4xl
              font-black
              leading-tight
              tracking-tight

              sm:text-5xl
              lg:text-6xl
            ">
                            Full Stack{" "}
                            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                                Engineer
                            </span>
                        </h1>

                        <p className="
              mt-6
              max-w-xl
              text-lg
              leading-8
              text-muted-foreground
            ">
                            I build scalable SaaS platforms, AI-powered products,
                            and enterprise backend systems focused on performance,
                            maintainability, and exceptional user experience.
                        </p>

                        <div className="mt-8">
                            <HeroBadges />
                        </div>

                        <div className="mt-10 flex flex-row justify-center gap-4 lg:justify-start">
  <Link href="#projects">
    <PopButton>
      Projects
    </PopButton>
  </Link>

  <a
    href="/resume/AbdulRehman_FullStack.pdf"
    target="_blank"
    rel="noopener noreferrer"
  >
    <PopButton>
      Resume
    </PopButton>
  </a>
</div>

                    </motion.div>

                    {/* RIGHT */}

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            y: [0, -8, 0],
                        }}
                        transition={{
                            opacity: { duration: .7 },
                            x: { duration: .7 },
                            y: {
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                        className="hidden lg:block space-y-6"
                    >

                        <div className="hidden justify-end lg:flex">
                            <div
                                className="
    inline-flex
    items-center
    gap-2
    rounded-full
    border
    border-white/5
    bg-gray-200/50
    px-4
    py-2
    text-sm
    text-gray-500
    backdrop-blur-xl
  "
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-70" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400/50" />
                                </span>

                                Available for Full Stack & AI Projects
                            </div>
                        </div>

                        <div className="relative flex justify-center">

                            {/* Purple Glow */}

                            <div
                                className="
absolute
-left-24
top-24
h-[420px]
w-[420px]
rounded-full
bg-violet-600/20
blur-[170px]
pointer-events-none
"
                            />

                            {/* Blue Glow */}

                            <div
                                className="
absolute
-right-20
bottom-0
h-[380px]
w-[380px]
rounded-full
bg-cyan-400/15
blur-[170px]
pointer-events-none
"
                            />

                            <HeroTerminal />

                        </div>

                    </motion.div>

                </div>

            </Container>
        </Section>
    );
}