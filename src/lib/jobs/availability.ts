import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { routing } from "@/i18n/routing";

const availabilitySchema = z.object({
  status: z.enum(["draft", "published"]),
  visibleLocales: z.array(z.enum(routing.locales)),
});

// Proxy only needs publication metadata, not the CMS editor or Markdoc renderer.
export async function readJobAvailability(
  slug: string,
  directory = join(process.cwd(), "src/content/jobs"),
) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  try {
    const data: unknown = JSON.parse(
      await readFile(join(directory, slug, "index.json"), "utf8"),
    );
    const result = availabilitySchema.safeParse(data);
    return result.success ? result.data : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
