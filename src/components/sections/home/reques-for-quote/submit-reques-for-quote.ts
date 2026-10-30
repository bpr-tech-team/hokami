import { getRecaptchaToken } from "@/lib/recaptcha/client";
import type { RequesForQuoteValues } from "@/lib/reques-for-quote/validation";

export class RequesForQuoteSubmitError extends Error {
  constructor(public readonly reason: "send" | "captcha" | "unavailable") {
    super(reason);
  }
}

async function token(siteKey: string) {
  try {
    return await getRecaptchaToken(siteKey);
  } catch {
    throw new RequesForQuoteSubmitError("captcha");
  }
}

async function post(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true)
    throw new RequesForQuoteSubmitError(
      result.error === "captcha"
        ? "captcha"
        : response.status === 503
          ? "unavailable"
          : "send",
    );
}

export async function submitRequesForQuote({
  values,
  files,
  locale,
  siteKey,
}: {
  values: RequesForQuoteValues;
  files: File[];
  locale: string;
  siteKey: string;
}) {
  // Send only metadata to the validation stub; file contents stay in the browser.
  await post("/api/reques-for-quote", {
    values,
    locale,
    files: files.map((file) => ({
      name: file.name,
      size: file.size,
      contentType: file.type || "application/octet-stream",
    })),
    recaptchaToken: await token(siteKey),
  });
}
