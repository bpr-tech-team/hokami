import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const traceDotVariants = cva(
  "absolute size-[9px] bg-contain bg-center bg-no-repeat",
  {
    variants: {
      variant: {
        primary: "bg-[url('/images/ui/button/dot-primary.svg')]",
        secondary: "bg-[url('/images/ui/button/dot-secondary.svg')]",
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
    <span {...props} className={cn(traceDotVariants({ variant }), className)} />
  );
}
