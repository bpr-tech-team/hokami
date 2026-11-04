import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(120, "tooLong"),
  email: z
    .string()
    .trim()
    .min(1, "emailRequired")
    .max(254, "tooLong")
    .pipe(z.email({ error: "emailInvalid" })),
  phone: z.string().trim().max(50, "tooLong"),
  message: z.string().trim().min(1, "messageRequired").max(5000, "tooLong"),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type ContactFieldName = keyof ContactValues;
export type ContactErrorKey =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "messageRequired"
  | "tooLong";
export type ContactFieldErrors = Partial<
  Record<ContactFieldName, ContactErrorKey>
>;
export const contactFieldNames = Object.keys(
  contactSchema.shape,
) as ContactFieldName[];

export function getContactFieldErrors(error: Pick<z.ZodError, "issues">) {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactFieldName;
    if (contactFieldNames.includes(field))
      errors[field] ??= issue.message as ContactErrorKey;
  }
  return errors;
}
