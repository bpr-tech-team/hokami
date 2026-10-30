import type { Locale } from "next-intl";
import { cn } from "cn";
import {
  ButtonLink,
  type ButtonLinkProps,
} from "@/components/ui/button/button-link";
import type { SiteLocation } from "@/hooks/use-site-location";
import { getHeaderAnchorHref } from "./header-links";

type HeaderRequestLinkProps = Omit<ButtonLinkProps, "href"> & {
  locale: Locale;
  location: SiteLocation;
  compact?: boolean;
};

export function HeaderRequestLink({
  locale,
  location,
  compact = false,
  className,
  ...props
}: HeaderRequestLinkProps) {
  return (
    <ButtonLink
      {...props}
      href={getHeaderAnchorHref(
        "/#reques-for-quote",
        locale,
        location.pathname,
      )}
      className={cn(compact && "px-6 max-[23rem]:px-3", className)}
    />
  );
}
