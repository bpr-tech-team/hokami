import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";

export const footerLinkVariants = cva(
  "inline-flex min-h-11 items-center underline decoration-from-font underline-offset-2 transition-opacity duration-150 hover:opacity-75",
);

export function FooterLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return <Link {...props} className={cn(footerLinkVariants(), className)} />;
}
