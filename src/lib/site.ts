import type { Locale } from "next-intl";
import { routing } from "@/i18n/routing";

export const site = {
  name: "HOKAMI",
  url: "https://hokami.cz",
};

export const sitePages = {
  home: { path: "", locales: routing.locales },
  quality: { path: "/quality", locales: routing.locales },
  about: { path: "/about", locales: routing.locales },
  services: { path: "/services", locales: routing.locales },
  smt: { path: "/services/smt", locales: routing.locales },
  sustainability: { path: "/sustainability", locales: routing.locales },
  contact: { path: "/contact", locales: routing.locales },
  careers: { path: "/jobs", locales: routing.locales },
  // Legal articles currently have Czech content in every language section.
  gdpr: { path: "/gdpr", locales: [routing.defaultLocale] },
  whistleblowing: { path: "/whistleblowing", locales: [routing.defaultLocale] },
} satisfies Record<string, { path: string; locales: readonly Locale[] }>;

export type SitePage = keyof typeof sitePages;

export function getPageUrl(page: SitePage, locale: Locale) {
  return `${site.url}/${locale}${sitePages[page].path}`;
}

export function getPageLanguages(page: SitePage) {
  const { locales } = sitePages[page];

  if (locales.length === 1) return undefined;

  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, getPageUrl(page, locale)]),
    ),
    "x-default": getPageUrl(page, routing.defaultLocale),
  };
}
