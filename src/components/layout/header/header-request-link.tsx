import type { Locale } from "next-intl";
import { cn } from "@/lib/utils";
import {
  ButtonLink,
  type ButtonLinkProps,
} from "@/components/ui/button/button-link";
import type { SiteLocation } from "@/hooks/use-site-location";
import { getPublicFormHref } from "@/lib/forms/navigation";

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
      href={getPublicFormHref(
        locale,
        "/contact#contact-form",
        location.pathname,
      )}
      className={cn(
        compact &&
          "min-w-0 shrink px-6 text-center whitespace-normal max-[23rem]:px-3",
        className,
      )}
    />
  );
}
