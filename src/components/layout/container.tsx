import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      default: "max-w-content",
      wide: "max-w-[85rem]",
    },
  },
  defaultVariants: { size: "default" },
});

export function Container({
  size,
  className,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof containerVariants>) {
  return (
    <div {...props} className={cn(containerVariants({ size }), className)} />
  );
}
