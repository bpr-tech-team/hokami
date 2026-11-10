"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { SubmissionFailure } from "@/lib/forms/submit";
import { FormError } from "./form-error";

export function FormSubmissionStatus({
  error,
  success,
  email,
}: {
  error?: SubmissionFailure;
  success: boolean;
  email: { label: string; href: string };
}) {
  const t = useTranslations("FormSubmission");
  if (error)
    return (
      <FormError title={t("failure.title")}>
        {t.rich(`failure.${error}`, {
          address: email.label,
          email: (chunks) => <a href={email.href}>{chunks}</a>,
        })}
      </FormError>
    );
  if (success)
    return (
      <Alert
        role="status"
        className="rounded-none border-border-subtle bg-surface-subtle p-4"
      >
        <AlertTitle className="font-display text-base font-semibold uppercase">
          {t("success.title")}
        </AlertTitle>
        <AlertDescription className="mt-1 text-text-secondary">
          {t("success.description")}
        </AlertDescription>
      </Alert>
    );
  return null;
}
