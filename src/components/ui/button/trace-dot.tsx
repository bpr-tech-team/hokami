import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const traceDotVariants = cva(
  // Paint both edges together, with soft transitions for the tiny ring.
  "absolute size-[9px] bg-[radial-gradient(circle_closest-side,var(--color-surface-default)_0_2.75px,currentColor_3.25px_4px,transparent_4.5px)]",
  {
    variants: {
      variant: {
        primary: "text-action-primary-trace",
        secondary: "text-brand-identity",
      },
    },
    defaultVariants: { variant: "secondary" },
  },
);

export function TraceDot({
  variant,
  className,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof traceDotVariants>) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={cn(traceDotVariants({ variant }), className)}
    />
  );
}
