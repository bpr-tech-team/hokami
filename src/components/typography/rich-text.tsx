import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Descendant typography stops at self-styled blocks, including their root.
// :where keeps local component utilities able to override these defaults.
export function RichText({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "text-base leading-relaxed wrap-anywhere",
        "[&_:where(a):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:text-text-accent [&_:where(a):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:underline [&_:where(a):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:underline-offset-2 [&_:where(a):not(:where([data-rich-text-island],[data-rich-text-island]_*)):hover]:text-text-accent-hover",
        "[&_:where(blockquote):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:my-8 [&_:where(blockquote):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:border-l-2 [&_:where(blockquote):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:border-action-primary [&_:where(blockquote):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:pl-6",
        "[&_:where(code):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:font-mono [&_:where(code):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:text-sm",
        "[&_:where(figure):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:my-8",
        "[&_:where(hr):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:my-8 [&_:where(hr):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:border-border-subtle",
        "[&_:where(img):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:my-8",
        "[&_:where(li):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:my-2",
        "[&_:where(ol):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:my-5 [&_:where(ol):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:list-decimal [&_:where(ol):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:pl-6",
        "[&_:where(pre):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:my-6 [&_:where(pre):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:overflow-x-auto [&_:where(pre):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:bg-surface-subtle [&_:where(pre):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:p-4",
        "[&_:where(strong):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:font-semibold",
        "[&_:where(table):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:w-full [&_:where(table):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:border-collapse [&_:where(table):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:text-sm",
        "[&_:where(td):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:border [&_:where(td):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:border-border-subtle [&_:where(td):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:p-3 [&_:where(td):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:align-top tablet:[&_:where(td):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:p-4",
        "[&_:where(th):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:border [&_:where(th):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:border-border-subtle [&_:where(th):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:p-3 [&_:where(th):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:text-left [&_:where(th):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:align-top tablet:[&_:where(th):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:p-4",
        "[&_:where(ul):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:my-5 [&_:where(ul):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:list-disc [&_:where(ul):not(:where([data-rich-text-island],[data-rich-text-island]_*))]:pl-6",
        className,
      )}
    />
  );
}
