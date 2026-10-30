import type { ComponentPropsWithoutRef } from "react";
import { cn } from "cn";
import { Text } from "@/components/typography/text";

export function LegalParagraph({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <Text {...props} variant="article" className={cn("my-5", className)} />
  );
}
