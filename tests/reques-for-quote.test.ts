import assert from "node:assert/strict";
import { test } from "node:test";
import {
  requesForQuoteSchema,
  getFieldErrors,
  validateFiles,
  MAX_FILES_BYTES,
  submitRequesForQuoteSchema,
} from "../src/lib/reques-for-quote/validation";
import { verifyRecaptcha } from "../src/lib/recaptcha/verify";
import { readRequesForQuoteRequest } from "../src/lib/reques-for-quote/http";
import { POST as submit } from "../src/app/api/reques-for-quote/route";

const values = {
  name: " Jana Nováková ",
  company: " Example s.r.o. ",
  email: " jana@example.cz ",
  country: "",
  industry: "",
  volume: "",
  project: "",
};
const validInput = () =>
  submitRequesForQuoteSchema.parse({
    values,
    locale: "cs",
    files: [{ name: "gerber.zip", size: 1024, contentType: "application/zip" }],
    recaptchaToken: "test-token",
  });

test("accepts Unicode names, trims fields, and allows an enquiry without optional details", () => {
  const result = requesForQuoteSchema.parse(values);
  assert.equal(result.name, "Jana Nováková");
  assert.equal(result.company, "Example s.r.o.");
  assert.equal(result.email, "jana@example.cz");
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

test("enforces the aggregate 50 MB limit, file count, names, and nonempty files", () => {
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

function request(body: unknown, origin = "https://hokami.cz") {
  return new Request("https://hokami.cz/api/reques-for-quote", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
}

test("rejects cross-origin and oversized requests, including chunked bodies", async () => {
  await assert.rejects(
    readRequesForQuoteRequest(request({}, "https://evil.example")),
  );
  await assert.rejects(
    readRequesForQuoteRequest(request({ text: "x".repeat(65536) })),
  );
  assert.deepEqual(await readRequesForQuoteRequest(request({ valid: true })), {
    valid: true,
  });
});

test("API rejects invalid input and fails closed when services are unconfigured", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("External services must not be called");
  });
  assert.equal((await submit(request({ values: {} }))).status, 400);
  const previous = process.env.RECAPTCHA_SECRET_KEY;
  delete process.env.RECAPTCHA_SECRET_KEY;
  try {
    const response = await submit(request(validInput()));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      success: false,
      error: "unavailable",
    });
  } finally {
    if (previous === undefined) delete process.env.RECAPTCHA_SECRET_KEY;
    else process.env.RECAPTCHA_SECRET_KEY = previous;
  }
});

test("delivery remains a stub with valid reCAPTCHA and files", async (t) => {
  const previous = process.env.RECAPTCHA_SECRET_KEY;
  process.env.RECAPTCHA_SECRET_KEY = "test-only";
  const fetchMock = t.mock.method(globalThis, "fetch", async (url: unknown) => {
    assert.equal(url, "https://www.recaptcha.net/recaptcha/api/siteverify");
    return Response.json(accepted());
  });
  try {
    for (const files of [[], validInput().files]) {
      const response = await submit(request({ ...validInput(), files }));
      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), {
        success: false,
        error: "unavailable",
      });
    }
    assert.equal(fetchMock.mock.callCount(), 2);
  } finally {
    if (previous === undefined) delete process.env.RECAPTCHA_SECRET_KEY;
    else process.env.RECAPTCHA_SECRET_KEY = previous;
  }
});
