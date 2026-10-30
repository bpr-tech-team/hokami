import type { ComponentPropsWithoutRef } from "react";
import { cn } from "cn";
import { Heading } from "@/components/typography/heading";

export function LegalHeading({
  level = 2,
  className,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { level?: 2 | 3 }) {
  return (
    <Heading
      {...props}
      as={level === 3 ? "h3" : "h2"}
      variant={level === 3 ? "article-subheading" : "article"}
      className={cn(
        level === 3 ? "mt-8 mb-3" : "mt-12 mb-5 first:mt-0",
        className,
      )}
    />
  );
}
