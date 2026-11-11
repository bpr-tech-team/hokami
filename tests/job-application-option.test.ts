import assert from "node:assert/strict";
import { mkdtemp, writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { readJobApplicationOption } from "../src/lib/jobs/availability";

test("application labels share the public vacancy's translation fallback and availability", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "hokami-application-option-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, "engineer"));
  const text = {
    title: "Engineer",
    department: "Technology",
    description: "Join us.",
  };
  const entry = {
    ...text,
    status: "published",
    order: 0,
    visibleLocales: ["cs", "en", "de"],
    translations: {
      cs: { ...text, title: "Inženýr" },
      de: { ...text, title: "Ingenieur", description: "" },
      fi: text,
      pl: text,
    },
  };
  const file = join(directory, "engineer/index.json");
  await writeFile(file, JSON.stringify(entry));
  assert.equal(
    (await readJobApplicationOption("engineer", "cs", directory))?.title,
    "Inženýr",
  );
  assert.equal(
    (await readJobApplicationOption("engineer", "de", directory))?.title,
    "Engineer",
  );
  assert.equal(
    await readJobApplicationOption("engineer", "fi", directory),
    null,
  );
  assert.equal(
    await readJobApplicationOption("missing", "en", directory),
    null,
  );
  assert.equal(
    await readJobApplicationOption("../engineer", "en", directory),
    null,
  );
  await writeFile(file, JSON.stringify({ ...entry, status: "draft" }));
  assert.equal(
    await readJobApplicationOption("engineer", "en", directory),
    null,
  );
});
