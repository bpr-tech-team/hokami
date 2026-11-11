"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useHydrated } from "@/hooks/use-hydrated";
import { readFormValues } from "@/lib/forms/values";
import { TextFormField, FormField } from "@/components/forms/text-form-field";
import { FileDropzone } from "@/components/forms/file-dropzone";
import { FormSubmissionStatus } from "@/components/forms/form-submission-status";
import { useFormSubmission } from "@/hooks/use-form-submission";
import { recaptchaActions } from "@/lib/recaptcha/actions";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import {
  Attachment,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentMedia,
} from "@/components/ui/attachment";
import { CloseIcon } from "@/components/ui/icons/close-icon";
import { Text } from "@/components/typography/text";
import { Link } from "@/i18n/navigation";
import {
  jobApplicationSchema,
  jobApplicationFieldNames,
  getJobApplicationErrors,
  validateJobFiles,
  type JobApplicationField,
  type JobApplicationError,
  type JobApplicationErrors,
  type JobFileError,
} from "@/lib/jobs/application-validation";
import { recruitmentContact } from "../data";

type JobOption = { id: string; title: string; contentLocale: string };
const fileKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

export function JobApplicationForm({
  jobId,
  jobs,
}: {
  jobId: string;
  jobs: JobOption[];
}) {
  const t = useTranslations("JobApplication");
  const status = useTranslations("FormSubmission");
  const locale = useLocale();
  const submission = useFormSubmission();
  const formatter = useFormatter();
  const interactive = useHydrated();
  const [errors, setErrors] = useState<JobApplicationErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<JobFileError>();
  const [selectedJob, setSelectedJob] = useState(jobId);
  const schema = jobApplicationSchema(jobs.map(({ id }) => id));

  function validateField(
    event: FormEvent<HTMLFormElement>,
    onlyInvalid = false,
  ) {
    const target = event.target;
    if (!(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ))
      return;
    const name = target.name as JobApplicationField;
    if (
      !jobApplicationFieldNames.includes(name) ||
      (onlyInvalid && !errors[name])
    )
      return;
    const result = schema.shape[name].safeParse(target.value);
    setErrors((current) => ({
      ...current,
      [name]: result.success
        ? undefined
        : (result.error.issues[0].message as JobApplicationError),
    }));
  }

  function addFiles(added: File[]) {
    const keys = new Set(files.map(fileKey));
    const next = [...files];
    for (const file of added)
      if (!keys.has(fileKey(file))) {
        next.push(file);
        keys.add(fileKey(file));
      }
    const error = validateJobFiles(next);
    setFileError(error);
    submission.clearStatus();
    if (!error) setFiles(next);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submission.clearStatus();
    const form = event.currentTarget;
    const result = schema.safeParse(
      readFormValues(new FormData(form), { job: selectedJob }),
    );
    const nextErrors = result.success
      ? {}
      : getJobApplicationErrors(result.error);
    setErrors(nextErrors);
    const uploadError = validateJobFiles(files);
    setFileError(uploadError);
    const first = jobApplicationFieldNames.find((name) => nextErrors[name]);
    if (first) {
      form.querySelector<HTMLElement>(`#job-application-${first}`)?.focus();
      return;
    }
    if (uploadError) {
      form
        .querySelector<HTMLElement>("#job-application-files-trigger")
        ?.focus();
      return;
    }
    if (!result.success) return;
    const outcome = await submission.submit({
      endpoint: "/api/job-application",
      values: result.data,
      files,
      locale,
      action: recaptchaActions.jobApplication,
    });
    if (outcome?.success) {
      form.reset();
      setFiles([]);
    } else if (outcome) {
      const fields = outcome.error.fields as JobApplicationErrors;
      setErrors(fields);
      setFileError(outcome.error.fileError as JobFileError | undefined);
      const first = jobApplicationFieldNames.find((name) => fields[name]);
      if (first)
        form.querySelector<HTMLElement>(`#job-application-${first}`)?.focus();
      else if (outcome.error.fileError)
        form
          .querySelector<HTMLElement>("#job-application-files-trigger")
          ?.focus();
    }
  }

  function field(name: JobApplicationField) {
    return {
      id: `job-application-${name}`,
      name,
      label: t(`fields.${name}.label`),
      placeholder: t(`fields.${name}.placeholder`),
      error: errors[name] ? t(`errors.${errors[name]}`) : undefined,
    };
  }

  return (
    <form
      method="post"
      action="/api/job-application"
      noValidate
      aria-labelledby="job-application-heading"
      onSubmit={submit}
      onReset={() => setSelectedJob(jobId)}
      aria-busy={submission.sending}
      onFocusCapture={submission.preload}
      onBlur={validateField}
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
            required
            autoComplete="tel"
            maxLength={50}
          />
        </FieldGroup>
        <FieldGroup className="grid min-w-0 grid-cols-1 gap-6 tablet:grid-cols-2">
          <FormField
            id="job-application-job"
            label={t("fields.job.label")}
            required
            error={errors.job ? t(`errors.${errors.job}`) : undefined}
          >
            <NativeSelect
              id="job-application-job"
              name="job"
              required
              value={selectedJob}
              onChange={(event) => setSelectedJob(event.currentTarget.value)}
              autoComplete="off"
              aria-invalid={Boolean(errors.job)}
              aria-describedby={
                errors.job ? "job-application-job-error" : undefined
              }
            >
              {jobs.map((job) => (
                <NativeSelectOption
                  key={job.id}
                  value={job.id}
                  lang={job.contentLocale}
                >
                  {job.title}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
          <TextFormField {...field("start")} maxLength={120} />
        </FieldGroup>
        <TextFormField {...field("message")} type="textarea" maxLength={5000} />
        <FileDropzone
          id="job-application-files"
          label={t("upload.label")}
          hint={t("upload.hint")}
          choose={t("upload.choose")}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          error={fileError ? t(`errors.${fileError}`) : undefined}
          disabled={!interactive || submission.sending}
          onAdd={addFiles}
        />
        {files.length > 0 && (
          <ul
            className="flex min-w-0 flex-col gap-2"
            aria-label={t("upload.selected")}
          >
            {files.map((file, index) => (
              <li key={fileKey(file)} className="min-w-0">
                <Attachment>
                  <AttachmentMedia>
                    <Image
                      src="/images/reques-for-quote/file.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle title={file.name}>
                      {file.name}
                    </AttachmentTitle>
                    <AttachmentDescription>
                      {formatter.number(file.size / 1000, {
                        maximumFractionDigits: 1,
                      })}{" "}
                      kB · {t("upload.ready")}
                    </AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      type="button"
                      aria-label={t("upload.remove", { name: file.name })}
                      onClick={() => {
                        setFiles((current) =>
                          current.filter((_, i) => i !== index),
                        );
                        setFileError(undefined);
                        submission.clearStatus();
                      }}
                    >
                      <CloseIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              </li>
            ))}
          </ul>
        )}
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
          size="lg"
          disabled={!interactive || submission.sending}
          className="h-auto min-h-14 w-full py-4 whitespace-normal"
          loading={submission.sending}
          loadingLabel={status("sending")}
        >
          {submission.error ? status("retry") : t("submit")}
        </Button>
      </FieldSet>
      <FormSubmissionStatus
        error={submission.error?.reason}
        success={submission.success}
        email={recruitmentContact}
      />
      <noscript>
        <Text variant="small" tone="secondary">
          {t.rich("noScript", {
            address: recruitmentContact.label,
            email: (chunks) => (
              <a
                href={recruitmentContact.href}
                className="text-text-accent underline"
              >
                {chunks}
              </a>
            ),
          })}
        </Text>
      </noscript>
    </form>
  );
}
