"use client";

import Image from "next/image";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "cn";
import { formControlVariants } from "./form-control-variants";

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("min-w-0 flex-1 truncate text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & { size?: "sm" | "default" }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        formControlVariants(),
        "group/select flex cursor-pointer items-center gap-2 text-left whitespace-nowrap select-none data-disabled:cursor-not-allowed data-placeholder:text-text-tertiary data-popup-open:border-border-strong-hover data-[size=sm]:h-10",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="pointer-events-none flex size-5 shrink-0 items-center justify-center transition-transform duration-250 group-data-popup-open/select:rotate-180">
        <Image
          src="/images/reques-for-quote/chevron.svg"
          width={20}
          height={20}
          alt=""
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 2,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "relative w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-none border border-border-subtle bg-surface-default py-1 text-text-primary shadow-[0_8px_24px_-4px_rgb(17_16_14/12%),0_2px_6px_rgb(17_16_14/6%)] outline-none transition-[opacity,translate] duration-250 ease-out data-starting-style:-translate-y-1 data-starting-style:opacity-0 data-ending-style:-translate-y-1 data-ending-style:opacity-0",
            className,
          )}
          {...props}
        >
          <SelectPrimitive.List className="max-h-[min(264px,calc(var(--available-height)_-_10px))] overflow-y-auto overscroll-contain outline-none [scrollbar-width:thin]">
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-4 py-2 font-mono text-xs tracking-[0.16em] text-text-secondary uppercase",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex h-11 w-full shrink-0 cursor-pointer items-center gap-2 px-4 font-sans text-base leading-[1.6] text-text-primary outline-none transition-colors duration-250 select-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-[5%] after:bg-brand-identity after:transition-[width] after:duration-250 last:after:hidden data-disabled:pointer-events-none data-disabled:text-text-disabled data-highlighted:bg-surface-accent-subtle data-highlighted:after:w-1/4 data-selected:bg-surface-accent-subtle",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="pointer-events-none flex size-5 shrink-0 items-center justify-center">
        <Image
          src="/images/reques-for-quote/check.svg"
          width={20}
          height={20}
          alt=""
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none my-1 h-px bg-border-subtle",
        className,
      )}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
