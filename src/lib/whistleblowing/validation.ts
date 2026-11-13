import { z } from "zod";
import { submissionMetadataSchema } from "@/lib/forms/validation";

export const MAX_WHISTLEBLOWING_MESSAGE_LENGTH = 2000;

export const whistleblowingSchema = z.strictObject({
  message: z
    .string({ error: "messageRequired" })
    .trim()
    .min(1, "messageRequired")
    // HTML maxlength uses UTF-16 units; Zod's max counts Unicode code points.
    .refine(
      (value) => value.length <= MAX_WHISTLEBLOWING_MESSAGE_LENGTH,
      "tooLong",
    ),
  consent: z.literal(true, { error: "consentRequired" }),
});

export const submitWhistleblowingSchema = submissionMetadataSchema.extend({
  values: whistleblowingSchema,
});

export const whistleblowingFieldNames = ["message", "consent"] as const;
export type WhistleblowingFieldName = (typeof whistleblowingFieldNames)[number];
export type WhistleblowingErrorKey =
  "messageRequired" | "tooLong" | "consentRequired";
export type WhistleblowingFieldErrors = Partial<
  Record<WhistleblowingFieldName, WhistleblowingErrorKey>
>;

export function getWhistleblowingFieldErrors(
  error: Pick<z.ZodError, "issues">,
) {
  const errors: WhistleblowingFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === "message" || field === "consent")
      errors[field] ??= issue.message as WhistleblowingErrorKey;
  }
  return errors;
}
