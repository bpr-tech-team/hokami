import assert from "node:assert/strict";
import { test } from "node:test";
import { recaptchaActions } from "../src/lib/recaptcha/actions";
import { verifyRecaptcha } from "../src/lib/recaptcha/verify";

const options = {
  action: recaptchaActions.enquiry,
  secret: "private-secret",
  hostnames: ["hokami.cz"],
  minimumScore: 0.5,
};
const now = Date.parse("2026-11-11T12:00:00Z");
const accepted = {
  success: true,
  score: 0.9,
  action: options.action,
  hostname: "hokami.cz",
  challenge_ts: new Date(now).toISOString(),
};

test("reCAPTCHA rejections log every failed check and safe numeric diagnostics", async (t) => {
  t.mock.method(Date, "now", () => now);
  const warnings = t.mock.method(console, "warn", () => {});
  let answer: unknown;
  t.mock.method(globalThis, "fetch", async () => Response.json(answer));

  for (const [override, reason] of [
    [{ score: 0.1 }, "low_score"],
    [{ action: "private-token" }, "action_mismatch"],
    [{ hostname: "private-secret" }, "hostname_mismatch"],
    [{ challenge_ts: new Date(now - 120001).toISOString() }, "token_expired"],
    [
      { challenge_ts: new Date(now + 10001).toISOString() },
      "token_from_future",
    ],
  ] as const) {
    answer = { ...accepted, ...override, token: "private-token" };
    assert.equal(await verifyRecaptcha("private-token", options), false);
    const call = warnings.mock.calls.at(-1)!;
    assert.equal(call.arguments[0], "reCAPTCHA verification rejected");
    assert.deepEqual(call.arguments[1], {
      action: options.action,
      reasons: [reason],
      score: "score" in override ? override.score : accepted.score,
      minimumScore: 0.5,
      tokenAgeMs:
        "challenge_ts" in override
          ? now - Date.parse(override.challenge_ts)
          : 0,
    });
  }

  answer = { ...accepted, score: 0.1, action: "other", hostname: "other" };
  assert.equal(await verifyRecaptcha("private-token", options), false);
  assert.deepEqual(warnings.mock.calls.at(-1)!.arguments[1].reasons, [
    "action_mismatch",
    "low_score",
    "hostname_mismatch",
  ]);
  assert.equal(warnings.mock.callCount(), 6);
  assert.doesNotMatch(
    JSON.stringify(warnings.mock.calls),
    /private-token|private-secret/,
  );
});

test("provider errors and malformed responses never log raw provider data", async (t) => {
  const warnings = t.mock.method(console, "warn", () => {});
  let answer: unknown = {
    success: false,
    "error-codes": ["timeout-or-duplicate", "private-token"],
    details: "private-secret",
  };
  t.mock.method(globalThis, "fetch", async () => Response.json(answer));
  assert.equal(await verifyRecaptcha("private-token", options), false);
  assert.deepEqual(warnings.mock.calls[0].arguments, [
    "reCAPTCHA verification rejected",
    {
      action: options.action,
      reasons: ["provider_rejected"],
      errorCodes: ["timeout-or-duplicate", "unknown-error-code"],
    },
  ]);
  answer = { success: true, score: "private-secret" };
  assert.equal(await verifyRecaptcha("private-token", options), false);
  assert.deepEqual(warnings.mock.calls[1].arguments[1], {
    action: options.action,
    reasons: ["invalid_response"],
  });
  assert.doesNotMatch(
    JSON.stringify(warnings.mock.calls),
    /private-token|private-secret/,
  );
});

test("unavailable verification logs safe HTTP, timeout, network and JSON reasons", async (t) => {
  const errors = t.mock.method(console, "error", () => {});
  let respond = async (): Promise<Response> =>
    new Response("private-token", { status: 503 });
  t.mock.method(globalThis, "fetch", () => respond());
  await assert.rejects(verifyRecaptcha("private-token", options));
  assert.deepEqual(errors.mock.calls[0].arguments, [
    "reCAPTCHA verification unavailable",
    { action: options.action, reason: "service_http_error", status: 503 },
  ]);
  for (const [name, reason] of [
    ["TimeoutError", "service_timeout"],
    ["TypeError", "service_network_error"],
  ]) {
    respond = async () => {
      throw Object.assign(new Error("private-secret"), { name });
    };
    await assert.rejects(verifyRecaptcha("private-token", options));
    assert.deepEqual(errors.mock.calls.at(-1)!.arguments[1], {
      action: options.action,
      reason,
    });
  }
  respond = async () => new Response("private-token");
  await assert.rejects(verifyRecaptcha("private-token", options));
  assert.deepEqual(errors.mock.calls.at(-1)!.arguments[1], {
    action: options.action,
    reason: "invalid_json",
  });
  assert.doesNotMatch(
    JSON.stringify(errors.mock.calls),
    /private-token|private-secret/,
  );
});

test("accepted verification emits no diagnostics", async (t) => {
  t.mock.method(Date, "now", () => now);
  const warnings = t.mock.method(console, "warn", () => {});
  const errors = t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async () => Response.json(accepted));
  assert.equal(await verifyRecaptcha("private-token", options), true);
  assert.equal(warnings.mock.callCount(), 0);
  assert.equal(errors.mock.callCount(), 0);
});

test("missing verification inputs log only their names without calling the provider", async (t) => {
  const warnings = t.mock.method(console, "warn", () => {});
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Provider must not be called");
  });
  assert.equal(
    await verifyRecaptcha("", { ...options, secret: "", hostnames: [] }),
    false,
  );
  assert.deepEqual(warnings.mock.calls[0].arguments[1], {
    action: options.action,
    reasons: ["missing_token", "missing_secret", "missing_hostnames"],
  });
  assert.equal(fetchMock.mock.callCount(), 0);
});
