import type { Locale } from "next-intl";
import { hasJobContent, deserializeJobContent } from "./content";
import {
  isJobAvailable,
  resolveJobCard,
  type JobCardRecord,
  type JobTranslationLocale,
} from "./resolve-job";

export type JobDetailRecord = JobCardRecord & {
  content: string;
  translatedContent: Record<JobTranslationLocale, string>;
};

export function resolveJobDetail(record: JobDetailRecord, locale: Locale) {
  if (!isJobAvailable(record.entry, locale)) return null;
  const translation = locale === "en" ? "" : record.translatedContent[locale];
  const useTranslation = Boolean(
    translation && hasJobContent(deserializeJobContent(translation)),
  );
  return {
    ...resolveJobCard(record, locale),
    body: useTranslation ? translation : record.content,
    bodyLocale: useTranslation ? locale : ("en" as const),
    visibleLocales: record.entry.visibleLocales,
  };
}

export type ResolvedJobDetail = NonNullable<
  ReturnType<typeof resolveJobDetail>
>;
