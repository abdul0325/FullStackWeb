"use client";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import type { IconType } from "react-icons";

interface TechBadgeProps {
    index: number;
    total: number;
    title: string;
    icon: IconType;
    color: string;
    skills: string[];
}

export default function TechBadge({
    index,
    total,
    title,
    icon: Icon,
    color,
    skills,
}: TechBadgeProps) {
    const [hovered, setHovered] = useState(false);
    const badgeRef = useRef<HTMLDivElement>(null);

    const [placement, setPlacement] = useState<
        "top" | "bottom" | "left" | "right"
    >("top");

    const calculatePlacement = () => {
        if (!badgeRef.current) return;

        const rect = badgeRef.current.getBoundingClientRect();

        const popupWidth = 260;
        const popupHeight = 240;
        const margin = 20;

        const topSpace = rect.top;
        const bottomSpace = window.innerHeight - rect.bottom;
        const leftSpace = rect.left;
        const rightSpace = window.innerWidth - rect.right;

        if (topSpace < popupHeight + margin) {
            setPlacement("bottom");
            return;
        }

        if (leftSpace < popupWidth / 2) {
            setPlacement("right");
            return;
        }

        if (rightSpace < popupWidth / 2) {
            setPlacement("left");
            return;
        }

        setPlacement("top");
    };

    const popupPosition = {
        top:
            "bottom-full left-1/2 -translate-x-1/2 mb-3",

        bottom:
            "top-full left-1/2 -translate-x-1/2 mt-3",

        left:
            "right-full top-1/2 -translate-y-1/2 mr-3",

        right:
            "left-full top-1/2 -translate-y-1/2 ml-3",
    };

    const arrowPosition = {
        top:
            "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b",

        bottom:
            "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 border-l border-t",

        left:
            "left-full top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 border-r border-t",

        right:
            "right-full top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 border-l border-b",
    };

    return (
        <div
            ref={badgeRef}
            className="relative"
            onMouseEnter={() => {
                calculatePlacement();
                setHovered(true);
            }}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Badge */}

            <motion.div
                whileHover={{
                    y: -4,
                    scale: 1.03,
                }}
                transition={{
                    duration: 0.2,
                }}
                className="
          flex
          items-center
          gap-3
          rounded-full
          border
          border-white/10
          bg-white/5
          px-4
          py-2.5
          backdrop-blur-xl
          transition-all
          hover:border-violet-500/40
          hover:bg-white/10
          hover:shadow-[0_10px_35px_rgba(139,92,246,.25)]
        "
            >
                <Icon
                    size={18}
                    style={{ color }}
                    className="transition-transform duration-300 group-hover:rotate-6"
                />

                <span className="text-sm font-medium text-zinc-500">
                    {title}
                </span>
            </motion.div>

            {/* Floating Card */}
            <div className="hidden md:block">
                <AnimatePresence>

                    {hovered && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                                scale: .96,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 8,
                                scale: .96,
                            }}
                            transition={{
                                duration: .18,
                            }}
                            className={`
absolute
bottom-full
z-50
mb-3
w-60
rounded-2xl
border
border-white/10
bg-white
text-zinc-900
p-4
shadow-[0_25px_60px_rgba(0,0,0,.35)]
backdrop-blur-2xl

${index === 0
                                    ? "left-0"
                                    : index === total - 1
                                        ? "right-0"
                                        : "left-1/2 -translate-x-1/2"
                                }
`}
                        >
                            {/* Arrow */}
                            <div
                                className={`
absolute
top-full
h-3
w-3
-translate-y-1/2
rotate-45
border-r
border-b
border-zinc-200
bg-white

${index === 0
                                        ? "left-6"
                                        : index === total - 1
                                            ? "right-6"
                                            : "left-1/2 -translate-x-1/2"
                                    }
`}
                            />

                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                                    style={{ backgroundColor: `${color}15` }}
                                >
                                    <Icon
                                        size={22}
                                        style={{ color }}
                                    />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-zinc-900">
                                        {title}
                                    </h4>

                                    <p className="text-xs text-zinc-500">
                                        Production Experience
                                    </p>
                                </div>
                            </div>
                            <div className="my-4 h-px bg-zinc-200" />
                            <div className="mt-4 space-y-2">

                                {skills.map((skill, index) => (

                                    <motion.div
                                        key={skill}
                                        initial={{
                                            opacity: 0,
                                            x: -8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            delay: index * .05,
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle2
                                            size={14}
                                            className="text-emerald-400 shrink-0"
                                        />

                                        <span className="text-sm text-zinc-600">
                                            {skill}
                                        </span>

                                    </motion.div>

                                ))}

                            </div>

                        </motion.div>

                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}