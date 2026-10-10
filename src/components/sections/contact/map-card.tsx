"use client";

import { motion } from "motion/react";
import { MapPin, Clock, Globe } from "lucide-react";

export default function MapCard() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-full min-h-[620px] lg:min-h-0 overflow-hidden rounded-3xl border border-zinc-100 bg-white lg:rounded-l-none lg:border-l-0 flex flex-col hidden lg:flex"
        >
            <div className="relative flex-1 overflow-hidden">
                <iframe
                    title="Location"
                    src="https://www.google.com/maps?q=Bahawalpur,Punjab,Pakistan&output=embed"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-8 lg:p-10">
                <div className="flex items-center gap-3 text-emerald-600 mb-3">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Bahawalpur, Pakistan</span>
                </div>
                <h4 className="text-xl font-semibold text-zinc-900">Available for global projects</h4>

                <div className="mt-6 grid grid-cols-2 gap-6 text-sm text-zinc-600">
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4" />
                        <div>PKT (UTC+5)</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4" />
                        <div>Remote • Relocation</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}