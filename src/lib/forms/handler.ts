import type { z } from "zod";
import type { RecaptchaAction } from "@/lib/recaptcha/actions";
import { getRecaptchaConfig } from "@/lib/recaptcha/config";
import { verifyRecaptcha } from "@/lib/recaptcha/verify";
import {
  getMailtrapConfig,
  sendFormEmail,
  type FormEmail,
  type FormReplyTo,
} from "@/lib/mailtrap/send";
import { formResponse, readFormRequest } from "./http";

type Submission = {
  locale: string;
  recaptchaToken: string;
};

export function createFormHandler<T extends Submission>(options: {
  action: RecaptchaAction;
  schema: z.ZodType<T>;
  fieldErrors: (error: Pick<z.ZodError, "issues">) => object;
  recipient?: () => string | undefined;
  replyTo?: (data: T) => FormReplyTo;
  validate: (
    data: T,
    files: File[],
  ) => Promise<object | undefined> | object | undefined;
  message: (data: T) => FormEmail | Promise<FormEmail>;
}) {
  return async function POST(request: Request) {
    let parsed: Awaited<ReturnType<typeof readFormRequest>>;
    try {
      parsed = await readFormRequest(request);
    } catch {
      return formResponse({ success: false, error: "validation" }, 400);
    }
    const result = options.schema.safeParse(parsed.input);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        ...issue,
        path: issue.path[0] === "values" ? issue.path.slice(1) : issue.path,
      }));
      return formResponse(
        {
          success: false,
          error: "validation",
          fields: options.fieldErrors({ issues }),
        },
        400,
      );
    }
    try {
      const validation = await options.validate(result.data, parsed.files);
      if (validation)
        return formResponse(
          { success: false, error: "validation", ...validation },
          400,
        );
      const captcha = getRecaptchaConfig();
      const mailtrap = getMailtrapConfig(
        options.recipient ? { to: options.recipient() } : undefined,
      );
      if (!captcha)
        console.error("reCAPTCHA verification unavailable", {
          action: options.action,
          reason: "invalid_configuration",
        });
      if (!captcha || !mailtrap)
        return formResponse({ success: false, error: "unavailable" }, 503);
      let verified: boolean;
      try {
        verified = await verifyRecaptcha(result.data.recaptchaToken, {
          ...captcha,
          action: options.action,
        });
      } catch {
        return formResponse({ success: false, error: "unavailable" }, 503);
      }
      if (!verified)
        return formResponse({ success: false, error: "captcha" }, 403);
      await sendFormEmail(
        mailtrap,
        await options.message(result.data),
        options.replyTo?.(result.data),
        parsed.files,
      );
      return formResponse({ success: true });
    } catch {
      console.error("Form submission failed", { action: options.action });
      return formResponse({ success: false, error: "send" }, 502);
    }
  };
}
