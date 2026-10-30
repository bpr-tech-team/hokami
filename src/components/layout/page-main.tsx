import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const pageMainVariants = cva("", {
  variants: {
    variant: {
      full: "",
      contained: "mx-auto max-w-content px-5 py-18 tablet:px-10",
    },
    spacing: {
      default: "",
      large: "desktop:py-32",
      medium: "desktop:py-24",
    },
  },
  defaultVariants: { variant: "full", spacing: "default" },
});

export function PageMain({
  variant,
  spacing,
  className,
  ...props
}: ComponentProps<"main"> & VariantProps<typeof pageMainVariants>) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      {...props}
      className={cn(pageMainVariants({ variant, spacing }), className)}
    />
  );
}
