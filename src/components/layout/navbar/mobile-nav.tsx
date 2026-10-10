"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { navigation } from "@/data/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PopButton from "@/components/ui/pop-button";
import { Logo } from "./logo";

interface MobileNavProps {
  activeSection: string;
}

export function MobileNav({ activeSection }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Open menu"
            className="relative"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-[280px] flex-col p-0 sm:w-[340px]"
        >
          <SheetHeader className="border-b px-6 py-5">
            <SheetTitle className="text-left text-base font-semibold">
             <Logo />
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
            {navigation.map((item) => {
              const active =
                activeSection === item.href.replace("#", "");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center rounded-lg px-3 py-2.5 text-base transition-colors ${active
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  {active && (
                    <span className="absolute left-0 h-5 w-0.5 rounded-full bg-primary" />
                  )}
                  <span className="ml-1">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t px-6 py-5 flex justify-center">
            <div className="w-[60%] flex justify-center">
              <a
                href="/resume/AbdulRehman_FullStack.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <PopButton className="w-full flex justify-center py-3 text-sm">
                  Resume
                </PopButton>
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}