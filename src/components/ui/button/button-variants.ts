import { cva } from "class-variance-authority";

// Kept separate from the client component so server-rendered links can reuse it.
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-3 rounded-none font-mono text-xs leading-[1.6] font-normal tracking-[0.16em] whitespace-nowrap uppercase select-none transition-[background-color,border-color,color] duration-250 active:duration-100 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring focus-visible:outline-offset-2 ui-disabled:bg-surface-disabled ui-disabled:text-text-disabled ui-disabled:not-data-loading:cursor-not-allowed data-loading:cursor-wait [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground ui-enabled:hover:bg-action-primary-hover ui-enabled:active:bg-action-primary-pressed",
        outline:
          "border border-border-strong bg-transparent text-text-primary ui-enabled:hover:border-border-strong-hover ui-enabled:hover:bg-surface-subtle ui-enabled:active:border-border-strong-hover ui-enabled:active:bg-surface-raised ui-disabled:border-border-disabled ui-disabled:bg-transparent",
        secondary:
          "bg-secondary text-secondary-foreground ui-enabled:hover:bg-surface-raised",
        ghost:
          "bg-transparent text-text-primary ui-enabled:hover:bg-surface-accent-subtle ui-enabled:hover:text-text-accent",
        destructive:
          "bg-feedback-error-surface text-destructive ui-enabled:hover:bg-destructive ui-enabled:hover:text-text-on-action",
        link: "bg-transparent text-primary underline-offset-4 ui-enabled:hover:text-text-accent-hover ui-enabled:hover:underline",
      },
      size: {
        default: "h-12 px-6",
        lg: "h-14 px-8",
        sm: "h-10 px-4",
        xs: "h-10 px-3",
        icon: "size-12 p-0",
        "icon-lg": "size-14 p-0",
        "icon-sm": "size-11 p-0",
        "icon-xs": "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { buttonVariants };
