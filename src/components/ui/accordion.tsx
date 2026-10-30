"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ReactNode } from "react";

const itemVariants = cva("relative", {
  variants: {
    variant: {
      default: "not-last:border-b",
      industry:
        "group/industry flex min-w-0 flex-col border-b border-border-brand-subtle bg-surface-default transition-[flex-grow,background-color] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-0.5 before:origin-left before:scale-x-0 before:bg-action-primary before:shadow-[0_0_14px_0] before:shadow-brand-identity/80 before:transition-transform before:duration-500 before:ease-[cubic-bezier(.2,.7,.2,1)] hover:not-data-open:bg-surface-raised hover:not-data-open:before:scale-x-25 data-open:before:scale-x-100 desktop:flex-[0_0_auto] desktop:data-open:grow",
    },
  },
  defaultVariants: { variant: "default" },
});

const triggerVariants = cva(
  "group/accordion-trigger relative flex min-w-0 flex-1 text-left outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "items-start justify-between rounded-lg border border-transparent py-2.5 text-sm font-medium transition-all hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
        industry:
          "cursor-pointer items-center gap-4 p-5 transition-[padding] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2 aria-expanded:pb-4 desktop:p-6 desktop:aria-expanded:pb-4",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const contentVariants = cva("overflow-hidden text-sm", {
  variants: {
    variant: {
      default:
        "data-open:animate-accordion-down data-closed:animate-accordion-up",
      industry:
        "h-(--accordion-panel-height) transition-[height] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] data-ending-style:h-0 data-starting-style:h-0 desktop:flex-auto",
    },
  },
  defaultVariants: { variant: "default" },
});

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  variant,
  ...props
}: AccordionPrimitive.Item.Props & VariantProps<typeof itemVariants>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(itemVariants({ variant }), className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  variant,
  icon,
  ...props
}: AccordionPrimitive.Trigger.Props &
  VariantProps<typeof triggerVariants> & { icon?: ReactNode }) {
  return (
    <AccordionPrimitive.Header className="flex shrink-0">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(triggerVariants({ variant }), className)}
        {...props}
      >
        {children}
        {icon ?? (
          <>
            <ChevronDownIcon
              data-slot="accordion-trigger-icon"
              className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
            />
            <ChevronUpIcon
              data-slot="accordion-trigger-icon"
              className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
            />
          </>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  variant,
  ...props
}: AccordionPrimitive.Panel.Props & VariantProps<typeof contentVariants>) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={contentVariants({ variant })}
      {...props}
    >
      <div
        className={cn(
          variant === "industry"
            ? "flex h-full flex-col gap-4 px-5 pb-5 desktop:justify-between desktop:pr-6 desktop:pb-6 desktop:pl-[136px]"
            : "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
