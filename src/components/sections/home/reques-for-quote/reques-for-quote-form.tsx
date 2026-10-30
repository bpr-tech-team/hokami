"use client";

import Image from "next/image";
import { useRef, useState, type FocusEvent, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { loadRecaptcha } from "@/lib/recaptcha/client";
import {
  getFieldErrors,
  industryOptions,
  requesForQuoteFieldNames,
  requesForQuoteSchema,
  validateFiles,
  volumeOptions,
  type RequesForQuoteErrorKey,
  type RequesForQuoteFieldErrors,
  type RequesForQuoteFieldName,
} from "@/lib/reques-for-quote/validation";
import { RequesForQuoteField } from "./reques-for-quote-field";
import { RequesForQuoteUpload } from "./reques-for-quote-upload";
import {
  submitRequesForQuote,
  RequesForQuoteSubmitError,
} from "./submit-reques-for-quote";

type SubmitError = "send" | "captcha" | "unavailable";
const cardClassName =
  "min-w-0 border border-border-brand-subtle bg-surface-default p-5 tablet:p-8";

export function RequesForQuoteForm({
  previewUploads = false,
}: {
  previewUploads?: boolean;
}) {
  const t = useTranslations("RequesForQuote");
  const industries = useTranslations("Industries.items");
  const locale = useLocale();
  const busy = useRef(false);
  const [errors, setErrors] = useState<RequesForQuoteFieldErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<RequesForQuoteErrorKey>();
  const [submitError, setSubmitError] = useState<SubmitError>();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  function validateField(event: FocusEvent<HTMLFormElement>) {
    const target = event.target;
    let name: RequesForQuoteFieldName;
    let value: string;
    if (target instanceof HTMLButtonElement && target.dataset.fieldName) {
      if (target.hasAttribute("data-popup-open")) return;
      name = target.dataset.fieldName as RequesForQuoteFieldName;
      value = String(new FormData(event.currentTarget).get(name) ?? "");
    } else if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      name = target.name as RequesForQuoteFieldName;
      value = target.value;
    } else return;
    if (!requesForQuoteFieldNames.includes(name)) return;
    const result = requesForQuoteSchema.shape[name].safeParse(value);
    setErrors((current) => ({
      ...current,
      [name]: result.success
        ? undefined
        : (result.error.issues[0].message as RequesForQuoteErrorKey),
    }));
  }

  function addFiles(added: File[]) {
    const next = [...files];
    for (const file of added) {
      if (
        !next.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified,
        )
      )
        next.push(file);
    }
    const error = validateFiles(next);
    setFileError(error);
    if (!error) setFiles(next);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const element = event.currentTarget;
    const data = new FormData(element);
    const result = requesForQuoteSchema.safeParse(Object.fromEntries(data));
    const nextErrors = result.success ? {} : getFieldErrors(result.error);
    const nextFileError = validateFiles(files);
    setErrors(nextErrors);
    setFileError(nextFileError);
    setSubmitError(undefined);
    setSuccess(false);

    if (!result.success || nextFileError) {
      const first = requesForQuoteFieldNames.find((name) => nextErrors[name]);
      if (first)
        element
          .querySelector<HTMLElement>(`#reques-for-quote-${first}`)
          ?.focus();
      else
        element
          .querySelector<HTMLButtonElement>("[data-upload-button]")
          ?.focus();
      return;
    }
    if (!siteKey) {
      setSubmitError("unavailable");
      return;
    }

    busy.current = true;
    setSending(true);

    try {
      await submitRequesForQuote({
        values: result.data,
        files,
        locale,
        siteKey,
      });
      element.reset();
      setFiles([]);
      setSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof RequesForQuoteSubmitError ? error.reason : "send",
      );
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  return (
    <form
      method="post"
      action="/api/reques-for-quote"
      className={`${cardClassName} flex flex-col gap-6`}
      noValidate
      aria-labelledby="reques-for-quote-heading"
      aria-busy={sending}
      onSubmit={submit}
      onReset={() => setFormVersion((current) => current + 1)}
      onBlur={validateField}
      onFocusCapture={() => {
        if (siteKey) void loadRecaptcha(siteKey).catch(() => {});
      }}
    >
      <fieldset
        key={formVersion}
        disabled={sending}
        className="flex min-w-0 flex-col gap-6"
      >
        <legend className="sr-only">{t("title")}</legend>
        <div className="grid min-w-0 grid-cols-1 gap-6 tablet:grid-cols-2">
          <RequesForQuoteField
            name="name"
            label={t("fields.name.label")}
            placeholder={t("fields.name.placeholder")}
            required
            autoComplete="name"
            maxLength={120}
            error={errors.name}
          />
          <RequesForQuoteField
            name="company"
            label={t("fields.company.label")}
            placeholder={t("fields.company.placeholder")}
            required
            autoComplete="organization"
            maxLength={200}
            error={errors.company}
          />
          <RequesForQuoteField
            name="email"
            label={t("fields.email.label")}
            placeholder={t("fields.email.placeholder")}
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            error={errors.email}
          />
          <RequesForQuoteField
            name="country"
            label={t("fields.country.label")}
            placeholder={t("fields.country.placeholder")}
            autoComplete="country-name"
            maxLength={100}
            error={errors.country}
          />
          <RequesForQuoteField
            name="industry"
            label={t("fields.industry.label")}
            placeholder={t("fields.industry.placeholder")}
            type="select"
            disabled={sending}
            error={errors.industry}
            options={industryOptions.map((value) => ({
              value,
              label:
                value === "other"
                  ? t("fields.industry.other")
                  : industries(`${value}.name`),
            }))}
          />
          <RequesForQuoteField
            name="volume"
            label={t("fields.volume.label")}
            placeholder={t("fields.volume.placeholder")}
            type="select"
            disabled={sending}
            error={errors.volume}
            options={volumeOptions.map((value) => ({
              value,
              label: t(`fields.volume.options.${value}`),
            }))}
          />
        </div>
        <RequesForQuoteField
          name="project"
          label={t("fields.project.label")}
          placeholder={t("fields.project.placeholder")}
          type="textarea"
          maxLength={5000}
          error={errors.project}
        />
        <RequesForQuoteUpload
          files={files}
          previewUploads={previewUploads}
          error={fileError}
          disabled={sending}
          onAdd={addFiles}
          onRemove={(index) => {
            setFiles((current) =>
              current.filter((_, position) => position !== index),
            );
            setFileError(undefined);
          }}
        />
        <Button
          type="submit"
          size="lg"
          className="h-auto min-h-14 w-full py-4 whitespace-normal"
          loading={sending}
          loadingLabel={t("sending")}
        >
          {submitError ? t("retry") : t("submit")}
        </Button>
      </fieldset>
      {submitError && (
        <Alert
          variant="destructive"
          className="flex items-start gap-3 rounded-none border-feedback-error-text bg-feedback-error-surface p-4"
        >
          <Image
            src="/images/reques-for-quote/alert.svg"
            width={20}
            height={20}
            alt=""
            className="mt-0.5 shrink-0"
          />
          <div>
            <AlertTitle className="font-display text-base font-semibold uppercase">
              {t("failure.title")}
            </AlertTitle>
            <AlertDescription className="mt-1 text-feedback-error-text">
              {t(`failure.${submitError}`)}
            </AlertDescription>
          </div>
        </Alert>
      )}
      {success && (
        <Alert
          role="status"
          className="flex items-start gap-3 rounded-none border-border-subtle bg-surface-subtle p-4"
        >
          <Image
            src="/images/reques-for-quote/success.svg"
            width={48}
            height={48}
            alt=""
            className="shrink-0"
          />
          <div>
            <AlertTitle className="font-display text-base font-semibold uppercase">
              {t("success.title")}
            </AlertTitle>
            <AlertDescription className="mt-1 text-text-secondary">
              {t("success.description")}
            </AlertDescription>
          </div>
        </Alert>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {sending ? t("sending") : ""}
      </span>
    </form>
  );
}
