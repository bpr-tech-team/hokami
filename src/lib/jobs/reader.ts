import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "next-intl";
import { JOBS_CACHE_TAG } from "./cache";
import { readJobCardRecords, readJobDetailRecord } from "./read-jobs";
import { getPublishedJobCards } from "./resolve-job";
import { resolveJobDetail } from "./resolve-detail";
import type { JobLanguages } from "./urls";

async function readCachedJobs() {
  "use cache";
  cacheLife("hours");
  cacheTag(JOBS_CACHE_TAG);
  return readJobCardRecords();
}

export async function getJobCards(locale: Locale) {
  return getPublishedJobCards(await readCachedJobs(), locale);
}

async function readCachedJob(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(JOBS_CACHE_TAG);
  return readJobDetailRecord(slug);
}

export async function getJobDetail(slug: string, locale: Locale) {
  const record = await readCachedJob(slug);
  return record ? resolveJobDetail(record, locale) : null;
}

export async function getJobLanguages(): Promise<JobLanguages> {
  return Object.fromEntries(
    (await readCachedJobs())
      .filter(
        ({ entry }) =>
          entry.status === "published" && entry.visibleLocales.length > 0,
      )
      .map(({ slug, entry }) => [slug, entry.visibleLocales]),
  );
}
