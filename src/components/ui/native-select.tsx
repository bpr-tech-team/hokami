import * as React from "react";
import { cn } from "cn";
import Image from "next/image";
import { formControlVariants } from "./form-control-variants";

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default";
};

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn("group/native-select relative w-full", className)}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          formControlVariants(),
          "cursor-pointer appearance-none truncate pr-11 has-[option:checked[value='']]:text-text-tertiary data-[size=sm]:h-10",
        )}
        {...props}
      />
      <Image
        src="/images/reques-for-quote/chevron.svg"
        width={20}
        height={20}
        alt=""
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
