import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { POST as contact } from "../src/app/api/contact/route";
import { POST as application } from "../src/app/api/job-application/route";
import { POST as enquiry } from "../src/app/api/reques-for-quote/route";

test("paused APIs reject submissions before reading any body or calling external services", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Paused forms must not call external services");
  });
  for (const handler of [contact, application, enquiry]) {
    const body = new FormData();
    body.set("files", new File(["%PDF-test"], "cv.pdf"));
    const request = new Request("https://hokami.cz/api/form", {
      method: "POST",
      body,
    });
    const readBody = t.mock.getter(request, "body", () => {
      throw new Error("Paused forms must not read the request body");
    });
    const response = await handler(request);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      success: false,
      error: "unavailable",
    });
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.has("location"), false);
    assert.equal(response.headers.has("retry-after"), false);
    assert.equal(readBody.mock.callCount(), 0);
    assert.equal(request.bodyUsed, false);
  }
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("restored forms retain the complete validation and submission flow", () => {
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "--import",
      "./tests/fixtures/public-forms-enabled.mts",
      "--test",
      "tests/fixtures/form-submission.mts",
    ],
    {
      encoding: "utf8",
      timeout: 60_000,
      env: { ...process.env, NODE_TEST_CONTEXT: undefined },
    },
  );
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /tests 10\b/);
});
