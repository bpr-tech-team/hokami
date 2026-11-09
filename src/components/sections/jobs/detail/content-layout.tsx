import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import { RichText } from "@/components/typography/rich-text";
import { cn } from "@/lib/utils";

export const jobColumnsVariants = cva("grid min-w-0 gap-6", {
  variants: { columns: { 1: "grid-cols-1", 2: "desktop:grid-cols-2" } },
  defaultVariants: { columns: 1 },
});

export function JobColumn({ className, ...props }: ComponentProps<"div">) {
  return (
    <RichText {...props} className={cn("min-w-0 leading-body", className)} />
  );
}
