"use client";

import { useState, type FormEvent } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useLocale, useTranslations } from "next-intl";
import { TextFormField } from "@/components/forms/text-form-field";
import { FormSubmissionStatus } from "@/components/forms/form-submission-status";
import { useFormSubmission } from "@/hooks/use-form-submission";
import { recaptchaActions } from "@/lib/recaptcha/actions";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Text } from "@/components/typography/text";
import { Link } from "@/i18n/navigation";
import { companyContacts } from "@/content/company";
import {
  contactFieldNames,
  contactSchema,
  getContactFieldErrors,
  type ContactFieldName,
  type ContactFieldErrors,
  type ContactErrorKey,
} from "@/lib/contact/validation";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const status = useTranslations("FormSubmission");
  const locale = useLocale();
  const submission = useFormSubmission();
  const interactive = useHydrated();
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const email = companyContacts[1];

  function validateField(
    event: FormEvent<HTMLFormElement>,
    onlyInvalid = false,
  ) {
    const target = event.target;
    if (!(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ))
      return;
    const name = target.name as ContactFieldName;
    if (!contactFieldNames.includes(name)) return;
    if (onlyInvalid && !errors[name]) return;
    const result = contactSchema.shape[name].safeParse(target.value);
    setErrors((current) => ({
      ...current,
      [name]: result.success
        ? undefined
        : (result.error.issues[0].message as ContactErrorKey),
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = contactSchema.safeParse(
      Object.fromEntries(new FormData(form)),
    );
    submission.clearStatus();
    if (!result.success) {
      const nextErrors = getContactFieldErrors(result.error);
      setErrors(nextErrors);
      const first = contactFieldNames.find((name) => nextErrors[name]);
      if (first) form.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }
    setErrors({});
    const outcome = await submission.submit({
      endpoint: "/api/contact",
      values: result.data,
      locale,
      action: recaptchaActions.contact,
      analytics: { formType: "contact" },
    });
    if (outcome?.success) form.reset();
    else if (outcome) {
      const fields = outcome.error.fields as ContactFieldErrors;
      setErrors(fields);
      const first = contactFieldNames.find((name) => fields[name]);
      if (first) form.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
    }
  }

  function field(name: ContactFieldName) {
    return {
      id: `contact-${name}`,
      name,
      label: t(`fields.${name}.label`),
      placeholder: t(`fields.${name}.placeholder`),
      error: errors[name] ? t(`errors.${errors[name]}`) : undefined,
    };
  }

  return (
    <form
      method="post"
      action="/api/contact"
      noValidate
      aria-labelledby="contact-form-heading"
      onSubmit={submit}
      onBlur={validateField}
      aria-busy={submission.sending}
      onFocusCapture={submission.preload}
      onChange={(event) => {
        submission.clearStatus();
        validateField(event, true);
      }}
      className="flex min-w-0 flex-col gap-6 border border-border-subtle bg-surface-default p-5 tablet:p-8"
    >
      <FieldSet
        disabled={!interactive || submission.sending}
        className="flex min-w-0 flex-col gap-6"
      >
        <FieldLegend className="sr-only mb-0">{t("title")}</FieldLegend>
        <TextFormField
          {...field("name")}
          required
          autoComplete="name"
          maxLength={120}
        />
        <FieldGroup className="grid min-w-0 grid-cols-1 gap-6 tablet:grid-cols-2">
          <TextFormField
            {...field("email")}
            type="email"
            required
            autoComplete="email"
            maxLength={254}
          />
          <TextFormField
            {...field("phone")}
            type="tel"
            autoComplete="tel"
            maxLength={50}
          />
        </FieldGroup>
        <TextFormField
          {...field("message")}
          type="textarea"
          required
          maxLength={5000}
        />
        <Text variant="small" className="text-text-tertiary">
          {t("required")}
        </Text>
        <Text variant="small" tone="secondary">
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
        </Text>
        <Button
          type="submit"
          disabled={!interactive}
          loading={submission.sending}
          loadingLabel={status("sending")}
          size="lg"
          className="h-auto min-h-14 w-full py-4 whitespace-normal"
        >
          {submission.error ? status("retry") : t("submit")}
        </Button>
      </FieldSet>
      <FormSubmissionStatus
        error={submission.error?.reason}
        success={submission.success}
        email={email}
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
  );
}
