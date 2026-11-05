import assert from "node:assert/strict";
import { test } from "node:test";
import { getHeaderLinkState } from "../src/components/layout/header/navigation";

test("navigation highlights nested pages only within the matching path segment", () => {
  assert.deepEqual(
    getHeaderLinkState("/services", { pathname: "/services", hash: "" }),
    { active: true, current: "page" },
  );
  for (const pathname of ["/services/smt", "/services/tht/details"]) {
    assert.deepEqual(
      getHeaderLinkState("/services", { pathname, hash: "#equipment" }),
      { active: true },
    );
  }
  for (const pathname of ["/services-other", "/service", "/contact"]) {
    assert.deepEqual(getHeaderLinkState("/services", { pathname, hash: "" }), {
      active: false,
    });
  }
  assert.deepEqual(
    getHeaderLinkState("/", { pathname: "/services", hash: "" }),
    { active: false },
  );
});

test("fragment navigation is current only on the matching page and location", () => {
  assert.deepEqual(
    getHeaderLinkState("/contact#contact-form", {
      pathname: "/contact",
      hash: "#contact-form",
    }),
    { active: true, current: "location" },
  );
  for (const location of [
    { pathname: "/contact", hash: "#details" },
    { pathname: "/contact/team", hash: "#contact-form" },
  ]) {
    assert.deepEqual(getHeaderLinkState("/contact#contact-form", location), {
      active: false,
    });
  }
});
