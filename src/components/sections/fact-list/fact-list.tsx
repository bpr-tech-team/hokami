import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function FactList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "[&_ul]:m-0! [&_ul]:list-none! [&_ul]:p-0! [&_ul>li]:relative [&_ul>li]:m-0! [&_ul>li]:border-b [&_ul>li]:border-border-subtle [&_ul>li]:py-3! [&_ul>li]:pl-8! [&_ul>li]:before:absolute [&_ul>li]:before:top-3 [&_ul>li]:before:left-0 [&_ul>li]:before:size-5 [&_ul>li]:before:bg-[url('/images/services/check.svg')] [&_ul>li]:before:bg-contain [&_ul>li]:before:bg-no-repeat [&_ul>li]:before:content-[''] [&_ul>li>p]:m-0!",
        className,
      )}
    />
  );
}
