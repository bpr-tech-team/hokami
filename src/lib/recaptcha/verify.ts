import { z } from "zod";
import type { RecaptchaAction } from "./actions";

const responseSchema = z.object({
  success: z.literal(true),
  score: z.number().min(0).max(1),
  action: z.string(),
  hostname: z.string(),
  challenge_ts: z.iso.datetime(),
});

// Never log arbitrary provider strings: unknown codes become a fixed label.
const providerFailureSchema = z.object({
  success: z.literal(false),
  "error-codes": z
    .array(
      z
        .enum([
          "missing-input-secret",
          "invalid-input-secret",
          "missing-input-response",
          "invalid-input-response",
          "bad-request",
          "timeout-or-duplicate",
          "unknown-error-code",
        ])
        .catch("unknown-error-code"),
    )
    .max(10)
    .optional(),
});

type RejectionReason =
  | "missing_token"
  | "missing_secret"
  | "missing_hostnames"
  | "provider_rejected"
  | "invalid_response"
  | "action_mismatch"
  | "low_score"
  | "hostname_mismatch"
  | "token_from_future"
  | "token_expired";

type VerificationOptions = {
  action: RecaptchaAction;
  secret: string;
  hostnames: string[];
  minimumScore: number;
};

export async function verifyRecaptcha(
  token: string,
  options: VerificationOptions,
) {
  function reject(
    reasons: RejectionReason[],
    details: {
      errorCodes?: string[];
      score?: number;
      minimumScore?: number;
      tokenAgeMs?: number;
    } = {},
  ) {
    console.warn("reCAPTCHA verification rejected", {
      action: options.action,
      reasons,
      ...details,
    });
    return false;
  }

  function unavailable(
    reason:
      | "service_timeout"
      | "service_network_error"
      | "service_http_error"
      | "invalid_json",
    status?: number,
  ) {
    console.error("reCAPTCHA verification unavailable", {
      action: options.action,
      reason,
      ...(status === undefined ? {} : { status }),
    });
  }

  const missing: RejectionReason[] = [];
  if (!token) missing.push("missing_token");
  if (!options.secret) missing.push("missing_secret");
  if (!options.hostnames.length) missing.push("missing_hostnames");
  if (missing.length) return reject(missing);

  let response: Response;
  try {
    response = await fetch(
      "https://www.recaptcha.net/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: options.secret, response: token }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
  } catch (error) {
    unavailable(
      error instanceof Error && error.name === "TimeoutError"
        ? "service_timeout"
        : "service_network_error",
    );
    throw error;
  }
  if (!response.ok) {
    unavailable("service_http_error", response.status);
    throw new Error("reCAPTCHA service unavailable");
  }
  let answer: unknown;
  try {
    answer = await response.json();
  } catch (error) {
    unavailable(
      error instanceof Error && error.name === "TimeoutError"
        ? "service_timeout"
        : "invalid_json",
    );
    throw error;
  }
  const failure = providerFailureSchema.safeParse(answer);
  if (failure.success)
    return reject(["provider_rejected"], {
      errorCodes: failure.data["error-codes"] ?? [],
    });
  const result = responseSchema.safeParse(answer);
  if (!result.success) return reject(["invalid_response"]);
  const age = Date.now() - Date.parse(result.data.challenge_ts);
  const reasons: RejectionReason[] = [];
  if (result.data.action !== options.action) reasons.push("action_mismatch");
  if (result.data.score < options.minimumScore) reasons.push("low_score");
  if (!options.hostnames.includes(result.data.hostname))
    reasons.push("hostname_mismatch");
  if (age < -10000) reasons.push("token_from_future");
  if (age > 120000) reasons.push("token_expired");
  if (reasons.length)
    return reject(reasons, {
      score: result.data.score,
      minimumScore: options.minimumScore,
      tokenAgeMs: age,
    });
  return true;
}
