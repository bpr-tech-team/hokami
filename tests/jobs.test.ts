import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createReader } from "@keystatic/core/reader";
import { jobsReaderConfig } from "../src/lib/jobs/collection";
import {
  getPublishedJobCards,
  resolveJobCard,
  type JobCardRecord,
  type JobCardText,
} from "../src/lib/jobs/resolve-job";

const czech: JobCardText = {
  title: "Nákupčí",
  department: "Obchodní tým",
  description: "Hledáme nového kolegu.",
  linkLabel: "Číst dále: Nákupčí",
};
const english: JobCardText = {
  title: "Buyer",
  department: "Commercial team",
  description: "We are looking for a new colleague.",
  linkLabel: "",
};
const empty: JobCardText = {
  title: "",
  department: "",
  description: "",
  linkLabel: "",
};

function record(
  slug = "buyer",
  overrides: Partial<JobCardRecord["entry"]> = {},
): JobCardRecord {
  return {
    slug,
    entry: {
      ...czech,
      status: "published",
      order: 10,
      translations: { en: english, de: empty, fi: empty, pl: empty },
      ...overrides,
    },
  };
}

test("jobs use the complete requested translation and keep Czech as the base", () => {
  assert.deepEqual(resolveJobCard(record(), "cs"), {
    ...czech,
    id: "buyer",
    contentLocale: "cs",
  });
  assert.deepEqual(resolveJobCard(record(), "en"), {
    ...english,
    id: "buyer",
    contentLocale: "en",
  });
  for (const locale of ["de", "fi", "pl"] as const) {
    assert.deepEqual(resolveJobCard(record(), locale), {
      ...czech,
      id: "buyer",
      contentLocale: "cs",
    });
  }
});

test("an incomplete or whitespace-only translation falls back as a whole card", () => {
  for (const field of ["title", "department", "description"] as const) {
    const job = record();
    job.entry.translations.en = { ...english, [field]: "  \n " };
    assert.deepEqual(resolveJobCard(job, "en"), {
      ...czech,
      id: "buyer",
      contentLocale: "cs",
    });
  }
});

test("hidden jobs are omitted and ties have stable order without mutating input", () => {
  const jobs = [
    record("last", { order: 30 }),
    record("hidden", { status: "draft", order: 0 }),
    record("second", { order: 10 }),
    record("first", { order: 10 }),
  ];
  assert.deepEqual(
    getPublishedJobCards(jobs, "cs").map(({ id }) => id),
    ["first", "second", "last"],
  );
  assert.equal(jobs[0].slug, "last");
  assert.deepEqual(getPublishedJobCards([], "cs"), []);
  assert.deepEqual(
    getPublishedJobCards([record("hidden", { status: "draft" })], "cs"),
    [],
  );
});

test("editing a title keeps the entry's stable identity", () => {
  const job = record("buyer", { title: "Senior nákupčí" });
  assert.equal(resolveJobCard(job, "cs").id, "buyer");
  assert.equal(resolveJobCard(job, "cs").title, "Senior nákupčí");
});

test("the native reader validates mandatory Czech fields and preserves WYSIWYG content", async () => {
  const repoPath = await mkdtemp(join(tmpdir(), "hokami-jobs-"));
  const directory = join(repoPath, "src/content/jobs/example");
  const entry = JSON.parse(
    await readFile(
      new URL("../src/content/jobs/buyer/index.json", import.meta.url),
      "utf8",
    ),
  );
  entry.content =
    "## Náplň práce\n\n- **Nákup** materiálu\n- [Kontakt](mailto:prace@hokami.cz)\n";
  entry.translations.en.description = "";
  try {
    await mkdir(directory, { recursive: true });
    const file = join(directory, "index.json");
    const reader = createReader(repoPath, jobsReaderConfig);
    await writeFile(file, JSON.stringify(entry));
    const saved = await reader.collections.jobs.readOrThrow("example");
    assert.ok(saved.content.node.children.length > 0);
    assert.equal(saved.translations.en.description, "");

    for (const field of ["title", "department", "description"] as const) {
      await writeFile(file, JSON.stringify({ ...entry, [field]: "  " }));
      await assert.rejects(
        createReader(repoPath, jobsReaderConfig).collections.jobs.readOrThrow(
          "example",
        ),
      );
    }
    await writeFile(file, JSON.stringify({ ...entry, order: -1 }));
    await assert.rejects(
      createReader(repoPath, jobsReaderConfig).collections.jobs.readOrThrow(
        "example",
      ),
    );
  } finally {
    await rm(repoPath, { recursive: true, force: true });
  }
});
