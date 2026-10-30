import type { ComponentPropsWithoutRef } from "react";
import { cn } from "cn";

export function FooterRow({
  as: Tag = "div",
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { as?: "div" | "nav" }) {
  return (
    <Tag
      {...props}
      className={cn(
        "-my-2.5 flex flex-wrap items-center justify-center gap-x-2",
        className,
      )}
    />
  );
}

export function FooterGroup({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn("inline-flex items-center gap-2", className)}
    />
  );
}
