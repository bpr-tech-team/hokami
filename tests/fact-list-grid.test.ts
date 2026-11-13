import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Window } from "happy-dom";
import { FactListGrid } from "../src/components/sections/fact-list/fact-list-grid";
import { DocumentLink } from "../src/components/sections/about/documents/document-link";

test("a split fact list preserves reading order and never invents an item to fill a column", () => {
  const items = Array.from({ length: 9 }, (_, index) => ({
    id: `item-${index}`,
    content: createElement("p", null, `Item ${index + 1}`),
  }));
  const window = new Window();
  window.document.body.innerHTML = renderToStaticMarkup(
    createElement(FactListGrid, { items, columns: 2 }),
  );
  assert.deepEqual(
    [...window.document.querySelectorAll("li")].map((item) => item.textContent),
    items.map((_, index) => `Item ${index + 1}`),
  );
  assert.equal(window.document.querySelectorAll("li:empty").length, 0);
  assert.equal(window.document.querySelectorAll("ul").length, 1);
  assert.equal(
    renderToStaticMarkup(createElement(FactListGrid, { items: [] })),
    "",
  );
  window.happyDOM.cancelAsync();
});

test("plain grouped rows open documents in a new tab without checklist decoration", () => {
  const html = renderToStaticMarkup(
    createElement(FactListGrid, {
      columns: 2,
      decoration: "none",
      groups: [
        {
          id: "certificates",
          header: [createElement("h3", { key: "title" }, "Certificates")],
          items: [
            {
              id: "iso",
              content: createElement(DocumentLink, {
                href: "/documents/about/iqnet.pdf",
                label: "ISO certificate",
                openLabel: "ISO certificate (PDF, opens in a new tab)",
              }),
            },
          ],
        },
        {
          id: "grants",
          header: [createElement("h3", { key: "title" }, "Grants")],
          after: createElement("p", null, "No current documents."),
        },
      ],
    }),
  );
  const window = new Window();
  window.document.body.innerHTML = html;
  const link = window.document.querySelector("a");
  assert.equal(link?.getAttribute("href"), "/documents/about/iqnet.pdf");
  assert.equal(link?.hasAttribute("download"), false);
  assert.equal(link?.getAttribute("target"), "_blank");
  assert.equal(link?.getAttribute("rel"), "noopener noreferrer");
  assert.equal(
    link?.getAttribute("aria-label"),
    "ISO certificate (PDF, opens in a new tab)",
  );
  assert.equal(window.document.querySelectorAll("li").length, 1);
  assert.ok(window.document.body.textContent.includes("No current documents."));
  assert.doesNotMatch(html, /services\/check\.svg/);
  window.happyDOM.cancelAsync();
});
