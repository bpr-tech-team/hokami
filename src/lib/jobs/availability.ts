import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import type { Locale } from "next-intl";
import { routing } from "@/i18n/routing";
import { isJobAvailable, resolveJobCard } from "./resolve-job";

const availabilitySchema = z.object({
  status: z.enum(["draft", "published"]),
  visibleLocales: z.array(z.enum(routing.locales)),
});

const cardTextSchema = z.object({
  title: z.string(),
  department: z.string(),
  description: z.string(),
});
const applicationJobSchema = availabilitySchema.extend({
  ...cardTextSchema.shape,
  order: z.number(),
  translations: z.object({
    cs: cardTextSchema,
    de: cardTextSchema,
    fi: cardTextSchema,
    pl: cardTextSchema,
  }),
});

// Proxy only needs publication metadata, not the CMS editor or Markdoc renderer.
export async function readJobAvailability(
  slug: string,
  directory = join(process.cwd(), "src/content/jobs"),
) {
  const result = availabilitySchema.safeParse(
    await readJobData(slug, directory),
  );
  return result.success ? result.data : null;
}

/** Resolve the same title and translation fallback shown in the public Select. */
export async function readJobApplicationOption(
  slug: string,
  locale: Locale,
  directory = join(process.cwd(), "src/content/jobs"),
) {
  const result = applicationJobSchema.safeParse(
    await readJobData(slug, directory),
  );
  if (!result.success || !isJobAvailable(result.data, locale)) return null;
  return resolveJobCard({ slug, entry: result.data }, locale);
}

async function readJobData(slug: string, directory: string): Promise<unknown> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  try {
    return JSON.parse(
      await readFile(join(directory, slug, "index.json"), "utf8"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
