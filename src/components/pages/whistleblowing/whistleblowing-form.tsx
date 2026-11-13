"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FormField } from "@/components/forms/text-form-field";
import { FormSubmissionStatus } from "@/components/forms/form-submission-status";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFormSubmission } from "@/hooks/use-form-submission";
import { useHydrated } from "@/hooks/use-hydrated";
import { Link } from "@/i18n/navigation";
import { recaptchaActions } from "@/lib/recaptcha/actions";
import {
  MAX_WHISTLEBLOWING_MESSAGE_LENGTH,
  getWhistleblowingFieldErrors,
  whistleblowingFieldNames,
  whistleblowingSchema,
  type WhistleblowingFieldErrors,
  type WhistleblowingFieldName,
  type WhistleblowingErrorKey,
} from "@/lib/whistleblowing/validation";

const email = { label: "vpavlu@hokami.cz", href: "mailto:vpavlu@hokami.cz" };

function focusError(form: HTMLFormElement, fields: WhistleblowingFieldErrors) {
  const first = whistleblowingFieldNames.find((name) => fields[name]);
  if (first)
    form.querySelector<HTMLElement>(`#whistleblowing-${first}`)?.focus();
}

export function WhistleblowingForm() {
  const t = useTranslations("WhistleblowingForm");
  const locale = useLocale();
  const interactive = useHydrated();
  const submission = useFormSubmission();
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<WhistleblowingFieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!submission.sending && submission.error && formRef.current)
      focusError(
        formRef.current,
        submission.error.fields as WhistleblowingFieldErrors,
      );
  }, [submission.sending, submission.error]);

  function validateField(name: WhistleblowingFieldName, value: unknown) {
    const result = whistleblowingSchema.shape[name].safeParse(value);
    setErrors((current) => ({
      ...current,
      [name]: result.success
        ? undefined
        : (result.error.issues[0].message as WhistleblowingErrorKey),
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    submission.clearStatus();
    const result = whistleblowingSchema.safeParse({ message, consent });
    if (!result.success) {
      const fields = getWhistleblowingFieldErrors(result.error);
      setErrors(fields);
      focusError(form, fields);
      return;
    }
    setErrors({});
    const outcome = await submission.submit({
      endpoint: "/api/whistleblowing",
      values: result.data,
      locale,
      action: recaptchaActions.whistleblowing,
    });
    if (outcome?.success) {
      setMessage("");
      setConsent(false);
    } else if (outcome) {
      const fields = outcome.error.fields as WhistleblowingFieldErrors;
      setErrors(fields);
    }
  }

  return (
    <section
      id="whistleblowing-form"
      lang={locale}
      aria-labelledby="whistleblowing-form-heading"
      className="mt-12 scroll-mt-24"
    >
      <Heading
        as="h2"
        variant="article"
        id="whistleblowing-form-heading"
        className="mb-6"
      >
        {t("title")}
      </Heading>
      <form
        ref={formRef}
        method="post"
        action="/api/whistleblowing"
        noValidate
        aria-labelledby="whistleblowing-form-heading"
        aria-busy={submission.sending}
        onSubmit={submit}
        onFocusCapture={submission.preload}
        className="flex min-w-0 flex-col gap-6 border border-border-subtle bg-surface-default p-5 tablet:p-8"
      >
        <FieldSet
          disabled={!interactive || submission.sending}
          className="flex min-w-0 flex-col gap-6"
        >
          <FieldLegend className="sr-only mb-0">{t("title")}</FieldLegend>
          <div className="flex min-w-0 flex-col gap-2">
            <FormField
              id="whistleblowing-message"
              label={t("message")}
              required
              error={errors.message ? t(`errors.${errors.message}`) : undefined}
            >
              <Textarea
                id="whistleblowing-message"
                name="message"
                rows={10}
                className="field-sizing-fixed"
                required
                maxLength={MAX_WHISTLEBLOWING_MESSAGE_LENGTH}
                value={message}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={[
                  "whistleblowing-hint",
                  "whistleblowing-count",
                  errors.message ? "whistleblowing-message-error" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onBlur={() => validateField("message", message)}
                onChange={(event) => {
                  setMessage(event.target.value);
                  submission.clearStatus();
                  if (errors.message)
                    validateField("message", event.target.value);
                }}
              />
            </FormField>
            <Text
              variant="small"
              id="whistleblowing-count"
              className="text-right text-text-tertiary"
            >
              {message.length} / {MAX_WHISTLEBLOWING_MESSAGE_LENGTH}
            </Text>
            <Text variant="small" tone="secondary" id="whistleblowing-hint">
              {t("hint")}
            </Text>
          </div>
          <Field data-invalid={Boolean(errors.consent)}>
            <div className="flex items-start gap-3">
              <Checkbox
                id="whistleblowing-consent"
                name="consent"
                checked={consent}
                disabled={!interactive || submission.sending}
                required
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={
                  errors.consent ? "whistleblowing-consent-error" : undefined
                }
                className="mt-1"
                onCheckedChange={(checked) => {
                  setConsent(checked);
                  submission.clearStatus();
                  if (errors.consent) validateField("consent", checked);
                }}
              />
              <FieldLabel
                htmlFor="whistleblowing-consent"
                className="block font-sans text-sm leading-6 tracking-normal normal-case"
              >
                {t.rich("consent", {
                  privacy: (chunks) => (
                    <Link
                      href="/gdpr"
                      className="text-text-accent underline hover:text-text-accent-hover"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
                <span aria-hidden="true" className="ml-1 text-text-accent">
                  *
                </span>
              </FieldLabel>
            </div>
            {errors.consent && (
              <FieldError id="whistleblowing-consent-error">
                {t(`errors.${errors.consent}`)}
              </FieldError>
            )}
          </Field>
          <Text variant="small" className="text-text-tertiary">
            {t("required")}
          </Text>
          <Button
            type="submit"
            disabled={!interactive}
            loading={submission.sending}
            loadingLabel={t("status.sending")}
            size="lg"
            className="h-auto min-h-14 w-full py-4 whitespace-normal"
          >
            {submission.error ? t("status.retry") : t("submit")}
          </Button>
        </FieldSet>
        <FormSubmissionStatus
          error={submission.error?.reason}
          success={submission.success}
          email={email}
          translationNamespace="WhistleblowingForm.status"
        />
        <noscript>
          <Text variant="small" tone="secondary">
            {t.rich("noScript", {
              address: email.label,
              email: (chunks) => (
                <a href={email.href} className="text-text-accent underline">
                  {chunks}
                </a>
              ),
            })}
          </Text>
        </noscript>
      </form>
    </section>
  );
}
