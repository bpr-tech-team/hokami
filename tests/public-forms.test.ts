import assert from "node:assert/strict";
import { test } from "node:test";
import { publicFormsEnabled } from "../src/lib/forms/availability";
import {
  getPublicFormHref,
  getLegacyFormRedirect,
} from "../src/lib/forms/navigation";

const locales = ["cs", "en", "de", "fi", "pl"] as const;

test("paused forms use the interface locale and native contacts fragments", () => {
  assert.equal(publicFormsEnabled, false);
  for (const locale of locales) {
    for (const formHref of [
      "/#reques-for-quote",
      "/contact#contact-form",
      "/jobs/buyer#job-application",
    ]) {
      for (const pathname of ["/", "/about", "/services/smt", "/jobs/buyer"])
        assert.equal(
          getPublicFormHref(locale, formHref, pathname),
          `/${locale}/contact`,
        );
      assert.equal(
        getPublicFormHref(locale, formHref, "/contact"),
        "#locations",
      );
    }
  }
});

test("legacy anchors preserve repeated and encoded query values in every locale", () => {
  const search = "?utm_source=partner&tag=a&tag=b&q=a%2Bb%26c";
  for (const locale of locales) {
    for (const [source, target] of [
      ["/#reques-for-quote", ""],
      ["/contact#contact-form", "#locations"],
      ["/jobs/buyer#job-application", ""],
    ]) {
      const [pathname, hash] = source.split("#");
      for (const slash of ["", "/"]) {
        const location = new URL(
          `https://hokami.cz/${locale}${pathname === "/" ? "" : pathname}${slash}${search}#${hash}`,
        );
        assert.equal(
          getLegacyFormRedirect(location, locale, source),
          `/${locale}/contact${search}${target}`,
        );
      }
    }
  }
});

test("legacy redirects only handle the anchor on the page that owns it", () => {
  for (const href of [
    "/cs#industries",
    "/cs?form=contact-form",
    "/cs/about#reques-for-quote",
    "/cs/contact#reques-for-quote",
    "/en#reques-for-quote",
    "/cs/jobs/other#job-application",
    "/cs/jobs/buyer/more#job-application",
  ])
    assert.equal(
      getLegacyFormRedirect(
        new URL(href, "https://hokami.cz"),
        "cs",
        "/#reques-for-quote",
      ),
      null,
    );
});
