import { cva } from "class-variance-authority";

export const formControlVariants = cva(
  "w-full min-w-0 rounded-none border border-border-strong bg-surface-default px-4 font-sans text-base leading-[1.6] text-text-primary outline-none transition-colors placeholder:text-text-tertiary hover:border-border-strong-hover focus-visible:outline-none disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-surface-disabled disabled:text-text-disabled aria-invalid:border-2 aria-invalid:border-feedback-error-text",
  {
    variants: {
      multiline: {
        false: "h-12 py-0",
        true: "flex field-sizing-content min-h-32 resize-y py-3",
      },
    },
    defaultVariants: { multiline: false },
  },
);
