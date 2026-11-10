import { submitForm } from "@/lib/forms/submit";
import { recaptchaActions } from "@/lib/recaptcha/actions";
import type { RequesForQuoteValues } from "@/lib/reques-for-quote/validation";

export { FormSubmitError as RequesForQuoteSubmitError } from "@/lib/forms/submit";

export function submitRequesForQuote(input: {
  values: RequesForQuoteValues;
  files: File[];
  locale: string;
  siteKey: string;
}) {
  return submitForm({
    ...input,
    endpoint: "/api/reques-for-quote",
    action: recaptchaActions.enquiry,
  });
}
