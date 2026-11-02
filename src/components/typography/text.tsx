import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const textVariants = cva("font-sans font-normal", {
  variants: {
    variant: {
      quote:
        "font-display text-[22px] leading-[29px] tablet:text-[28px] tablet:leading-[36px] desktop:text-[34px] desktop:leading-[43px]",
      body: "text-base leading-[1.6]",
      lead: "text-lg leading-[1.6]",
      small: "text-sm leading-[1.55]",
      stat: "font-display text-[28px] leading-[28px] font-semibold tracking-[-0.01em]",
      article: "text-base leading-relaxed",
    },
    tone: {
      primary: "text-text-primary",
      secondary: "text-text-secondary",
      black: "text-black",
    },
  },
  defaultVariants: { variant: "body", tone: "primary" },
});

export type TextProps = ComponentPropsWithoutRef<"p"> &
  VariantProps<typeof textVariants> & { as?: "p" | "span" };

export function Text({
  as: Tag = "p",
  variant,
  tone,
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      {...props}
      className={cn(textVariants({ variant, tone }), className)}
    />
  );
}
