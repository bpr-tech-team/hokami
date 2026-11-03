import assert from "node:assert/strict";
import { test } from "node:test";
import { cn } from "../src/lib/utils";

test("local typography overrides replace shared semantic line heights and tracking", () => {
  assert.equal(cn("leading-body", "leading-[1.3]"), "leading-[1.3]");
  assert.equal(cn("leading-small", "leading-[22px]"), "leading-[22px]");
  assert.equal(cn("tracking-eyebrow", "tracking-label"), "tracking-label");
  assert.equal(cn("tracking-label", "tracking-[0.06em]"), "tracking-[0.06em]");
  assert.equal(
    cn("desktop:leading-small", "desktop:leading-[1.4]"),
    "desktop:leading-[1.4]",
  );
});
