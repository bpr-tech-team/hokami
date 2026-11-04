import type { Locale } from "next-intl";
import type { SiteLocation } from "@/hooks/use-site-location";

export const headerNavigation = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "careers", href: "/career" },
  { key: "sustainability", href: "/sustainability" },
  { key: "contact", href: "/contact" },
] as const;

// Matches Tailwind's default xl breakpoint used by the header components.
export const HEADER_DESKTOP_QUERY = "(min-width: 80rem)";

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
