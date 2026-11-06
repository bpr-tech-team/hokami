import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ErrorPage } from "../src/components/pages/errors/error-page";
import { errorMessages, resolveErrorLocale } from "../src/i18n/error-messages";
import { routing } from "../src/i18n/routing";

test("error fallbacks resolve supported locales without a translation provider", () => {
  for (const locale of routing.locales) {
    assert.equal(resolveErrorLocale(locale), locale);
  }
  for (const value of [undefined, null, "ru", "constructor", ["de"], 500]) {
    assert.equal(resolveErrorLocale(value), routing.defaultLocale);
  }
  assert.deepEqual(
    Object.keys(errorMessages).sort(),
    [...routing.locales].sort(),
  );
});

test("404 and 500 render localized, accessible fallbacks and native home links", () => {
  for (const locale of routing.locales) {
    for (const status of [404, 500] as const) {
      const messages = errorMessages[locale];
      const content = status === 404 ? messages.notFound : messages.serverError;
      const html = renderToStaticMarkup(
        createElement(ErrorPage, { locale, status }),
      );

      assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
      assert.match(html, /<main id="main-content" tabindex="-1"/);
      assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
      assert.ok(html.includes(content.title));
      assert.ok(html.includes(content.description));
      assert.ok(html.includes(messages.home));
      assert.ok(html.includes(`href="/${locale}"`));
      assert.doesNotMatch(html, /role="button"|<button\b/);
      assert.ok(html.includes(`HTTP ${status}`));
    }
  }
});
