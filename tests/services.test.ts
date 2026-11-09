import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { createTranslator } from "next-intl";
import cs from "../messages/cs.json";
import de from "../messages/de.json";
import en from "../messages/en.json";
import fi from "../messages/fi.json";
import pl from "../messages/pl.json";
import { services } from "../src/components/sections/services/overview/data";
import { serviceImages } from "../src/components/sections/services/detail/images";
import { serviceStatistics } from "../src/components/sections/services/detail/data";
import { pcbSpecificationFields } from "../src/components/sections/services/pcb/data";
import { smtStencilCapabilities } from "../src/components/sections/services/smt-stencils/data";
import originalSpecifications from "./fixtures/service-specifications.json";
import { prepareStatistic } from "../src/components/sections/trust-strip/format-statistic";
import { routing } from "../src/i18n/routing";
import { getPageLanguages, getPageUrl, sitePages } from "../src/lib/site";

const namespaces = [
  "Pcb",
  "Tht",
  "Cleaning",
  "Testing",
  "Coating",
  "MechanicalAssembly",
  "SmtStencils",
] as const;
type MessageTree = { [key: string]: string | MessageTree };

function flatten(tree: MessageTree, prefix = ""): Map<string, string> {
  const entries = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") entries.set(path, value);
    else
      for (const [nested, text] of flatten(value, path))
        entries.set(nested, text);
  }
  return entries;
}

test("every service has complete, renderable translations with matching arguments", () => {
  const catalogs = { cs, en, de, fi, pl };
  for (const locale of routing.locales) {
    const messages = catalogs[locale];
    for (const namespace of namespaces) {
      const expected = flatten(cs[namespace]);
      const translated = flatten(messages[namespace]);
      assert.deepEqual(
        [...translated.keys()].sort(),
        [...expected.keys()].sort(),
        `${locale}/${namespace}`,
      );
      for (const [key, value] of translated) {
        assert.ok(value.trim(), `${locale}/${namespace}.${key} is empty`);
        const argumentsOf = (text: string) =>
          [...text.matchAll(/\{(\w+)(?:,|\})/g)]
            .map((match) => match[1])
            .sort();
        assert.deepEqual(
          argumentsOf(value),
          argumentsOf(expected.get(key) ?? ""),
          `${locale}/${namespace}.${key}`,
        );
        const t = createTranslator({
          locale,
          messages: { text: value },
          onError(error) {
            throw error;
          },
        });
        assert.ok(
          t("text", {
            ...Object.fromEntries(argumentsOf(value).map((name) => [name, 1])),
            model: "MODEL",
            fixture: "FIXTURE",
          }).trim(),
        );
        if (locale !== "cs" && value.length > 150) {
          assert.notEqual(
            value,
            expected.get(key),
            `${locale}/${namespace}.${key} retains Czech prose`,
          );
        }
      }
    }
  }
});

test("overview service destinations have routes, metadata and all language alternates", () => {
  for (const { slug } of services) {
    const path = `/services/${slug}`;
    assert.ok(
      existsSync(
        new URL(`../src/app/[locale]${path}/page.tsx`, import.meta.url),
      ),
      path,
    );
    const entry = Object.entries(sitePages).find(
      ([, page]) => page.path === path,
    );
    assert.ok(entry, `${path} must be registered in the sitemap`);
    const [key, page] = entry;
    assert.deepEqual(page.locales, routing.locales);
    for (const messages of [cs, en, de, fi, pl]) {
      const metadata = Object.entries(messages.Metadata).find(
        ([id]) => id === key,
      )?.[1];
      assert.ok(
        metadata?.title && metadata.description,
        `${key} has no metadata`,
      );
    }
  }
  assert.equal(getPageUrl("pcb", "en"), "https://hokami.cz/en/services/pcb");
  assert.equal(
    Object.entries(getPageLanguages("smtStencils") ?? {}).find(
      ([locale]) => locale === "fi",
    )?.[1],
    "https://hokami.cz/fi/services/smt-stencils",
  );
});

test("service ranges, dimensions and decimal values retain precision in every locale", () => {
  for (const locale of routing.locales) {
    const decimal = locale === "en" ? "." : ",";
    const pcb = serviceStatistics.pcb.map(
      (item) =>
        prepareStatistic({ ...item, label: item.id }, locale).formattedValue,
    );
    assert.deepEqual(pcb, [
      `0${decimal}2–3${decimal}2 mm`,
      "17–105 µm",
      `0${decimal}08 mm`,
      `0${decimal}08 mm`,
    ]);
    const stencils = serviceStatistics.stencils.map(
      (item) =>
        prepareStatistic({ ...item, label: item.id }, locale).formattedValue,
    );
    assert.deepEqual(stencils, [
      "24",
      "600 × 720",
      `0${decimal}05 mm`,
      `0${decimal}50 mm`,
    ]);
  }
});

test("all thirteen service photo slots reference existing local files", () => {
  const images = Object.values(serviceImages).flatMap((group) =>
    Object.values(group),
  );
  assert.equal(images.length, 13);
  for (const src of images) {
    assert.ok(src.startsWith("/images/services/"));
    assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), src);
  }
});

test("numeric specifications preserve text, spacing and precision in every locale", () => {
  const catalogs = { cs, en, de, fi, pl };
  for (const locale of routing.locales) {
    const t = createTranslator({
      locale,
      messages: catalogs[locale],
      onError(error) {
        throw error;
      },
    });
    for (const { id, parameters } of pcbSpecificationFields) {
      const expected = Object.entries(originalSpecifications[locale].pcb).find(
        ([field]) => field === id,
      );
      if (expected)
        assert.equal(
          t(`Pcb.specifications.${id}.value`, parameters),
          expected[1],
          `${locale}/Pcb.${id}`,
        );
    }
    const { width, heights, thickness } = smtStencilCapabilities;
    assert.equal(
      t("SmtStencils.specifications.size.value", {
        width,
        firstHeight: heights[0],
        secondHeight: heights[1],
      }),
      originalSpecifications[locale].stencils.size,
      `${locale}/SmtStencils.size`,
    );
    assert.equal(
      t("SmtStencils.specifications.thickness.value", {
        minimum: thickness.minimum,
        maximum: thickness.maximum,
        standardThicknesses: thickness.standard
          .map((value) =>
            t("SmtStencils.specifications.thickness.item", { value }),
          )
          .join(", "),
      }),
      originalSpecifications[locale].stencils.thickness,
      `${locale}/SmtStencils.thickness`,
    );
  }
});

test("PCB specification fields retain the original row order", () => {
  assert.deepEqual(
    pcbSpecificationFields.map(({ id }) => id),
    [
      "layers",
      "material",
      "thickness",
      "copper",
      "track",
      "gap",
      "drilling",
      "mask",
      "printing",
      "finish",
      "outline",
      "inspection",
      "quality",
      "stencils",
    ],
  );
});
