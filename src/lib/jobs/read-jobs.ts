import { createReader } from "@keystatic/core/reader";
import { jobsReaderConfig } from "./collection";
import type { JobCardRecord, JobCardText } from "./resolve-job";
import { serializeJobContent } from "./content";
import type { JobDetailRecord } from "./resolve-detail";

export const jobsReader = createReader(process.cwd(), jobsReaderConfig);

export async function readJobDetailRecord(
  slug: string,
): Promise<JobDetailRecord | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const entry = await jobsReader.collections.jobs.read(slug);
  if (!entry) return null;
  if (entry.order === null) throw new Error(`Job ${slug} must have an order.`);
  return {
    slug,
    entry: {
      ...cardText(entry),
      status: entry.status,
      visibleLocales: entry.visibleLocales,
      order: entry.order,
      translations: {
        cs: cardText(entry.translations.cs),
        de: cardText(entry.translations.de),
        fi: cardText(entry.translations.fi),
        pl: cardText(entry.translations.pl),
      },
    },
    content: serializeJobContent(entry.content.node),
    translatedContent: {
      cs: serializeJobContent(entry.translations.cs.content.node),
      de: serializeJobContent(entry.translations.de.content.node),
      fi: serializeJobContent(entry.translations.fi.content.node),
      pl: serializeJobContent(entry.translations.pl.content.node),
    },
  };
}

function cardText(entry: JobCardText): JobCardText {
  return {
    title: entry.title,
    department: entry.department,
    description: entry.description,
  };
}

export async function readJobCardRecords(): Promise<JobCardRecord[]> {
  const records = await jobsReader.collections.jobs.all();

  // Keep WYSIWYG ASTs out of the card cache and the public React payload.
  return records.map(({ slug, entry }) => {
    if (entry.order === null) {
      throw new Error(`Job ${slug} must have an order.`);
    }

    return {
      slug,
      entry: {
        ...cardText(entry),
        status: entry.status,
        visibleLocales: entry.visibleLocales,
        order: entry.order,
        translations: {
          cs: cardText(entry.translations.cs),
          de: cardText(entry.translations.de),
          fi: cardText(entry.translations.fi),
          pl: cardText(entry.translations.pl),
        },
      },
    };
  });
}
