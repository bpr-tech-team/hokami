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
      ...english,
      status: "published",
      visibleLocales: ["cs", "en", "de", "fi", "pl"],
      order: 10,
      translations: { cs: czech, de: empty, fi: empty, pl: empty },
      ...overrides,
    },
  };
}

test("jobs use the complete requested translation and keep English as the base", () => {
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
      ...english,
      id: "buyer",
      contentLocale: "en",
    });
  }
});

test("an incomplete or whitespace-only translation falls back as a whole card", () => {
  for (const field of ["title", "department", "description"] as const) {
    const job = record();
    job.entry.translations.cs = { ...czech, [field]: "  \n " };
    assert.deepEqual(resolveJobCard(job, "cs"), {
      ...english,
      id: "buyer",
      contentLocale: "en",
    });
  }
});

test("visibility uses selected site languages independently of completed translations", () => {
  const job = record("buyer", { visibleLocales: ["cs", "de"] });
  assert.equal(getPublishedJobCards([job], "cs")[0].title, czech.title);
  for (const locale of ["en", "fi", "pl"] as const) {
    assert.deepEqual(getPublishedJobCards([job], locale), []);
  }
});

test("selected versions can use English fallback while the English version is disabled", () => {
  const job = record("buyer", { visibleLocales: ["de", "pl"] });
  for (const locale of ["de", "pl"] as const) {
    assert.deepEqual(getPublishedJobCards([job], locale), [
      { ...english, id: "buyer", contentLocale: "en" },
    ]);
  }
  assert.deepEqual(getPublishedJobCards([job], "en"), []);
  assert.deepEqual(getPublishedJobCards([job], "cs"), []);
});

test("an empty language selection hides a published vacancy everywhere", () => {
  const job = record("buyer", { visibleLocales: [] });
  for (const locale of ["cs", "en", "de", "fi", "pl"] as const) {
    assert.deepEqual(getPublishedJobCards([job], locale), []);
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
  const job = record("buyer", { title: "Senior buyer" });
  assert.equal(resolveJobCard(job, "en").id, "buyer");
  assert.equal(resolveJobCard(job, "en").title, "Senior buyer");
});

test("the native reader validates mandatory English fields and preserves language selection and WYSIWYG", async () => {
  const repoPath = await mkdtemp(join(tmpdir(), "hokami-jobs-"));
  const directory = join(repoPath, "src/content/jobs/example");
  const entry = JSON.parse(
    await readFile(
      new URL("../src/content/jobs/buyer/index.json", import.meta.url),
      "utf8",
    ),
  );
  entry.content =
    "## Responsibilities\n\n- **Purchasing** materials\n- [Contact](mailto:prace@hokami.cz)\n";
  entry.translations.cs.description = "";
  entry.visibleLocales = ["fi"];
  try {
    await mkdir(directory, { recursive: true });
    const file = join(directory, "index.json");
    const reader = createReader(repoPath, jobsReaderConfig);
    await writeFile(file, JSON.stringify(entry));
    const saved = await reader.collections.jobs.readOrThrow("example");
    assert.ok(saved.content.node.children.length > 0);
    assert.equal(saved.translations.cs.description, "");
    assert.deepEqual(saved.visibleLocales, ["fi"]);

    await writeFile(file, JSON.stringify({ ...entry, visibleLocales: [] }));
    assert.deepEqual(
      (
        await createReader(
          repoPath,
          jobsReaderConfig,
        ).collections.jobs.readOrThrow("example")
      ).visibleLocales,
      [],
    );
    await writeFile(file, JSON.stringify({ ...entry, visibleLocales: ["fr"] }));
    await assert.rejects(
      createReader(repoPath, jobsReaderConfig).collections.jobs.readOrThrow(
        "example",
      ),
    );

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
