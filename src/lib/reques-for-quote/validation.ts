import { z } from "zod";
import { industries } from "@/content/industries";
import {
  MAX_ATTACHMENT_BYTES,
  isValidAttachmentName,
  submissionMetadataSchema,
} from "@/lib/forms/validation";

export const industryOptions = [
  ...industries.map(({ id }) => id),
  "other",
] as const;
export const volumeOptions = [
  "prototype",
  "under100",
  "under1000",
  "under10000",
  "over10000",
  "unsure",
] as const;

export const requesForQuoteSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(120, "tooLong"),
  company: z.string().trim().min(1, "companyRequired").max(200, "tooLong"),
  email: z
    .string()
    .trim()
    .min(1, "emailRequired")
    .max(254, "tooLong")
    .pipe(z.email({ error: "emailInvalid" })),
  country: z.string().trim().max(100, "tooLong"),
  industry: z.enum(["", ...industryOptions], { error: "invalidOption" }),
  volume: z.enum(["", ...volumeOptions], { error: "invalidOption" }),
  project: z.string().trim().max(5000, "tooLong"),
});

export type RequesForQuoteValues = z.infer<typeof requesForQuoteSchema>;
export type RequesForQuoteFieldName = keyof RequesForQuoteValues;
export type RequesForQuoteErrorKey =
  | "nameRequired"
  | "companyRequired"
  | "emailRequired"
  | "emailInvalid"
  | "tooLong"
  | "invalidOption"
  | "filesSize"
  | "filesCount"
  | "filesEmpty"
  | "fileName";
export type RequesForQuoteFieldErrors = Partial<
  Record<RequesForQuoteFieldName, RequesForQuoteErrorKey>
>;

export const requesForQuoteFieldNames = Object.keys(
  requesForQuoteSchema.shape,
) as RequesForQuoteFieldName[];
export const MAX_FILES = 10;
export const MAX_FILES_BYTES = MAX_ATTACHMENT_BYTES;

export const submitRequesForQuoteSchema = submissionMetadataSchema.extend({
  values: requesForQuoteSchema,
});

export function getFieldErrors(
  error: Pick<z.ZodError, "issues">,
): RequesForQuoteFieldErrors {
  const errors: RequesForQuoteFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as RequesForQuoteFieldName;
    if (requesForQuoteFieldNames.includes(field))
      errors[field] ??= issue.message as RequesForQuoteErrorKey;
  }
  return errors;
}

export function validateFiles(
  files: readonly { name: string; size: number }[],
): RequesForQuoteErrorKey | undefined {
  if (files.length > MAX_FILES) return "filesCount";
  if (files.some((file) => file.size <= 0)) return "filesEmpty";
  if (files.some((file) => !isValidAttachmentName(file.name)))
    return "fileName";
  if (files.reduce((total, file) => total + file.size, 0) > MAX_FILES_BYTES)
    return "filesSize";
}
