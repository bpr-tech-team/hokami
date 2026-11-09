import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdoc from "@markdoc/markdoc";
import {
  jobEmbedSource,
  jobEmbedSandbox,
  readIframeEmbed,
} from "../src/lib/jobs/embed";
import { assertJobLayout } from "../src/lib/jobs/content-layout";
import { assertJobContent, serializeJobContent } from "../src/lib/jobs/content";
import { JobContent } from "../src/components/sections/jobs/detail/job-content";

const iframe =
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/example?x=1&amp;y=2" title="Company video" allowfullscreen></iframe>';

test("embed input accepts HTTPS URLs and extracts only the iframe source and title", () => {
  assert.equal(
    jobEmbedSource(" https://video.example/embed/123 "),
    "https://video.example/embed/123",
  );
  assert.deepEqual(readIframeEmbed(iframe), {
    src: "https://www.youtube.com/embed/example?x=1&y=2",
    title: "Company video",
  });
  assert.equal(
    jobEmbedSource(iframe),
    "https://www.youtube.com/embed/example?x=1&y=2",
  );
  for (const source of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "http://video.example/",
    "https://user:password@video.example/",
    '<iframe srcdoc="hello"></iframe>',
    '<iframe src="https://video.example/">',
    iframe + "<script>alert(1)</script>",
    "<div>hello</div>",
  ])
    assert.throws(() => jobEmbedSource(source));
  assert.equal(readIframeEmbed("Ordinary text"), null);
});

test("embed validation requires a source and accessible title and counts an embed as body content", () => {
  const valid =
    '{% JobEmbed src="https://video.example/embed/123" title="Company video" /%}';
  assert.doesNotThrow(() => assertJobLayout(valid));
  assert.doesNotThrow(() => assertJobContent(valid));
  for (const invalid of [
    "{% JobEmbed /%}",
    '{% JobEmbed src="javascript:alert(1)" title="Video" /%}',
    '{% JobEmbed src="https://video.example/" title=" " /%}',
  ])
    assert.throws(() => assertJobLayout(invalid));
  assert.doesNotThrow(() =>
    assertJobLayout("{% JobEmbed /%}", { checkContent: false }),
  );
});

test("both structured embeds and an existing literal iframe render responsive isolated frames", () => {
  for (const source of [
    iframe,
    '{% JobEmbed src="https://www.youtube.com/embed/example?x=1&y=2" title="Company video" /%}',
  ]) {
    const html = renderToStaticMarkup(
      createElement(JobContent, {
        body: serializeJobContent(Markdoc.parse(source)),
        locale: "en",
      }),
    );
    assert.match(html, /<iframe /);
    assert.match(html, /title="Company video"/);
    assert.match(html, /loading="lazy"/);
    assert.match(html, /aspect-video/);
    assert.match(
      html,
      /sandbox="allow-scripts allow-same-origin allow-presentation"/,
    );
    assert.doesNotMatch(html, /width="560"|height="315"/);
  }
  assert.equal(
    jobEmbedSandbox("https://widgets.example/"),
    "allow-scripts allow-presentation",
  );
  assert.equal(
    jobEmbedSandbox("https://youtube.com.evil.example/"),
    "allow-scripts allow-presentation",
  );
});
