import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const traceDotVariants = cva(
  // An inset circle preserves the 1.5 px ring at every device pixel ratio.
  "absolute size-[9px] rounded-[50%] before:absolute before:inset-[1.5px] before:rounded-[50%] before:bg-surface-default",
  {
    variants: {
      variant: {
        primary: "bg-action-primary-trace",
        secondary: "bg-brand-identity",
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
