"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/layout/Loader";
import { Background } from "@/components/layout/background";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({
  children,
}: ClientLayoutProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Initial Loader
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      >
        <Loader />
      </motion.div>
    );
  }

  return (
    <>
      {/* Decorative Background — static noise + one glow, no WebGL */}
      <Background />

      <div className="relative min-h-screen overflow-x-hidden">
        <Navbar />

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: 0.4,
              ease: [0.42, 0, 0.58, 1],
            }}
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
}