import type { Entry } from "@keystatic/core/reader";
import type { Locale } from "next-intl";
import type { jobsCollection } from "./collection";

type JobEntry = Entry<typeof jobsCollection>;
export type JobCardText = Pick<
  JobEntry,
  "title" | "department" | "description" | "linkLabel"
>;
export type JobTranslationLocale = Exclude<Locale, "en">;

export type JobCardRecord = {
  slug: string;
  entry: JobCardText &
    Pick<JobEntry, "status" | "visibleLocales"> & {
      order: number;
      translations: Record<JobTranslationLocale, JobCardText>;
    };
};

export type ResolvedJobCard = JobCardText & {
  id: string;
  contentLocale: Locale;
};

export function isJobAvailable(
  entry: Pick<JobEntry, "status" | "visibleLocales">,
  locale: Locale,
) {
  return entry.status === "published" && entry.visibleLocales.includes(locale);
}

function isCompleteTranslation(text: JobCardText) {
  return [text.title, text.department, text.description].every(
    (value) => value.trim().length > 0,
  );
}

export function resolveJobCard(
  { slug, entry }: JobCardRecord,
  locale: Locale,
): ResolvedJobCard {
  const translation = locale === "en" ? null : entry.translations[locale];
  const useTranslation = translation && isCompleteTranslation(translation);
  const text = useTranslation ? translation : entry;

  return {
    id: slug,
    contentLocale: useTranslation ? locale : "en",
    title: text.title.trim(),
    department: text.department.trim(),
    description: text.description.trim(),
    linkLabel: text.linkLabel.trim(),
  };
}

export function getPublishedJobCards(
  records: readonly JobCardRecord[],
  locale: Locale,
) {
  return records
    .filter(({ entry }) => isJobAvailable(entry, locale))
    .sort(
      (a, b) =>
        a.entry.order - b.entry.order ||
        (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0),
    )
    .map((record) => resolveJobCard(record, locale));
}
