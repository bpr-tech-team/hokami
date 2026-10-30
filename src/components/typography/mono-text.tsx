import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const monoTextVariants = cva(
  "font-mono text-xs leading-[1.6] font-normal uppercase",
  {
    variants: {
      variant: {
        eyebrow: "tracking-[0.22em]",
        label: "tracking-[0.16em]",
        meta: "tracking-[0.12em]",
      },
      tone: {
        accent: "text-text-accent",
        secondary: "text-text-secondary",
        tertiary: "text-text-tertiary",
        inverse: "text-text-on-inverse",
      },
    },
    defaultVariants: { variant: "label", tone: "accent" },
  },
);

type MonoTextProps = ComponentPropsWithoutRef<"p"> &
  VariantProps<typeof monoTextVariants> & { as?: "p" | "span" };

export function MonoText({
  as: Tag = "p",
  variant,
  tone,
  className,
  ...props
}: MonoTextProps) {
  return (
    <Tag
      {...props}
      className={cn(monoTextVariants({ variant, tone }), className)}
    />
  );
}
