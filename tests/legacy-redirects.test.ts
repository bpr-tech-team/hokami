import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getRedirectUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import nextConfig from "../next.config";

async function followRedirects(url: string) {
  let hops = 0;
  while (hops < 5) {
    const response = await unstable_getResponseFromNextConfig({
      url,
      nextConfig,
    });
    const target = getRedirectUrl(response);
    if (!target) return { target: new URL(url), hops };
    assert.equal(response.status, 308, url);
    url = target;
    hops++;
  }
  assert.fail(`Redirect loop: ${url}`);
}

const examples = [
  ["kontakt", "/contact"],
  ["o-hokami", "/about"],
  ["udrzitelnost", "/sustainability"],
  ["kariera", "/jobs"],
  ["kampus", "/about#campus"],
  ["sluzby", "/services"],
  ["osazovani", "/services/smt"],
  ["pajeni", "/services/tht"],
  ["cisteni", "/services/cleaning"],
  ["testovani", "/services/testing"],
  ["lakovani", "/services/coating"],
  ["kompletace", "/services/mechanical-assembly"],
  ["desky-plosnych-spoju", "/services/pcb"],
  ["sablony", "/services/smt-stencils"],
  ["delnik-delnice-v-elektronice", "/jobs/production"],
  ["konstrukter-testeru-elektroniky-vyvoj-sw-aplikaci", "/jobs/test-engineer"],
  ["nakupci", "/jobs/buyer"],
  ["category/kariera", "/jobs"],
  ["author/111", "/jobs"],
  ["author/josef-suska", "/jobs"],
];

test("WordPress URLs reach their replacements with permanent redirects", async () => {
  for (const locale of ["cs", "en", "de", "fi", "pl", ""]) {
    for (const [source, destination] of examples) {
      for (const slash of ["", "/"]) {
        // Next's config test helper incorrectly appends queries after fragments.
        // Check campus query preservation against the HTTP server instead.
        const query = source === "kampus" ? "" : "?utm_source=google";
        const { target, hops } = await followRedirects(
          `https://hokami.cz/${locale ? `${locale}/` : ""}${source}${slash}${query}`,
        );
        assert.ok(hops >= 1 && hops <= 2);
        const expected = new URL(
          `https://hokami.cz/${locale || "cs"}${destination}`,
        );
        assert.equal(target.pathname, expected.pathname);
        assert.equal(target.hash, expected.hash);
        if (query)
          assert.equal(target.searchParams.get("utm_source"), "google");
      }
    }
  }
});

test("the old GDPR query link reaches Czech legal content", async () => {
  for (const prefix of ["", "cs/", "en/", "de/", "fi/", "pl/"]) {
    const { target, hops } = await followRedirects(
      `https://hokami.cz/${prefix}?page_id=176&utm_source=google`,
    );
    assert.ok(hops >= 1 && hops <= 2);
    assert.equal(target.pathname, "/cs/gdpr");
    assert.equal(target.searchParams.get("utm_source"), "google");
  }
});

test("current pages and unknown URLs are not captured by legacy rules", async () => {
  for (const path of [
    "/cs/about",
    "/en/services/smt",
    "/cs/jobs/buyer",
    "/cs/gdpr",
    "/cs/whistleblowing",
    "/cs/unknown-page",
    "/fr/kontakt",
    "/cs?page_id=999",
    "/wp-admin",
    "/api/contact",
  ]) {
    const response = await unstable_getResponseFromNextConfig({
      url: `https://hokami.cz${path}`,
      nextConfig,
    });
    assert.equal(getRedirectUrl(response), null, path);
  }
});
