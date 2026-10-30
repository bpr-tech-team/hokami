import type { Locale } from "next-intl";

export const headerNavigation = [
  { key: "industries", href: "/#industries" },
  { key: "capabilities", href: "/#capabilities" },
  { key: "process", href: "/#process" },
  { key: "quality", href: "/quality" },
  { key: "about", href: "/about" },
  { key: "careers", href: "/careers" },
] as const;

export const headerLanguages: { locale: Locale; code: string; name: string }[] =
  [
    { locale: "cs", code: "CS", name: "Čeština" },
    { locale: "en", code: "EN", name: "English" },
    { locale: "de", code: "DE", name: "Deutsch" },
    { locale: "fi", code: "FI", name: "Suomi" },
    { locale: "pl", code: "PL", name: "Polski" },
  ];

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

export type HeaderLocation = {
  pathname: string;
  search: string;
  hash: string;
};

export type HeaderNavProps = HeaderProps & {
  location: HeaderLocation;
};
