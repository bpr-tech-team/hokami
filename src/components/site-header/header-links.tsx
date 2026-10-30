import type { Locale } from "next-intl";
import type { ComponentProps } from "react";
import { Link, getPathname } from "@/i18n/navigation";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import {
  headerLanguages,
  type HeaderItem,
  type HeaderLocation,
} from "./navigation";

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
  location: HeaderLocation;
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
  location: HeaderLocation;
  onNavigate?: () => void;
}) {
  const href = `${location.pathname}${location.search}${location.hash}`;

  return (
    <nav
      data-slot="language-switch"
      className="flex shrink-0 items-center"
      aria-label={label}
    >
      {headerLanguages.map((language) => (
        <Link
          key={language.locale}
          href={href}
          locale={language.locale}
          lang={language.locale}
          hrefLang={language.locale}
          aria-label={language.name}
          aria-current={language.locale === locale ? "true" : undefined}
          className="relative inline-flex min-h-11 items-center justify-center px-2 font-mono text-xs leading-[1.6] tracking-[0.16em] text-text-secondary hover:text-text-primary aria-current:text-text-primary after:absolute after:right-2 after:bottom-2 after:left-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-identity after:transition-transform after:duration-250 after:content-[''] hover:after:scale-x-100 aria-current:after:right-0 aria-current:after:scale-x-100 aria-current:after:bg-text-accent"
          onClick={onNavigate}
        >
          {language.code}
        </Link>
      ))}
    </nav>
  );
}
