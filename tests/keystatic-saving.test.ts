import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

test("Keystatic saves shared job images and reports invalid fields without tracking missing files", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "tests/fixtures/keystatic-saving.mts"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
