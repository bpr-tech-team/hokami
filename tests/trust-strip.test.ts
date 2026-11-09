import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "next-intl";
import { prepareStatistic } from "../src/components/sections/trust-strip/format-statistic";
import { getStatLayout } from "../src/components/sections/trust-strip/stat-layout";
import { TrustStrip } from "../src/components/sections/trust-strip/trust-strip";
import cs from "../messages/cs.json";
import en from "../messages/en.json";
import de from "../messages/de.json";
import fi from "../messages/fi.json";
import pl from "../messages/pl.json";

test("compact statistics retain their numeric value while moving units into the label", () => {
  const statistic = {
    id: "dimensions",
    value: 810,
    label: "Maximum board dimensions",
    additionalValues: [{ id: "height", value: 480, prefix: " × " }],
    suffix: " mm",
    accessibleValue: "810 by 480 millimetres",
    compact: { label: "mm, maximum board dimensions", suffix: "" },
  };
  for (const locale of ["cs", "en", "de", "fi", "pl"]) {
    const prepared = prepareStatistic(statistic, locale);
    assert.equal(prepared.value, 810);
    assert.equal(prepared.formattedValue, "810 × 480 mm");
    assert.equal(prepared.compact?.formattedValue, "810 × 480");
    assert.equal(prepared.compact?.label, "mm, maximum board dimensions");
    assert.equal(prepared.accessibleValue, "810 by 480 millimetres");
    assert.equal(prepared.supportsAnimation, true);
  }
  assert.equal(statistic.suffix, " mm");
  assert.equal(
    prepareStatistic({ id: "plain", value: 4, label: "Lines" }, "en").compact,
    undefined,
  );
});

test("compound statistics localize every numeric part and reject non-finite parts", () => {
  const statistic = {
    id: "dimensions",
    value: 1234.5,
    label: "Dimensions",
    format: { minimumFractionDigits: 1 },
    additionalValues: [
      { id: "height", value: -2500.5, prefix: " × " },
      { id: "depth", value: 0, prefix: " × " },
    ],
    suffix: " mm",
  };
  for (const locale of ["cs", "en", "de", "fi", "pl"]) {
    const formatter = new Intl.NumberFormat(locale, statistic.format);
    assert.equal(
      prepareStatistic(statistic, locale).formattedValue,
      `${formatter.format(1234.5)} × ${formatter.format(-2500.5)} × ${formatter.format(0)} mm`,
    );
  }
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.throws(
      () =>
        prepareStatistic(
          {
            ...statistic,
            additionalValues: [{ id: "invalid", value, prefix: " × " }],
          },
          "en",
        ),
      RangeError,
    );
  }
});

test("compound statistics render separate rolling numbers with one accessible value", () => {
  const statistic = {
    id: "dimensions",
    value: 810,
    label: "Dimensions",
    additionalValues: [{ id: "height", value: 480, prefix: " × " }],
    suffix: " mm",
    accessibleValue: "810 by 480 millimetres",
  };
  const props = { "aria-label": "Statistics", locale: "en" };
  const markup = renderToStaticMarkup(
    createElement(TrustStrip, { ...props, items: [statistic] }),
  );
  assert.equal((markup.match(/<number-flow-react[ >]/g) ?? []).length, 2);
  assert.equal(
    (markup.match(/class="sr-only">810 by 480 millimetres<\/span>/g) ?? [])
      .length,
    1,
  );
  assert.ok(markup.includes("810 × 480 mm"));
  const unsupported = renderToStaticMarkup(
    createElement(TrustStrip, {
      ...props,
      items: [{ ...statistic, format: { notation: "scientific" } }],
    }),
  );
  assert.ok(!unsupported.includes("<number-flow-react"));
  assert.ok(unsupported.includes("8.1E2 × 4.8E2 mm"));
});

test("statistics balance arbitrary item counts and fill every row", () => {
  for (const columns of [1, 2, 3, 4] as const) {
    for (let count = 0; count <= 100; count++) {
      const layout = getStatLayout(count, columns);
      assert.equal(layout.length, count);
      const rows: number[] = [];
      let rowWidth = 0;
      let rowItems = 0;

      layout.forEach((item, index) => {
        rowWidth += item.span;
        rowItems++;
        assert.equal(item.lastRow, index >= count - 12 / layout.at(-1)!.span);

        if (item.rowEnd) {
          assert.equal(rowWidth, 12);
          assert.ok(rowItems <= columns);
          rows.push(rowItems);
          rowWidth = 0;
          rowItems = 0;
        }
      });

      if (rows.length) {
        assert.equal(rows.length, Math.ceil(count / columns));
        assert.ok(Math.max(...rows) - Math.min(...rows) <= 1);
      }
    }
  }

  const rowSizes = (count: number) =>
    getStatLayout(count, 4)
      .filter((item) => item.rowEnd)
      .map((item) => 12 / item.span);

  assert.deepEqual(rowSizes(5), [3, 2]);
  assert.deepEqual(rowSizes(9), [3, 3, 3]);
  assert.deepEqual(rowSizes(13), [4, 3, 3, 3]);
});

test("numbers preserve locale-specific separators and percent spacing", () => {
  const expected = {
    cs: ["12\u00a0345,67", "85,5\u00a0%", "30\u00a0mil.+"],
    en: ["12,345.67", "85.5%", "30M+"],
    de: ["12.345,67", "85,5\u00a0%", "30\u00a0Mio.+"],
    fi: ["12\u00a0345,67", "85,5\u00a0%", "30\u00a0milj.+"],
    pl: ["12\u00a0345,67", "85,5%", "30\u00a0mln+"],
  };

  for (const [locale, [decimal, percent, turnover]] of Object.entries(
    expected,
  )) {
    const statistic = { id: "test", label: "Test", value: 12345.67 };
    assert.equal(prepareStatistic(statistic, locale).supportsAnimation, true);
    assert.equal(prepareStatistic(statistic, locale).formattedValue, decimal);
    assert.equal(
      prepareStatistic(
        {
          ...statistic,
          value: 0.855,
          format: { style: "percent", maximumFractionDigits: 1 },
        },
        locale,
      ).formattedValue,
      percent,
    );
    assert.equal(
      prepareStatistic(
        {
          ...statistic,
          value: 30000000,
          format: { notation: "compact", maximumFractionDigits: 0 },
          suffix: "+",
        },
        locale,
      ).formattedValue,
      turnover,
    );
  }
});

test("formats unsupported by NumberFlow retain their localized static value", () => {
  for (const { locale, format } of [
    { locale: "en", format: { notation: "scientific" } },
    { locale: "cs", format: { notation: "engineering" } },
    { locale: "ar", format: {} },
    { locale: "he", format: {} },
    { locale: "en", format: { numberingSystem: "arab" } },
  ] satisfies { locale: string; format: Intl.NumberFormatOptions }[]) {
    const item = { id: "test", label: "Test", value: 1234.5, format };
    const prepared = prepareStatistic(item, locale);
    assert.equal(prepared.supportsAnimation, false);
    assert.ok(prepared.formattedValue.length > 0);

    const markup = renderToStaticMarkup(
      createElement(TrustStrip, {
        "aria-label": "Test",
        locale,
        items: [item],
      }),
    );
    assert.ok(markup.includes(prepared.formattedValue));
    assert.ok(!markup.includes("<number-flow-react"));
  }
});

test("precision, negative values, zero, currency and qualifiers are explicit", () => {
  const statistic = { id: "test", label: "Test", value: 3.5 };
  assert.equal(prepareStatistic(statistic, "cs").formattedValue, "3,5");
  assert.equal(
    prepareStatistic(
      {
        ...statistic,
        format: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      },
      "cs",
    ).formattedValue,
    "3,50",
  );
  assert.equal(
    prepareStatistic({ ...statistic, value: 3 }, "en").formattedValue,
    "3",
  );
  assert.equal(
    prepareStatistic({ ...statistic, value: 0 }, "cs").formattedValue,
    "0",
  );
  assert.equal(
    prepareStatistic({ ...statistic, value: -12.5 }, "de").formattedValue,
    "-12,5",
  );
  assert.equal(
    prepareStatistic(
      { ...statistic, format: { style: "currency", currency: "EUR" } },
      "de",
    ).formattedValue,
    "3,50\u00a0€",
  );
  assert.equal(
    prepareStatistic({ ...statistic, prefix: "over ", suffix: " years" }, "en")
      .formattedValue,
    "over 3.5 years",
  );

  for (const value of [NaN, Infinity, -Infinity]) {
    assert.throws(
      () => prepareStatistic({ ...statistic, value }, "en"),
      RangeError,
    );
  }
});

test("all five catalogs provide complete translations and pluralized years", () => {
  const catalogs = { cs, en, de, fi, pl };
  const expectedYears = {
    cs: ["\u00a0rok", "\u00a0roky", "\u00a0let"],
    en: ["\u00a0year", "\u00a0years", "\u00a0years"],
    de: ["\u00a0Jahr", "\u00a0Jahre", "\u00a0Jahre"],
    fi: ["\u00a0vuosi", "\u00a0vuotta", "\u00a0vuotta"],
    pl: ["\u00a0rok", "\u00a0lata", "\u00a0lat"],
  };

  for (const locale of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    const t = createTranslator({
      locale,
      messages: catalogs[locale],
      namespace: "TrustStrip",
      onError(error) {
        throw error;
      },
    });

    [1, 2, 35].forEach((count, index) => {
      assert.equal(t("years.suffix", { count }), expectedYears[locale][index]);
    });
    for (const key of [
      "label",
      "years.label",
      "years.prefix",
      "area.label",
      "area.compactLabel",
      "export.label",
    ] as const) {
      assert.ok(t(key).length > 0);
    }
    assert.ok(t("specialists.label", { count: 300 }).length > 0);
    assert.equal(t("specialists.suffix"), "+");
    assert.equal(t("area.suffix"), " m²");
  }
});

test("server HTML contains final values, semantic labels and an empty strip is omitted", () => {
  const props = { "aria-label": "Company statistics", locale: "cs" };
  assert.equal(
    renderToStaticMarkup(createElement(TrustStrip, { ...props, items: [] })),
    "",
  );

  const markup = renderToStaticMarkup(
    createElement(TrustStrip, {
      ...props,
      items: [
        { id: "years", value: 35, label: "Na trhu", suffix: "\u00a0let" },
        {
          id: "export",
          value: 0.85,
          label: "Export",
          format: { style: "percent" },
        },
      ],
    }),
  );

  assert.match(markup, /<section[^>]*aria-label="Company statistics"/);
  assert.equal((markup.match(/<dt[ >]/g) ?? []).length, 2);
  assert.equal((markup.match(/<dd[ >]/g) ?? []).length, 2);
  assert.ok(markup.includes('class="sr-only">35\u00a0let</span>'));
  assert.ok(markup.includes('class="sr-only">85\u00a0%</span>'));
});
