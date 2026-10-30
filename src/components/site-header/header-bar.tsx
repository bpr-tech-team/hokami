import type { ComponentProps } from "react";
import { cn } from "cn";

export function HeaderBar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="header-bar"
      className={cn(
        "mx-auto flex w-full max-w-[85rem] items-center justify-between gap-4 px-5 tablet:px-10 max-[23rem]:gap-2",
        className,
      )}
    />
  );
}
