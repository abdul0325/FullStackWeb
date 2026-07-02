"use client";

import Link from "next/link";
import { navigation } from "@/data/navigation";
import { CreepyButton } from "@/components/ui/creepy-resume-button";

interface DesktopNavProps {
  activeSection: string;
}

export function DesktopNav({
  activeSection,
}: DesktopNavProps) {
  return (
    <div className="hidden items-center gap-8 lg:flex">
      <nav className="flex items-center gap-7">
        {navigation.map((item) => {
          const active = activeSection === item.href.replace("#", "");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative
                text-sm
                font-medium
                transition-all
                duration-300

                ${active
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-violet-600"
                }

                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[2px]
                after:w-full
                after:origin-left
                after:scale-x-0
                after:bg-gradient-to-r
                after:from-violet-500
                after:to-cyan-500
                after:transition-transform
                after:duration-300

                hover:after:scale-x-100

                ${active ? "after:scale-x-100" : ""}
              `}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Resume Button */}
      <Link href="/resume/AbdulRehman_FullStack.pdf">
        <CreepyButton
          coverClassName="
            bg-zinc-900 
            text-white 
            border 
            border-zinc-800
            hover:bg-black
          "
        >
          Resume
        </CreepyButton>
      </Link>
    </div>
  );
}