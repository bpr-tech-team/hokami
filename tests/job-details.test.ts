import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import Markdoc from "@markdoc/markdoc";
import { renderToStaticMarkup } from "react-dom/server";
import { jobContentField } from "../src/lib/jobs/content-field";
import {
  assertJobContent,
  serializeJobContent,
  deserializeJobContent,
} from "../src/lib/jobs/content";
import { readJobDetailRecord } from "../src/lib/jobs/read-jobs";
import { readJobAvailability } from "../src/lib/jobs/availability";
import { resolveJobDetail } from "../src/lib/jobs/resolve-detail";
import {
  renderJobContent,
  safeContentHref,
} from "../src/components/sections/jobs/detail/job-content";
import {
  getJobAlternates,
  getJobLanguageHref,
  getJobSitemapEntries,
} from "../src/lib/jobs/urls";
import {
  jobApplicationSchema,
  getJobApplicationErrors,
  validateJobFiles,
  JOB_FILES_MAX_BYTES,
} from "../src/lib/jobs/application-validation";

test("the mandatory English body rejects empty documents through shared validation and the reader", () => {
  const required = jobContentField({ required: true });
  const optional = jobContentField();
  for (const text of ["", " \n\t", "## \n\n- \n", "---"]) {
    assert.throws(() => assertJobContent(text), /hlavní text/);
    assert.throws(() => required.reader.parse(text), /hlavní text/);
    assert.doesNotThrow(() => optional.reader.parse(text));
  }
  assert.doesNotThrow(() =>
    required.reader.parse("## Responsibilities\n\nWork with our team."),
  );
});

test("details preserve the localized hero and independently fall back to the English body", async () => {
  const record = await readJobDetailRecord("buyer");
  assert.ok(record);
  const czech = resolveJobDetail(record, "cs");
  assert.ok(czech);
  assert.equal(czech.title, "Nákupčí");
  assert.equal(czech.contentLocale, "cs");
  assert.equal(czech.bodyLocale, "en");
  assert.equal(czech.body, record.content);
  assert.ok(deserializeJobContent(czech.body).children.length);
  for (const text of ["", "  \n", "---", "## \n"]) {
    record.translatedContent.cs = serializeJobContent(Markdoc.parse(text));
    assert.equal(resolveJobDetail(record, "cs")?.bodyLocale, "en");
  }
  record.translatedContent.cs = serializeJobContent(
    Markdoc.parse("## Náplň práce\n\nPráce v týmu."),
  );
  assert.equal(resolveJobDetail(record, "cs")?.bodyLocale, "cs");
  assert.equal(resolveJobDetail(record, "en")?.bodyLocale, "en");
  record.entry.translations.cs.title = "";
  assert.equal(resolveJobDetail(record, "cs")?.contentLocale, "en");
  assert.equal(resolveJobDetail(record, "cs")?.bodyLocale, "cs");
});

test("detail records are serializable and draft, missing and disabled versions stay unavailable", async () => {
  const record = await readJobDetailRecord("buyer");
  assert.ok(record);
  assert.deepEqual(JSON.parse(JSON.stringify(record)), record);
  record.entry.visibleLocales = ["de"];
  assert.equal(resolveJobDetail(record, "cs"), null);
  assert.ok(resolveJobDetail(record, "de"));
  record.entry.status = "draft";
  assert.equal(resolveJobDetail(record, "de"), null);
  for (const slug of [
    "missing-job",
    "__empty__",
    "../buyer",
    "buyer/extra",
    "Buyer",
  ]) {
    assert.equal(await readJobDetailRecord(slug), null);
  }
});

test("rich text renders semantic headings, tables, lists and safe links with project typography", () => {
  const markdown =
    "# Heading\n\nA **bold** paragraph and [email](mailto:prace@hokami.cz).\n\n- Item\n  - Nested\n\n> Quote\n\n| Name | Value |\n| --- | --- |\n| One | Two |\n\n```text\nexample\n```";
  const html = renderToStaticMarkup(
    renderJobContent(serializeJobContent(Markdoc.parse(markdown))),
  );
  assert.match(html, /<h2/);
  assert.doesNotMatch(html, /<h1/);
  for (const tag of [
    "strong",
    "ul",
    "blockquote",
    "table",
    "th",
    "td",
    "pre",
    "code",
  ])
    assert.match(html, new RegExp(`<${tag}[ >]`));
  assert.match(html, /href="mailto:prace@hokami.cz"/);
  assert.match(html, /overflow-x-auto/);
  for (const href of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "\tjavascript:alert(1)",
  ])
    assert.equal(safeContentHref(href), undefined);
  for (const href of [
    "/contact",
    "#job-application",
    "https://example.com",
    "mailto:prace@hokami.cz",
    "tel:+420123456789",
  ])
    assert.equal(safeContentHref(href), href);
});

test("language links preserve URL state or return to the selected locale's jobs list", () => {
  const jobs = { buyer: ["cs", "de"] as const };
  const href = "/jobs/buyer?tag=one&tag=two&value=a%2Bb%26c#job-application";
  assert.equal(getJobLanguageHref(href, "de", jobs), href);
  assert.equal(
    getJobLanguageHref(href, "en", jobs),
    "/jobs?tag=one&tag=two&value=a%2Bb%26c",
  );
  assert.equal(
    getJobLanguageHref("/jobs?x=1#positions", "fi", jobs),
    "/jobs?x=1#positions",
  );
  assert.equal(
    getJobLanguageHref("/services/smt?a=1#equipment", "pl", jobs),
    "/services/smt?a=1#equipment",
  );
  assert.equal(
    getJobLanguageHref("/jobs/constructor?x=1#form", "cs", jobs),
    "/jobs?x=1",
  );
});

test("publication metadata can be checked before streaming without loading the editor", async () => {
  const directory = await mkdtemp(join(tmpdir(), "hokami-job-availability-"));
  try {
    await mkdir(join(directory, "example"));
    const file = join(directory, "example/index.json");
    const entry = { status: "published", visibleLocales: ["cs", "de"] };
    await writeFile(
      file,
      JSON.stringify({ ...entry, content: "Not part of the projection" }),
    );
    assert.deepEqual(await readJobAvailability("example", directory), entry);
    await writeFile(file, JSON.stringify({ ...entry, status: "draft" }));
    assert.equal(
      (await readJobAvailability("example", directory))?.status,
      "draft",
    );
    await writeFile(
      file,
      JSON.stringify({ ...entry, visibleLocales: ["unknown"] }),
    );
    assert.equal(await readJobAvailability("example", directory), null);
    assert.equal(await readJobAvailability("../example", directory), null);
    assert.equal(await readJobAvailability("missing", directory), null);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("sitemap and alternates include only enabled job URLs, including English-disabled fallback", () => {
  const entries = getJobSitemapEntries({ buyer: ["de", "pl"], hidden: [] });
  assert.deepEqual(
    entries.map(({ url }) => url),
    ["https://hokami.cz/de/jobs/buyer", "https://hokami.cz/pl/jobs/buyer"],
  );
  assert.equal(
    entries[0].alternates.languages["x-default"],
    "https://hokami.cz/de/jobs/buyer",
  );
  assert.equal(
    getJobAlternates("buyer", ["cs", "en"])["x-default"],
    "https://hokami.cz/cs/jobs/buyer",
  );
  assert.equal(
    getJobAlternates("buyer", ["de", "en"])["x-default"],
    "https://hokami.cz/en/jobs/buyer",
  );
  assert.deepEqual(getJobSitemapEntries({}), []);
});

test("application requires name, email, phone and an available job; message and start are optional", () => {
  const schema = jobApplicationSchema(["buyer"]);
  const valid = {
    name: " Jane Smith ",
    email: "jane@example.com",
    phone: "+49 (30) 123-456",
    job: "buyer",
    start: "",
    message: "",
  };
  assert.equal(schema.parse(valid).name, "Jane Smith");
  const invalid = schema.safeParse({
    ...valid,
    name: "   ",
    email: "invalid",
    phone: "invalid",
    job: "hidden",
  });
  assert.equal(invalid.success, false);
  if (!invalid.success)
    assert.deepEqual(getJobApplicationErrors(invalid.error), {
      name: "nameRequired",
      email: "emailInvalid",
      phone: "phoneInvalid",
      job: "jobInvalid",
    });
  assert.equal(
    schema.safeParse({ ...valid, phone: " + - () " }).success,
    false,
  );
  assert.equal(
    schema.safeParse({ ...valid, message: "x".repeat(5001) }).success,
    false,
  );
});

test("optional PDF and DOCX attachments use a total decimal 4.5 MB limit", () => {
  const pdf = { name: "CV.PDF", size: 2_000_000, type: "application/pdf" };
  const docx = {
    name: "cover.docx",
    size: 2_500_000,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  assert.equal(JOB_FILES_MAX_BYTES, 4_500_000);
  assert.equal(validateJobFiles([]), undefined);
  assert.equal(validateJobFiles([pdf, docx]), undefined);
  assert.equal(
    validateJobFiles([pdf, { ...docx, size: docx.size + 1 }]),
    "filesTooLarge",
  );
  assert.equal(validateJobFiles([{ ...pdf, size: 0 }]), "fileEmpty");
  assert.equal(validateJobFiles([{ ...pdf, type: "image/png" }]), "fileFormat");
  assert.equal(
    validateJobFiles([{ ...pdf, name: "CV.pdf.exe" }]),
    "fileFormat",
  );
  assert.equal(validateJobFiles([{ ...pdf, type: "" }]), undefined);
  assert.equal(
    validateJobFiles([{ ...docx, type: "application/octet-stream" }]),
    undefined,
  );
});
