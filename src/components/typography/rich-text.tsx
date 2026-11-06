import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function RichText({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "text-base leading-relaxed wrap-anywhere [&_a]:text-text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-text-accent-hover [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-action-primary [&_blockquote]:pl-6 [&_code]:font-mono [&_code]:text-sm [&_figure]:my-8 [&_hr]:my-8 [&_hr]:border-border-subtle [&_img]:my-8 [&_li]:my-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:bg-surface-subtle [&_pre]:p-4 [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-border-subtle [&_td]:p-3 [&_td]:align-top tablet:[&_td]:p-4 [&_th]:border [&_th]:border-border-subtle [&_th]:p-3 [&_th]:text-left [&_th]:align-top tablet:[&_th]:p-4 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6",
        className,
      )}
    />
  );
}
