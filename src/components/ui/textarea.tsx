import * as React from "react";

import { cn } from "@/lib/utils";
import { fieldClassName } from "@/components/ui/input";

export interface TextareaProps extends React.ComponentProps<"textarea"> {}

function Textarea({ className, rows = 5, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(fieldClassName, "min-h-32 resize-y py-3 leading-relaxed", className)}
      {...props}
    />
  );
}

export { Textarea };
