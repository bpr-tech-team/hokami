import type { ComponentProps } from "react";
import { cn } from "cn";

export function CloseIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={cn(
        "relative inline-block size-5 shrink-0 before:absolute before:top-1/2 before:left-1/2 before:h-[1.5px] before:w-[calc(70.7107%+1.5px)] before:-translate-1/2 before:rotate-45 before:rounded-full before:bg-current after:absolute after:top-1/2 after:left-1/2 after:h-[1.5px] after:w-[calc(70.7107%+1.5px)] after:-translate-1/2 after:-rotate-45 after:rounded-full after:bg-current",
        className,
      )}
    />
  );
}
