"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PopButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function PopButton({
  className,
  children = "Learn More",
  ...props
}: PopButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center",
        "rounded-xl",
        "px-4 py-2",
        "font-semibold uppercase text-white",

        // Button
        "bg-zinc-800",
        "border-2 border-zinc-600",

        // Animation
        "transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]",

        // 3D Effect (2 Layers)
        "shadow-[0_10px_0_-2px_#71717a,0_10px_0_0_#a1a1aa]",

        // Hover
        "hover:bg-zinc-900",
        "hover:border-black",
        "hover:translate-y-1",
        "hover:shadow-[0_8px_0_-2px_#52525b,0_8px_0_0_#71717a]",

        // Active / Press
        "active:bg-zinc-950",
        "active:translate-y-3",
        "active:shadow-[0_0px_0_-2px_#52525b,0_0px_0_0_#71717a]",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default PopButton;