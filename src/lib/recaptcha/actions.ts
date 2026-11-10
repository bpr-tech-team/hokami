export const recaptchaActions = {
  enquiry: "reques_for_quote_submit",
  contact: "contact_submit",
  jobApplication: "job_application_submit",
} as const;

export type RecaptchaAction =
  (typeof recaptchaActions)[keyof typeof recaptchaActions];
