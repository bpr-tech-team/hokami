import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { validateJobImage } from "./image-validation";

export async function checkJobImages(
  directory = join(process.cwd(), "public/images/jobs"),
): Promise<number> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return 0;
    throw error;
  }

  let count = 0;
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      count += await checkJobImages(path);
    } else if (entry.isFile()) {
      validateJobImage(entry.name, await readFile(path));
      count++;
    } else {
      throw new Error(`Unexpected job image entry: ${path}`);
    }
  }
  return count;
}
