import type { Locale } from "next-intl";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export type JobLanguages = Record<string, readonly Locale[]>;

export function getJobPath(slug: string) {
  return `/jobs/${slug}`;
}

export function getJobUrl(slug: string, locale: Locale) {
  return `${site.url}/${locale}${getJobPath(slug)}`;
}

export function getJobAlternates(slug: string, locales: readonly Locale[]) {
  const available = routing.locales.filter((locale) =>
    locales.includes(locale),
  );
  const defaultLocale = available.includes("cs")
    ? "cs"
    : available.includes("en")
      ? "en"
      : available[0];
  return {
    ...Object.fromEntries(
      available.map((locale) => [locale, getJobUrl(slug, locale)]),
    ),
    ...(defaultLocale && { "x-default": getJobUrl(slug, defaultLocale) }),
  };
}

export function getJobLanguageHref(
  href: string,
  locale: Locale,
  jobs: JobLanguages,
) {
  const url = new URL(href, site.url);
  const match = /^\/jobs\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(url.pathname);
  if (
    match &&
    (!Object.hasOwn(jobs, match[1]) || !jobs[match[1]].includes(locale))
  )
    return `/jobs${url.search}`;
  return href;
}

export function getJobSitemapEntries(jobs: JobLanguages) {
  return Object.entries(jobs).flatMap(([slug, locales]) =>
    routing.locales
      .filter((locale) => locales.includes(locale))
      .map((locale) => ({
        url: getJobUrl(slug, locale),
        alternates: { languages: getJobAlternates(slug, locales) },
      })),
  );
}
