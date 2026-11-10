import { createFormHandler } from "@/lib/forms/handler";
import { recaptchaActions } from "@/lib/recaptcha/actions";
import {
  getFieldErrors,
  submitRequesForQuoteSchema,
  validateFiles,
} from "@/lib/reques-for-quote/validation";

export const POST = createFormHandler({
  action: recaptchaActions.enquiry,
  schema: submitRequesForQuoteSchema,
  fieldErrors: getFieldErrors,
  validate: (_data, files) => {
    const fileError = validateFiles(files);
    return fileError ? { fileError } : undefined;
  },
  message: ({ values, locale }) => ({
    subject: "HOKAMI — Poptávka z webu",
    category: "Website enquiry",
    text: [
      "Poptávka z webu HOKAMI",
      `Jazyk: ${locale}`,
      `Jméno: ${values.name}`,
      `Firma: ${values.company}`,
      `E-mail: ${values.email}`,
      `Země: ${values.country || "—"}`,
      `Obor: ${values.industry || "—"}`,
      `Roční objem: ${values.volume || "—"}`,
      "",
      "Projekt:",
      values.project || "—",
    ].join("\n"),
  }),
});
