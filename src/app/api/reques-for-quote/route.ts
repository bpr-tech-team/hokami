import { createFormHandler } from "@/lib/forms/handler";
import { recaptchaActions } from "@/lib/recaptcha/actions";
import { createRequesForQuoteEmail } from "@/lib/reques-for-quote/email";
import {
  getFieldErrors,
  submitRequesForQuoteSchema,
  validateFiles,
} from "@/lib/reques-for-quote/validation";

export const POST = createFormHandler({
  action: recaptchaActions.enquiry,
  schema: submitRequesForQuoteSchema,
  fieldErrors: getFieldErrors,
  replyTo: ({ values }) => ({ name: values.name, email: values.email }),
  validate: (_data, files) => {
    const fileError = validateFiles(files);
    return fileError ? { fileError } : undefined;
  },
  message: createRequesForQuoteEmail,
});
