import { createFormHandler } from "@/lib/forms/handler";
import {
  getJobApplicationErrors,
  submitJobApplicationSchema,
  validateJobFiles,
} from "@/lib/jobs/application-validation";
import {
  readJobAvailability,
  readJobApplicationOption,
} from "@/lib/jobs/availability";
import { recaptchaActions } from "@/lib/recaptcha/actions";
import { getJobUrl } from "@/lib/jobs/urls";

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
  message: async ({ values, locale }) => {
    const job = await readJobApplicationOption(values.job, locale);
    if (!job) throw new Error("The selected vacancy is no longer available.");
    return {
      subject: `HOKAMI — Přihláška na pozici: ${job.title}`,
      category: "Job application",
      text: [
        "Přihláška na pracovní pozici HOKAMI",
        `Jazyk: ${locale}`,
        `Pozice: ${job.title}`,
        `Odkaz: ${getJobUrl(values.job, locale)}`,
        `Jméno: ${values.name}`,
        `E-mail: ${values.email}`,
        `Telefon: ${values.phone}`,
        `Možný nástup: ${values.start || "—"}`,
        "",
        "Průvodní zpráva:",
        values.message || "—",
      ].join("\n"),
    };
  },
});
