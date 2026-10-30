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
  careers: { path: "/careers", locales: routing.locales },
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
