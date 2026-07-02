"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

interface BrowserFrameProps {
  image: string;
  title: string;
  url: string;
}

export default function BrowserFrame({
  image,
  title,
  url,
}: BrowserFrameProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-zinc-950/90
        shadow-[0_25px_80px_rgba(0,0,0,.35)]
        backdrop-blur-2xl
      "
    >
      {/* Glass Reflection */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-white/10
          via-white/5
          to-transparent
          z-10
        "
      />

      {/* Browser Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-4
          py-3
          bg-white/[0.03]
        "
      >
        {/* Traffic Lights */}

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        {/* URL */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/5
            px-4
            py-1.5
            text-[11px]
            text-zinc-400
          "
        >
          <Globe
            size={12}
            className="text-zinc-500"
          />

          <span className="truncate max-w-[150px]">
            {url}
          </span>
        </div>

        <div className="w-10" />
      </div>

      {/* Screenshot */}

      <div className="relative aspect-[16/10] overflow-hidden">

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            duration: 0.6,
          }}
          className="h-full w-full"
        >
          <Image
            src={image}
            alt={title}
            fill
            priority={false}
            className="object-cover"
          />
        </motion.div>

        {/* Dark Overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/55
            via-black/10
            to-transparent
          "
        />

        {/* Bottom Fade */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-32
            bg-gradient-to-t
            from-black/60
            to-transparent
          "
        />

      </div>
    </div>
  );
}