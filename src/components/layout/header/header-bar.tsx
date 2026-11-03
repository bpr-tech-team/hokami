import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

export function HeaderBar({ className, ...props }: ComponentProps<"div">) {
  return (
    <Container
      size="wide"
      {...props}
      data-slot="header-bar"
      className={cn(
        "flex items-center justify-between gap-4 px-5 max-[23rem]:gap-2 tablet:px-10",
        className,
      )}
    />
  );
}
