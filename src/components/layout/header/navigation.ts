import type { Locale } from "next-intl";
import type { SiteLocation } from "@/hooks/use-site-location";

export const headerNavigation = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "careers", href: "/jobs" },
  { key: "sustainability", href: "/sustainability" },
  { key: "contact", href: "/contact" },
] as const;

// Matches Tailwind's default xl breakpoint used by the header components.
export const HEADER_DESKTOP_QUERY = "(min-width: 80rem)";

export function getHeaderLinkState(
  href: string,
  location: Pick<SiteLocation, "pathname" | "hash">,
): { active: boolean; current?: "page" | "location" } {
  const [pathname, hash] = href.split("#");
  if (location.pathname === pathname) {
    if (!hash) return { active: true, current: "page" };
    if (location.hash === `#${hash}`)
      return { active: true, current: "location" };
  }
  return {
    active:
      !hash && pathname !== "/" && location.pathname.startsWith(`${pathname}/`),
  };
}

export type HeaderItem = {
  key: (typeof headerNavigation)[number]["key"];
  href: string;
  label: string;
};

export type HeaderLabels = {
  navigation: string;
  home: string;
  skip: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  request: string;
  requestShort: string;
};

export type HeaderProps = {
  locale: Locale;
  labels: HeaderLabels;
  items: HeaderItem[];
};

export type HeaderNavProps = HeaderProps & {
  location: SiteLocation;
};
