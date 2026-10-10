import * as React from "react";

import { cn } from "@/lib/utils";

// Shared field styles: rest, hover, focus, filled, invalid, disabled, read-only.
// The boundary is the only affordance, so it uses border-strong (≥3:1).
export const fieldClassName = [
  "w-full min-w-0 rounded-md border border-line-strong bg-bg-elevated px-4 text-base text-fg",
  "placeholder:text-fg-subtle",
  "transition-[border-color,background-color,box-shadow] duration-fast ease-out-expo",
  "hoverable:hover:border-fg-subtle",
  "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-ring",
  "aria-invalid:border-danger aria-invalid:focus:ring-danger/40",
  "read-only:bg-bg-subtle read-only:text-fg-muted read-only:focus:ring-0 read-only:focus:border-line-strong",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export interface InputProps extends React.ComponentProps<"input"> {}

function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(fieldClassName, "h-12", className)}
      {...props}
    />
  );
}

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>;
  className?: string;
}

/**
 * Label + control + hint/error, wired with htmlFor/id and aria-describedby.
 * Errors render with role="alert" so screen readers announce them.
 */
function Field({ id, label, hint, error, required, children, className }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="label flex items-center gap-1">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-brand">
            *
          </span>
        ) : null}
      </label>
      {React.cloneElement(children, {
        id,
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
        ...(error ? { "aria-invalid": true } : {}),
      })}
      {hint && !error ? (
        <p id={hintId} className="text-sm text-fg-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Input, Field };
