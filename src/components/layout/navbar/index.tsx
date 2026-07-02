"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

import { Container } from "@/components/ui/container";

import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

import { useActiveSection } from "@/hooks/use-active-section";

export default function Navbar() {
  const activeSection = useActiveSection();

  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      initial={false}
      animate={{
        y: hidden ? -100 : 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <Container>
        <div className="mt-5 flex h-16 items-center justify-between rounded-full border border-border/50 bg-background/70 px-6 backdrop-blur-xl">
          <Logo />

          <DesktopNav
            activeSection={activeSection}
          />

          <MobileNav
            activeSection={activeSection}
          />
        </div>
      </Container>
    </motion.header>
  );
}