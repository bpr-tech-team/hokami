import assert from "node:assert/strict";
import { test } from "node:test";
import { readFormValues } from "../src/lib/forms/values";

test("untouched Select state overrides stale first-option values without losing text or attachments", () => {
  const data = new FormData();
  const file = new File(["test"], "specification.txt");
  data.set("name", "Jana Nováková");
  data.set("industry", "ind");
  data.set("volume", "prototype");
  data.set("file", file);

  const values = readFormValues(data, { industry: "", volume: "" });
  assert.equal(values.industry, "");
  assert.equal(values.volume, "");
  assert.equal(values.name, "Jana Nováková");
  assert.equal(values.file, file);
  assert.equal(data.get("industry"), "ind");
});

test("explicit selections and the initial vacancy take precedence over different DOM values", () => {
  const data = new FormData();
  data.set("industry", "ind");
  data.set("volume", "prototype");
  data.set("job", "production");
  const values = readFormValues(data, {
    industry: "med",
    volume: "unsure",
    job: "buyer",
  });
  assert.equal(values.industry, "med");
  assert.equal(values.volume, "unsure");
  assert.equal(values.job, "buyer");
});
