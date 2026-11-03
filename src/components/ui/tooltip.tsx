"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const tooltipVariants = cva(
  "z-50 flex w-fit max-w-xs origin-(--transform-origin) rounded-none text-xs transition-[opacity,transform] duration-250 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
  {
    variants: {
      variant: {
        default:
          "items-center gap-1.5 bg-foreground px-3 py-1.5 text-background",
        map: "flex-col items-start gap-[3px] border border-border-brand-subtle bg-surface-subtle px-3.5 py-2.5 font-mono leading-body tracking-meta text-text-primary uppercase",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  anchor,
  variant,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "anchor"
  > &
  VariantProps<typeof tooltipVariants>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
        className="isolate z-50 data-anchor-hidden:invisible"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(tooltipVariants({ variant }), className)}
          {...props}
        >
          {children}
          {variant !== "map" && (
            <TooltipPrimitive.Arrow className="group/tooltip-arrow z-50 size-2.5 data-[side=bottom]:top-1 data-[side=inline-end]:-left-1 data-[side=inline-start]:-right-1 data-[side=left]:-right-1 data-[side=right]:-left-1 data-[side=top]:-bottom-2.5">
              {/* Base UI owns the anchor coordinates; only the decoration transforms. */}
              <span
                data-slot="tooltip-arrow-decoration"
                className="absolute inset-0 rotate-45 bg-foreground group-data-[side=bottom]/tooltip-arrow:translate-y-[calc(-50%-2px)] group-data-[side=top]/tooltip-arrow:translate-y-[calc(-50%-2px)]"
              />
            </TooltipPrimitive.Arrow>
          )}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
