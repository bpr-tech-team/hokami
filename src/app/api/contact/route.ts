import { createFormHandler } from "@/lib/forms/handler";
import {
  getContactFieldErrors,
  submitContactSchema,
} from "@/lib/contact/validation";
import { recaptchaActions } from "@/lib/recaptcha/actions";

export const POST = createFormHandler({
  action: recaptchaActions.contact,
  schema: submitContactSchema,
  fieldErrors: getContactFieldErrors,
  validate: (_data, files) => (files.length ? {} : undefined),
  message: ({ values, locale }) => ({
    subject: "HOKAMI — Kontaktní formulář",
    category: "Website contact",
    text: [
      "Kontaktní formulář HOKAMI",
      `Jazyk: ${locale}`,
      `Jméno: ${values.name}`,
      `E-mail: ${values.email}`,
      `Telefon: ${values.phone || "—"}`,
      "",
      "Zpráva:",
      values.message,
    ].join("\n"),
  }),
});
