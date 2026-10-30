import { verifyRecaptcha } from "@/lib/recaptcha/verify";
import { getRequesForQuoteConfig } from "@/lib/reques-for-quote/config";
import {
  readRequesForQuoteRequest,
  requesForQuoteResponse,
} from "@/lib/reques-for-quote/http";
import {
  getFieldErrors,
  submitRequesForQuoteSchema,
  validateFiles,
} from "@/lib/reques-for-quote/validation";

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await readRequesForQuoteRequest(request);
  } catch {
    return requesForQuoteResponse({ success: false, error: "validation" }, 400);
  }
  const result = submitRequesForQuoteSchema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      ...issue,
      path: issue.path[0] === "values" ? issue.path.slice(1) : issue.path,
    }));
    return requesForQuoteResponse(
      {
        success: false,
        error: "validation",
        fields: getFieldErrors({ issues }),
      },
      400,
    );
  }
  const fileError = validateFiles(result.data.files);
  if (fileError)
    return requesForQuoteResponse(
      { success: false, error: "validation", fileError },
      400,
    );
  const config = getRequesForQuoteConfig();
  if (!config)
    return requesForQuoteResponse(
      { success: false, error: "unavailable" },
      503,
    );
  try {
    const verified = await verifyRecaptcha(result.data.recaptchaToken, {
      secret: config.recaptchaSecret,
      hostnames: config.hostnames,
      minimumScore: config.minimumScore,
    });
    if (!verified)
      return requesForQuoteResponse({ success: false, error: "captcha" }, 403);
  } catch {
    return requesForQuoteResponse(
      { success: false, error: "unavailable" },
      503,
    );
  }
  return requesForQuoteResponse({ success: false, error: "unavailable" }, 503);
}
