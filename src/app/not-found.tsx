"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white pt-15 px-6">
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-3xl" />
            </div>

            {/* Decorative Blobs */}
            <motion.div
                animate={{
                    y: [-15, 15, -15],
                    x: [-10, 10, -10],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute left-10 top-16 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl"
            />

            <motion.div
                animate={{
                    y: [20, -20, 20],
                    x: [10, -10, 10],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-20 right-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white/90 p-10 text-center shadow-2xl backdrop-blur-xl"
            >
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-8xl font-black text-transparent md:text-9xl"
                >
                    404
                </motion.h1>

                <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900">
                    Lost in the digital universe?
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-zinc-600">
                    The page you're looking for doesn't exist, may have been moved, or the
                    URL is incorrect.
                </p>

                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

                    <button
                        onClick={() => history.back()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-7 py-3 font-medium text-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:text-violet-600"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

                <div className="mt-12 border-t border-zinc-200 pt-6">
                    <p className="text-sm tracking-[0.25em] text-zinc-500 uppercase">
                        Abdul Rehman Portfolio
                    </p>
                </div>
            </motion.div>
        </main>
    );
}