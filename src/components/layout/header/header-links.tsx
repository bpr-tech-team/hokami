import type { Locale } from "next-intl";
import type { ComponentProps } from "react";
import { Link, getPathname } from "@/i18n/navigation";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { LanguageSwitch } from "@/components/navigation/language-switch";
import type { SiteLocation } from "@/hooks/use-site-location";
import { type HeaderItem } from "./navigation";

export function getHeaderAnchorHref(
  href: string,
  locale: Locale,
  pathname: string,
) {
  const hashIndex = href.indexOf("#");
  if (hashIndex >= 0 && href.slice(0, hashIndex) === pathname) {
    // Native fragment navigation preserves the current query string.
    return href.slice(hashIndex);
  }
  return getPathname({ locale, href });
}

type HeaderNavLinkProps = Omit<
  ComponentProps<typeof NavigationMenuLink>,
  "href" | "render" | "active" | "aria-current"
> & {
  item: HeaderItem;
  locale: Locale;
  location: SiteLocation;
};

export function HeaderNavLink({
  item,
  locale,
  location,
  ...props
}: HeaderNavLinkProps) {
  const [pathname, hash] = item.href.split("#");
  let current: "page" | "location" | undefined;
  if (location.pathname === pathname) {
    if (!hash) current = "page";
    else if (location.hash === `#${hash}`) current = "location";
  }

  return (
    <NavigationMenuLink
      {...props}
      active={Boolean(current)}
      aria-current={current}
      render={
        hash ? (
          <a href={getHeaderAnchorHref(item.href, locale, location.pathname)} />
        ) : (
          <Link href={item.href} />
        )
      }
    />
  );
}

export function HeaderLanguageSwitch({
  locale,
  label,
  location,
  onNavigate,
}: {
  locale: Locale;
  label: string;
  location: SiteLocation;
  onNavigate?: () => void;
}) {
  const href = `${location.pathname}${location.search}${location.hash}`;

  return (
    <LanguageSwitch
      locale={locale}
      label={label}
      href={href}
      onNavigate={onNavigate}
    />
  );
}
