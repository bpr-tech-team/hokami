import { createFormHandler } from "@/lib/forms/handler";
import { recaptchaActions } from "@/lib/recaptcha/actions";
import {
  getWhistleblowingFieldErrors,
  submitWhistleblowingSchema,
} from "@/lib/whistleblowing/validation";

export const POST = createFormHandler({
  action: recaptchaActions.whistleblowing,
  schema: submitWhistleblowingSchema,
  fieldErrors: getWhistleblowingFieldErrors,
  recipient: () => process.env.WHISTLEBLOWING_TO_EMAIL,
  validate: (_data, files) => (files.length ? {} : undefined),
  message: ({ values, locale }) => ({
    subject: "HOKAMI — Whistleblowing",
    category: "Website whistleblowing",
    text: [
      "Whistleblowing HOKAMI",
      `Přijato (UTC): ${new Date().toISOString()}`,
      `Jazyk: ${locale}`,
      "Souhlas s podmínkami GDPR: ano",
      "",
      "Oznámení:",
      values.message,
    ].join("\n"),
  }),
});
