import assert from "node:assert/strict";
import { test } from "node:test";
import {
  requesForQuoteSchema,
  getFieldErrors,
  validateFiles,
  MAX_FILES_BYTES,
} from "../src/lib/reques-for-quote/validation";
import { verifyRecaptcha } from "../src/lib/recaptcha/verify";
import { recaptchaActions } from "../src/lib/recaptcha/actions";

const values = {
  name: " Jana Nováková ",
  company: " Example s.r.o. ",
  email: " jana@example.cz ",
  country: "",
  industry: "",
  volume: "",
  project: "",
};
test("accepts Unicode names, trims fields, and allows an enquiry without optional details", () => {
  const result = requesForQuoteSchema.parse(values);
  assert.equal(result.name, "Jana Nováková");
  assert.equal(result.company, "Example s.r.o.");
  assert.equal(result.email, "jana@example.cz");
});

test("enquiries accept the client's six industries and reject retired sectors", () => {
  for (const industry of [
    "ind",
    "med",
    "rail",
    "energy",
    "cons",
    "auto",
    "other",
  ]) {
    assert.equal(
      requesForQuoteSchema.parse({ ...values, industry }).industry,
      industry,
    );
  }
  for (const industry of ["aero", "def"]) {
    const result = requesForQuoteSchema.safeParse({ ...values, industry });
    assert.equal(result.success, false);
    if (!result.success)
      assert.equal(getFieldErrors(result.error).industry, "invalidOption");
  }
});

test("rejects blank required fields and malformed email with field-specific errors", () => {
  const result = requesForQuoteSchema.safeParse({
    ...values,
    name: "  ",
    company: "",
    email: "not-an-email",
  });
  assert.equal(result.success, false);
  if (!result.success)
    assert.deepEqual(getFieldErrors(result.error), {
      name: "nameRequired",
      company: "companyRequired",
      email: "emailInvalid",
    });
  assert.equal(
    requesForQuoteSchema.safeParse({ ...values, industry: "injected-value" })
      .success,
    false,
  );
  assert.equal(
    requesForQuoteSchema.safeParse({ ...values, project: "x".repeat(5001) })
      .success,
    false,
  );
});

test("enforces the aggregate decimal 4 MB limit, file count, names, and nonempty files", () => {
  assert.equal(MAX_FILES_BYTES, 4_000_000);
  assert.equal(
    validateFiles([
      { name: "a.zip", size: 2_000_000 },
      { name: "b.zip", size: 2_000_000 },
    ]),
    undefined,
  );
  assert.equal(
    validateFiles([{ name: "a.zip", size: MAX_FILES_BYTES }]),
    undefined,
  );
  assert.equal(
    validateFiles([
      { name: "a.zip", size: MAX_FILES_BYTES },
      { name: "b.zip", size: 1 },
    ]),
    "filesSize",
  );
  assert.equal(
    validateFiles(
      Array.from({ length: 11 }, (_, i) => ({ name: `${i}.zip`, size: 1 })),
    ),
    "filesCount",
  );
  assert.equal(validateFiles([{ name: "empty.zip", size: 0 }]), "filesEmpty");
  assert.equal(validateFiles([{ name: "../data.zip", size: 1 }]), "fileName");
});

const verification = {
  action: recaptchaActions.enquiry,
  secret: "test-only",
  hostnames: ["hokami.cz"],
  minimumScore: 0.5,
};
const accepted = () => ({
  success: true,
  score: 0.9,
  action: "reques_for_quote_submit",
  hostname: "hokami.cz",
  challenge_ts: new Date().toISOString(),
});

test("checks reCAPTCHA score, action, hostname, success, and token age", async (t) => {
  let answer: unknown = accepted();
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, init?: RequestInit) => {
      assert.equal(init?.method, "POST");
      assert.equal(
        new URLSearchParams(init?.body as URLSearchParams).get("response"),
        "user-token",
      );
      return Response.json(answer);
    },
  );
  assert.equal(await verifyRecaptcha("user-token", verification), true);
  for (const invalid of [
    { score: 0.1 },
    { action: "login" },
    { hostname: "evil.example" },
    { success: false },
    { challenge_ts: new Date(Date.now() - 121000).toISOString() },
  ]) {
    answer = { ...accepted(), ...invalid };
    assert.equal(await verifyRecaptcha("user-token", verification), false);
  }
  answer = { success: true };
  assert.equal(await verifyRecaptcha("user-token", verification), false);
  fetchMock.mock.restore();
});

test("reCAPTCHA service errors never grant access", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("unavailable", { status: 503 }),
  );
  await assert.rejects(verifyRecaptcha("user-token", verification));
});
