import type { ComponentProps } from "react";

export function FooterSeparator(props: ComponentProps<"span">) {
  return (
    <span {...props} aria-hidden="true">
      •
    </span>
  );
}
