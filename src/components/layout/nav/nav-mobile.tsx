"use client";

// Client island: the designed mobile menu. A Radix Dialog (focus trap, Escape,
// focus return, aria) rendered as a full-screen sheet. Scroll lock via Radix
// plus overscroll containment. Items stagger in (transform + opacity only),
// collapsed under reduced motion. Safe-area aware.

import * as React from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { navigation } from "@/data/navigation";
import { site } from "@/data/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { duration, ease, stagger } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

export function NavMobile({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const active = useActiveSection();
  const reduce = useReducedMotion();

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : stagger.base, delayChildren: reduce ? 0 : 0.08 } },
  };
  const itemVariants = reduce
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
      };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className={cn("lg:hidden", className)}
        >
          <Menu aria-hidden="true" className="size-5" />
        </Button>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : duration.fast }}
                className="fixed inset-0 z-[55] bg-bg/60 backdrop-blur-sm lg:hidden"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduce ? 0 : duration.base, ease: ease.out }}
                className={cn(
                  "fixed inset-0 z-[56] flex flex-col bg-bg text-fg lg:hidden",
                  "overscroll-contain"
                )}
                style={{
                  paddingTop: "env(safe-area-inset-top)",
                  paddingBottom: "env(safe-area-inset-bottom)",
                }}
              >
                <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>

                {/* Top bar mirrors the header so the close button sits where the trigger was */}
                <div className="flex h-16 items-center justify-between px-5">
                  <span className="label">Menu</span>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <DialogPrimitive.Close asChild>
                      <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X aria-hidden="true" className="size-5" />
                      </Button>
                    </DialogPrimitive.Close>
                  </div>
                </div>

                <motion.nav
                  aria-label="Primary"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-5"
                >
                  {navigation.map((item, i) => {
                    const isActive = active === item.href.replace("#", "");
                    return (
                      <motion.div key={item.href} variants={itemVariants}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? "true" : undefined}
                          className={cn(
                            "group flex items-baseline gap-4 rounded-md py-3 text-h1 font-semibold tracking-tight",
                            "transition-colors duration-fast ease-out-expo",
                            isActive ? "text-fg" : "text-fg-muted hoverable:hover:text-fg active:text-fg"
                          )}
                        >
                          <span className="font-mono text-xs text-fg-faint">0{i + 1}</span>
                          {item.title}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>

                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: reduce ? 0 : 0.35 }}
                  className="flex flex-col gap-4 border-t border-line px-5 py-5"
                >
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <a href={site.socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg-muted hoverable:hover:text-fg">
                      GitHub <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </a>
                    <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg-muted hoverable:hover:text-fg">
                      LinkedIn <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </a>
                    <a href={`mailto:${site.email}`} className="text-fg-muted hoverable:hover:text-fg">
                      Email
                    </a>
                  </div>
                  <Button asChild size="lg" className="w-full">
                    <a href={site.resumePdf} target="_blank" rel="noopener noreferrer">
                      Download CV
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
