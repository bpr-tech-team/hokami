import type { ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const headingVariants = cva("font-display font-semibold", {
  variants: {
    variant: {
      section:
        "text-[32px] leading-[35px] tracking-[-0.01em] text-text-primary uppercase tablet:text-[40px] tablet:leading-[42px] desktop:text-[52px] desktop:leading-[53px]",
      item: "text-base leading-[19px] tracking-[0.06em] uppercase tablet:text-lg tablet:leading-[22px]",
      page: "text-4xl uppercase",
      legal: "text-4xl leading-tight wrap-anywhere uppercase tablet:text-5xl",
      article: "text-2xl leading-snug",
      "article-subheading": "text-xl",
    },
  },
  defaultVariants: { variant: "section" },
});

type HeadingProps = ComponentPropsWithRef<"h2"> &
  VariantProps<typeof headingVariants> & {
    as?: "h1" | "h2" | "h3" | "h4" | "span";
  };

export function Heading({
  as: Tag = "h2",
  variant,
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag {...props} className={cn(headingVariants({ variant }), className)} />
  );
}
