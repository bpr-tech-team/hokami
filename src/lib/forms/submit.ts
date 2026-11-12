import { getRecaptchaToken } from "@/lib/recaptcha/client";
import type { RecaptchaAction } from "@/lib/recaptcha/actions";
import {
  trackSuccessfulForm,
  type FormSubmissionAnalytics,
} from "@/lib/analytics/form-events";

export type SubmissionFailure = "send" | "captcha" | "unavailable";

export class FormSubmitError extends Error {
  constructor(
    public readonly reason: SubmissionFailure,
    public readonly fields: Record<string, string> = {},
    public readonly fileError?: string,
  ) {
    super(reason);
  }
}

export async function submitForm({
  endpoint,
  values,
  locale,
  siteKey,
  action,
  analytics,
  files = [],
}: {
  endpoint: string;
  values: object;
  locale: string;
  siteKey: string;
  action: RecaptchaAction;
  analytics?: FormSubmissionAnalytics;
  files?: File[];
}) {
  let token: string;
  try {
    token = await getRecaptchaToken(siteKey, action);
  } catch {
    throw new FormSubmitError("captcha");
  }
  const body = new FormData();
  body.set("values", JSON.stringify(values));
  body.set("locale", locale);
  body.set("recaptchaToken", token);
  for (const file of files) body.append("files", file, file.name);
  const response = await fetch(endpoint, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(60000),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true) {
    throw new FormSubmitError(
      result.error === "captcha"
        ? "captcha"
        : response.status === 503
          ? "unavailable"
          : "send",
      result.fields,
      result.fileError,
    );
  }
  if (analytics) trackSuccessfulForm(analytics, locale);
}
