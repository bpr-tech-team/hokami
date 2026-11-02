import assert from "node:assert/strict";
import { before, test } from "node:test";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "next-intl";
import { locations, regions } from "../src/components/sections/locations/data";
import cs from "../messages/cs.json";
import en from "../messages/en.json";
import de from "../messages/de.json";
import fi from "../messages/fi.json";
import pl from "../messages/pl.json";

const catalogs = { cs, en, de, fi, pl };

let LocationsSection: typeof import("../src/components/sections/locations/locations-section").LocationsSection;

before(async () => {
  // Node renders markup here; the browser checks the actual animation stylesheet.
  const css = registerHooks({
    load(url, context, nextLoad) {
      return url.endsWith("/locations-motion.css")
        ? { format: "module", source: "", shortCircuit: true }
        : nextLoad(url, context);
    },
  });
  try {
    ({ LocationsSection } =
      await import("../src/components/sections/locations/locations-section"));
  } finally {
    css.deregister();
  }
});

function getContent(locale: keyof typeof catalogs) {
  const t = createTranslator({
    locale,
    messages: catalogs[locale],
    namespace: "Locations",
    onError(error) {
      throw error;
    },
  });

  return {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),
    mapLabel: t("mapLabel"),
    locations: locations.map((location) => ({
      ...location,
      meta: t(`branches.${location.id}`),
    })),
    regions: regions.map((region) => ({
      ...region,
      code: t("regionCode", { code: region.code }),
      title: t(`regions.${region.id}`),
    })),
  };
}

test("all five locales expose every branch and contact in server HTML without JavaScript", () => {
  for (const locale of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    const content = getContent(locale);
    const html = renderToStaticMarkup(createElement(LocationsSection, content));
    assert.ok(html.includes(content.title));
    assert.ok(html.includes(content.description));
    assert.ok(html.includes(`aria-label="${content.mapLabel}"`));
    assert.equal((html.match(/<h3\b/g) ?? []).length, 4);
    assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 10);
    assert.equal((html.match(/<svg\b/g) ?? []).length, 1);
    assert.equal((html.match(/<image\b/g) ?? []).length, 1);
    for (const region of regions) {
      assert.ok(
        html.includes(
          `data-region="${region.id}" data-location="${region.locationId}"`,
        ),
      );
    }

    for (const { city, country } of locations) {
      assert.ok(html.includes(`${city} (${country})`));
    }
    for (const region of regions) {
      for (const contact of region.contacts) {
        assert.ok(html.includes(`href="${contact.href}"`));
        assert.ok(html.includes(contact.label));
      }
    }
    assert.ok(!html.includes("www.figma.com/api/mcp/asset"));
    assert.ok(!html.includes("Locations.branches."));
  }
});

test("reusing the section gives each heading and tooltip independent IDs", () => {
  const content = getContent("en");
  const html = renderToStaticMarkup(
    createElement(
      "main",
      null,
      createElement(LocationsSection, { ...content, id: "first-locations" }),
      createElement(LocationsSection, { ...content, id: "second-locations" }),
    ),
  );
  assert.ok(html.includes('aria-labelledby="first-locations-heading"'));
  assert.ok(html.includes('aria-labelledby="second-locations-heading"'));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
});
