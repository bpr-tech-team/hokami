import { cva } from "class-variance-authority";

export const sectionVariants = cva(
  "px-5 py-18 wrap-anywhere tablet:px-10 tablet:py-24 desktop:px-20 desktop:py-32",
  {
    variants: {
      tone: {
        default: "bg-surface-default",
        subtle: "bg-surface-subtle",
      },
    },
    defaultVariants: { tone: "default" },
  },
);
