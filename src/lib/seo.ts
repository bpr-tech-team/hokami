import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getPageLanguages,
  getPageUrl,
  site,
  sitePages,
  type SitePage,
} from "./site";

const openGraphLocales: Record<Locale, string> = {
  cs: "cs_CZ",
  en: "en_GB",
  de: "de_DE",
  fi: "fi_FI",
  pl: "pl_PL",
};

export async function getPageMetadata(page: SitePage): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const fullTitle = `${title} | ${site.name}`;
  const contentLocales: readonly Locale[] = sitePages[page].locales;
  const contentLocale = contentLocales.includes(locale)
    ? locale
    : contentLocales[0];
  const url = getPageUrl(page, contentLocale);
  const image = {
    url: "/images/social/og.png",
    width: 1200,
    height: 630,
    alt: site.name,
  };

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: getPageLanguages(page),
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description,
      url,
      locale: openGraphLocales[contentLocale],
      alternateLocale: contentLocales
        .filter((alternate) => alternate !== contentLocale)
        .map((alternate) => openGraphLocales[alternate]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
