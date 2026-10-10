"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Copies `value` to the clipboard and shows a 1.2 s "Copied" state. The status
// is announced through a polite live region.

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  value: string;
  /** Visible label; defaults to an icon-only button with an aria-label. */
  label?: string;
}

export function CopyButton({ value, label, className, variant = "secondary", size, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard blocked (insecure context / permissions). Fall back silently;
      // the value is still visible beside the button.
    }
  }

  const Icon = copied ? Check : Copy;

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size ?? (label ? "sm" : "icon-sm")}
        aria-label={label ? undefined : `Copy ${value}`}
        onClick={copy}
        className={cn(copied && "border-success/40 text-success", className)}
        {...props}
      >
        <Icon aria-hidden="true" />
        {label ? (copied ? "Copied" : label) : null}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
