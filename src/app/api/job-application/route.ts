import { createFormHandler } from "@/lib/forms/handler";
import {
  getJobApplicationErrors,
  submitJobApplicationSchema,
  validateJobFiles,
} from "@/lib/jobs/application-validation";
import { readJobAvailability } from "@/lib/jobs/availability";
import { recaptchaActions } from "@/lib/recaptcha/actions";

export const POST = createFormHandler({
  action: recaptchaActions.jobApplication,
  schema: submitJobApplicationSchema,
  fieldErrors: getJobApplicationErrors,
  validate: async ({ values, locale }, files) => {
    const fileError = validateJobFiles(files);
    if (fileError) return { fileError };
    const job = await readJobAvailability(values.job);
    if (
      !job ||
      job.status !== "published" ||
      !job.visibleLocales.some((value) => value === locale)
    )
      return { fields: { job: "jobInvalid" } };
  },
  message: ({ values, locale }) => ({
    subject: `HOKAMI — Přihláška na pozici: ${values.job}`,
    category: "Job application",
    text: [
      "Přihláška na pracovní pozici HOKAMI",
      `Jazyk: ${locale}`,
      `Pozice: ${values.job}`,
      `Odkaz: https://hokami.cz/${locale}/jobs/${values.job}`,
      `Jméno: ${values.name}`,
      `E-mail: ${values.email}`,
      `Telefon: ${values.phone}`,
      `Možný nástup: ${values.start || "—"}`,
      "",
      "Průvodní zpráva:",
      values.message || "—",
    ].join("\n"),
  }),
});
