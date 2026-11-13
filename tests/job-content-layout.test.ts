import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import Markdoc from "@markdoc/markdoc";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { assertJobLayout } from "../src/lib/jobs/content-layout";
import { assertJobContent, serializeJobContent } from "../src/lib/jobs/content";
import { JobContent } from "../src/components/sections/jobs/detail/job-content";
import { jobContentField } from "../src/lib/jobs/content-field";
import { readJobDetailRecord } from "../src/lib/jobs/read-jobs";
import { resolveJobDetail } from "../src/lib/jobs/resolve-detail";
import { Window } from "happy-dom";

const layout = `{% JobSection id="first" tone="default" %}
{% JobColumn %}
## Responsibilities
{% JobChecklist %}
- First **approved** responsibility
- Second responsibility
{% /JobChecklist %}
{% /JobColumn %}
{% JobColumn %}
{% JobPhoto src="/images/jobs/example.webp" alt="Production area" /%}
{% /JobColumn %}
{% /JobSection %}

{% JobSection id="second" tone="subtle" %}
{% JobColumn %}
## Requirements
- A requirement
{% /JobColumn %}
{% JobColumn %}
## What we offer
An approved condition with an [email](mailto:prace@hokami.cz).
{% /JobColumn %}
{% /JobSection %}`;

test("layout sections render full-width surfaces with independent columns, project typography and photo decoration", () => {
  assert.doesNotThrow(() => assertJobLayout(layout));
  const html = renderToStaticMarkup(
    createElement(JobContent, {
      body: serializeJobContent(Markdoc.parse(layout)),
      locale: "en",
    }),
  );
  assert.equal((html.match(/<section /g) ?? []).length, 2);
  assert.equal((html.match(/desktop:grid-cols-2/g) ?? []).length, 2);
  assert.equal((html.match(/<h2 /g) ?? []).length, 3);
  for (const expected of [
    "bg-surface-default",
    "bg-surface-subtle",
    "max-w-content",
    "font-display",
    "desktop:text-[52px]",
    "text-base",
    "leading-body",
    "border-border-subtle",
    "check.svg",
    "aspect-3/2",
    'data-photo-corner="bottom-left"',
    'data-photo-corner="top-right"',
    'alt="Production area"',
    'lang="en"',
    'href="mailto:prace@hokami.cz"',
    "<strong>",
  ])
    assert.ok(html.includes(expected), expected);
  assert.doesNotMatch(
    html,
    /figma\.com|Identifikátor sekce|data-keystatic-editor/,
  );
});

test("legacy content and structured sections coexist without extra section padding or invalid nesting", () => {
  const mixed = `An introductory paragraph.\n\n${layout}\n\nA closing paragraph.`;
  const html = renderToStaticMarkup(
    createElement(JobContent, {
      body: serializeJobContent(Markdoc.parse(mixed)),
      locale: "cs",
    }),
  );
  assert.equal((html.match(/<section /g) ?? []).length, 4);
  assert.ok(
    html.indexOf("An introductory paragraph") <
      html.indexOf("Responsibilities"),
  );
  assert.ok(
    html.indexOf("A closing paragraph") > html.indexOf("What we offer"),
  );
  const legacy = renderToStaticMarkup(
    createElement(JobContent, {
      body: serializeJobContent(Markdoc.parse("## Title\n\nText.\n\n1. Item")),
      locale: "en",
    }),
  );
  assert.equal((legacy.match(/<section /g) ?? []).length, 1);
  assert.match(legacy, /<ol>/);
});

test("adjacent job checklists share the fact grid without losing rich text, links or trailing content", () => {
  const body = `{% JobSection id="requirements-and-offer" tone="subtle" %}
{% JobColumn %}
## Requirements
{% JobChecklist %}
- First **approved** requirement
- Contact [our team](mailto:prace@hokami.cz)
{% /JobChecklist %}
Additional information after the list.
{% /JobColumn %}
{% JobColumn %}
## What we offer
{% JobChecklist %}
- One benefit
- Second benefit
- Third benefit
{% /JobChecklist %}
{% /JobColumn %}
{% /JobSection %}`;
  const window = new Window();
  window.document.body.innerHTML = renderToStaticMarkup(
    createElement(JobContent, {
      body: serializeJobContent(Markdoc.parse(body)),
      locale: "en",
    }),
  );
  const section = window.document.querySelector("#requirements-and-offer");
  assert.ok(section);
  assert.equal(section.querySelectorAll("[data-fact-list-grid]").length, 1);
  assert.deepEqual(
    [...section.querySelectorAll("li")].map((item) => item.textContent),
    [
      "First approved requirement",
      "Contact our team",
      "One benefit",
      "Second benefit",
      "Third benefit",
    ],
  );
  assert.equal(section.querySelector("strong")?.textContent, "approved");
  assert.equal(
    section.querySelector("a")?.getAttribute("href"),
    "mailto:prace@hokami.cz",
  );
  assert.ok(
    section.textContent.includes("Additional information after the list."),
  );
  assert.ok(
    [...section.querySelectorAll("li")].every((item) =>
      item.textContent.trim(),
    ),
  );
  window.happyDOM.cancelAsync();
});

test("invalid column structure, nested sections, backgrounds and incomplete photos fail save and reader validation", () => {
  const field = jobContentField();
  for (const invalid of [
    "{% JobSection %}Text{% /JobSection %}",
    "{% JobColumn %}Text{% /JobColumn %}",
    layout.replace('tone="default"', 'tone="inverse"'),
    layout.replace(
      "{% JobColumn %}\n## Responsibilities",
      "{% JobColumn %}\n{% JobSection %}\n{% JobColumn %}Nested{% /JobColumn %}\n{% /JobSection %}\n## Responsibilities",
    ),
    layout.replace('alt="Production area"', 'alt="   "'),
    layout.replace(
      "/images/jobs/example.webp",
      "https://example.com/photo.webp",
    ),
    "{% JobChecklist %}\n1. Ordered\n{% /JobChecklist %}",
  ]) {
    assert.throws(() => assertJobLayout(invalid));
    assert.throws(() => field.reader.parse(invalid));
  }
  const empty = "{% JobSection %}\n{% JobColumn /%}\n{% /JobSection %}";
  assert.doesNotThrow(() => assertJobLayout(empty));
  assert.doesNotThrow(() =>
    assertJobLayout("{% JobPhoto /%}", { checkContent: false }),
  );
  assert.throws(() =>
    assertJobLayout("{% JobColumn /%}", { checkContent: false }),
  );
  assert.throws(() => assertJobContent(empty));
  assert.doesNotThrow(() =>
    assertJobContent(
      '{% JobPhoto src="/images/jobs/photo.png" alt="Photo" /%}',
    ),
  );
});

test("structured translations and empty section fallback preserve the existing language rules", async () => {
  const job = await readJobDetailRecord("buyer");
  assert.ok(job);
  job.translatedContent.cs = serializeJobContent(Markdoc.parse(layout));
  assert.equal(resolveJobDetail(job, "cs")?.bodyLocale, "cs");
  job.translatedContent.cs = serializeJobContent(
    Markdoc.parse("{% JobSection %}\n{% JobColumn /%}\n{% /JobSection %}"),
  );
  assert.equal(resolveJobDetail(job, "cs")?.bodyLocale, "en");
});

test("native editor insertion, cross-locale clipboard and translation visibility preserve content and assets", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "tests/fixtures/job-editor.mts"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("the real Keystatic toolbar hides moved commands, preserves links and orders insert items", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "tests/fixtures/job-editor-toolbar.mts"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
