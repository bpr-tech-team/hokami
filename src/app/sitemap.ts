import type { MetadataRoute } from "next";
import {
  getPageLanguages,
  getPageUrl,
  sitePages,
  type SitePage,
} from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(sitePages) as SitePage[]).flatMap((page) =>
    sitePages[page].locales.map((locale) => ({
      url: getPageUrl(page, locale),
      alternates: { languages: getPageLanguages(page) },
    })),
  );
}
