import "./keystatic-browser.mts";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Window } from "happy-dom";

const locale = process.env.KEYSTATIC_TEST_UI_LOCALE ?? "cs";
const expectedLabels: Record<string, string[]> = {
  cs: ["cs-CZ", "Odstavec", "Nadpis", "Textový blok"],
  en: ["en-US", "Paragraph", "Heading", "Text block"],
  de: ["de-DE", "Absatz", "Überschrift", "Textblock"],
  fi: ["fi-FI", "Kappale", "Otsikko", "Tekstilohko"],
  pl: ["pl-PL", "Akapit", "Nagłówek", "Blok tekstowy"],
};
const expected = expectedLabels[locale];
assert.ok(expected);
const { fields, config } = await import("@keystatic/core");
const { KeystarProvider } = await import("@keystar/ui/core");
// Use the same browser config context as the editor, rather than a Node stub.
const contextUrl = new URL(
  "../../node_modules/@keystatic/core/dist/index-5d64e651.js",
  import.meta.url,
);
const { a6: ConfigContext } = await import(contextUrl.href);
const field = fields.markdoc.inline({
  label: "Popis",
  options: { heading: [2, 3, 4] },
});
const render = (value: ReturnType<typeof field.defaultValue>) =>
  renderToStaticMarkup(
    // Keystar's provider type requires children in the props object.
    // eslint-disable-next-line react/no-children-prop
    createElement(KeystarProvider, {
      locale: expected[0],
      children: createElement(
        ConfigContext.Provider,
        { value: config({ storage: { kind: "local" }, collections: {} }) },
        createElement(field.Input, {
          value,
          onChange: () => {},
          autoFocus: false,
          forceValidation: false,
        }),
      ),
    }),
  );
const view = new Window();
try {
  view.document.body.innerHTML = render(field.defaultValue());
  const headingPicker = view.document.querySelector(
    `[aria-label="${expected[3]}"]`,
  );
  assert.ok(headingPicker, `${locale}: the text-block control is localized`);
  assert.ok(headingPicker.textContent.includes(expected[1]));
  for (const level of [2, 3, 4]) {
    const heading = field.parse(`${"#".repeat(level)} Content`, {
      other: new Map(),
      external: new Map(),
      slug: undefined,
    });
    view.document.body.innerHTML = render(heading);
    assert.ok(
      view.document
        .querySelector(`[aria-label="${expected[3]}"]`)
        ?.textContent.includes(`${expected[2]} ${level}`),
      `${locale}: heading ${level}`,
    );
  }
  const userText = "Paragraph Edit Unsaved";
  const value = field.parse(userText, {
    other: new Map(),
    external: new Map(),
    slug: undefined,
  });
  assert.equal(
    String(field.serialize(value, { slug: undefined }).value).trim(),
    userText,
  );
} finally {
  await view.happyDOM.close();
}
