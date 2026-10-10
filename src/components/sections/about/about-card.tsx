"use client";

import {
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Rocket,
} from "lucide-react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import PopButton from "@/components/ui/pop-button";

export default function AboutCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{
        y: -6,
      }}
      className="
  relative
  overflow-hidden
  rounded-3xl
  border
  border-white/10
  bg-white/5
  p-6
  sm:p-8
  backdrop-blur-2xl
  shadow-[0_20px_80px_rgba(0,0,0,.25)]
"
    >
      {/* Glass Reflection */}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

      {/* Avatar */}

      <div className="relative flex justify-center">
        <div
          className="
      relative
      h-20 w-20
sm:h-24 sm:w-24
      overflow-hidden
      rounded-full
      border
      border-violet-500/30
      bg-gradient-to-br
      from-violet-500/20
      to-cyan-500/20
      p-1
      backdrop-blur-xl
      shadow-[0_0_35px_rgba(139,92,246,.2)]
    "
        >
          <Image
            src="/pictures/ab.webp"
            alt="Abdul Rehman"
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 1024px) 60vw, 320px"
          />
        </div>
      </div>

      {/* Name */}

      <div className="relative mt-6 text-center">
        <h3 className="text-xl font-bold sm:text-2xl">
          Abdul Rehman Ejaz
        </h3>

        <p className="mt-2 text-muted-foreground">
          Full Stack Engineer
        </p>
      </div>

      {/* Divider */}

      <div className="my-8 h-px bg-white/10 justify-center items-center" />

      {/* Info */}

      <div className="space-y-5">

        <Info
          icon={MapPin}
          label="Location"
          value="Pakistan"
        />

        <Info
          icon={GraduationCap}
          label="Education"
          value="BS Computer Science"
        />

        <Info
          icon={BriefcaseBusiness}
          label="Experience"
          value="2+ Years"
        />

        <Info
          icon={Rocket}
          label="Projects"
          value="15+ Delivered"
        />

      </div>

      {/* Resume */}

      <div className="my-4 h-px" />

      <div className="mt-6 flex justify-center">
        <a
          href="/resume/AbdulRehman_FullStack.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <PopButton className="w-full justify-center py-3 text-sm">
            Resume
          </PopButton>
        </a>
      </div>
      {/* Status */}

      <div className="my-4 h-px bg-white/10" />

      <div className="flex items-center gap-3 sm:gap-4">

        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
        </span>

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
            Available
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Open to Remote & Freelance
          </p>

        </div>

      </div>
    </motion.div>
  );
}

interface InfoProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function Info({
  icon: Icon,
  label,
  value,
}: InfoProps) {
  return (
    <div className="flex items-center gap-4 min-w-0">

      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-violet-500/10
          text-violet-400
        "
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0">

        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>

        <p className="font-medium break-words">
          {value}
        </p>

      </div>

    </div>
  );
}