"use client";

import { hasServiceConsent } from "@/lib/cookie-consent";
import { routing } from "@/i18n/routing";
import {
  trackGoogleFormEvent,
  type FormAnalyticsEvent,
} from "./google-tag-manager";

export type FormSubmissionAnalytics =
  | { formType: "contact" }
  | { formType: "request_for_quote" }
  | { formType: "job_application"; jobId: string };

const eventByFormType: Record<
  FormSubmissionAnalytics["formType"],
  FormAnalyticsEvent["event"]
> = {
  contact: "generate_lead",
  request_for_quote: "generate_lead",
  job_application: "job_application_submit",
};

function jobIdForAnalytics(jobId: string) {
  if (jobId.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(jobId))
    return null;
  return jobId;
}

export function trackSuccessfulForm(
  submission: FormSubmissionAnalytics,
  locale: string,
) {
  if (!hasServiceConsent("googleAnalytics")) return;
  const language = routing.locales.find((language) => language === locale);
  if (!language) return;
  let jobId: string | null = null;
  if (submission.formType === "job_application")
    jobId = jobIdForAnalytics(submission.jobId);

  trackGoogleFormEvent({
    event: eventByFormType[submission.formType],
    form_type: submission.formType,
    site_language: language,
    // Only the server-validated vacancy slug is eligible for measurement.
    // Clear this value for other forms because dataLayer values persist.
    job_id: jobId,
  });
}
