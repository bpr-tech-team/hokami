import { z } from "zod";
import {
  MAX_ATTACHMENT_BYTES,
  isValidAttachmentName,
  submissionMetadataSchema,
} from "@/lib/forms/validation";

export const JOB_FILES_MAX_BYTES = MAX_ATTACHMENT_BYTES;
export const jobApplicationFieldNames = [
  "name",
  "email",
  "phone",
  "job",
  "start",
  "message",
] as const;
export type JobApplicationField = (typeof jobApplicationFieldNames)[number];
export type JobApplicationError =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "phoneRequired"
  | "phoneInvalid"
  | "jobInvalid"
  | "tooLong";
export type JobApplicationErrors = Partial<
  Record<JobApplicationField, JobApplicationError>
>;

export function jobApplicationSchema(jobIds?: readonly string[]) {
  return z.object({
    name: z.string().trim().min(1, "nameRequired").max(120, "tooLong"),
    email: z
      .string()
      .trim()
      .min(1, "emailRequired")
      .max(254, "tooLong")
      .pipe(z.email({ error: "emailInvalid" })),
    phone: z
      .string()
      .trim()
      .min(1, "phoneRequired")
      .max(50, "tooLong")
      .refine(
        (value) =>
          !value || (/^\+?[\d\s().-]+$/.test(value) && /\d/.test(value)),
        "phoneInvalid",
      ),
    job: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "jobInvalid")
      .refine((value) => !jobIds || jobIds.includes(value), "jobInvalid"),
    start: z.string().trim().max(120, "tooLong"),
    message: z.string().trim().max(5000, "tooLong"),
  });
}

export const submitJobApplicationSchema = submissionMetadataSchema.extend({
  values: jobApplicationSchema(),
});

export function getJobApplicationErrors(
  error: Pick<z.ZodError, "issues">,
): JobApplicationErrors {
  const errors: JobApplicationErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as JobApplicationField;
    if (jobApplicationFieldNames.includes(field))
      errors[field] ??= issue.message as JobApplicationError;
  }
  return errors;
}

export type JobFileError =
  "fileFormat" | "fileEmpty" | "filesTooLarge" | "fileName";
type FileMetadata = Pick<File, "name" | "size" | "type">;
const mimeTypes: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function validateJobFiles(
  files: readonly FileMetadata[],
): JobFileError | undefined {
  for (const file of files) {
    if (!isValidAttachmentName(file.name)) return "fileName";
    const extension = file.name.split(".").at(-1)?.toLowerCase() ?? "";
    const mime = file.type.toLowerCase();
    if (
      !Object.hasOwn(mimeTypes, extension) ||
      (mime &&
        mime !== "application/octet-stream" &&
        mime !== mimeTypes[extension])
    )
      return "fileFormat";
    if (!Number.isFinite(file.size) || file.size <= 0) return "fileEmpty";
  }
  if (files.reduce((total, file) => total + file.size, 0) > JOB_FILES_MAX_BYTES)
    return "filesTooLarge";
}
