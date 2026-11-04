import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function HeaderCompactControls({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "flex min-w-0 items-center gap-4 max-[23rem]:gap-2 xl:hidden",
        className,
      )}
    />
  );
}
