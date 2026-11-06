import type { MetadataRoute } from "next";
import {
  getPageLanguages,
  getPageUrl,
  sitePages,
  type SitePage,
} from "@/lib/site";
import { getJobLanguages } from "@/lib/jobs/reader";
import { getJobSitemapEntries } from "@/lib/jobs/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = (Object.keys(sitePages) as SitePage[]).flatMap((page) =>
    sitePages[page].locales.map((locale) => ({
      url: getPageUrl(page, locale),
      alternates: { languages: getPageLanguages(page) },
    })),
  );
  return [...pages, ...getJobSitemapEntries(await getJobLanguages())];
}
