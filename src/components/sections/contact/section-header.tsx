"use client";

import { motion } from "motion/react";

export default function SectionHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-3xl border border-zinc-200 bg-white px-6 py-2"
            >
                <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-[3px] text-emerald-700">Open for collaboration</span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-zinc-900">
                Ready to build<br />
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                    something legendary?
                </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-600">
                From pixel-perfect frontends to robust backend architecture — let&apos;s turn your vision into a high-impact product.
            </p>
        </motion.div>
    );
}