import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "next-intl";
import { JOBS_CACHE_TAG } from "./cache";
import { readJobCardRecords } from "./read-jobs";
import { getPublishedJobCards } from "./resolve-job";

async function readCachedJobs() {
  "use cache";
  cacheLife("hours");
  cacheTag(JOBS_CACHE_TAG);
  return readJobCardRecords();
}

export async function getJobCards(locale: Locale) {
  return getPublishedJobCards(await readCachedJobs(), locale);
}
