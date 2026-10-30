import { z } from "zod";
import { RECAPTCHA_ACTION } from "@/lib/reques-for-quote/validation";

const responseSchema = z.object({
  success: z.literal(true),
  score: z.number().min(0).max(1),
  action: z.literal(RECAPTCHA_ACTION),
  hostname: z.string(),
  challenge_ts: z.iso.datetime(),
});

type VerificationOptions = {
  secret: string;
  hostnames: string[];
  minimumScore: number;
};

export async function verifyRecaptcha(
  token: string,
  options: VerificationOptions,
) {
  if (!token || !options.secret || !options.hostnames.length) return false;
  const response = await fetch(
    "https://www.recaptcha.net/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: options.secret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    },
  );
  if (!response.ok) throw new Error("reCAPTCHA service unavailable");
  const result = responseSchema.safeParse(await response.json());
  if (!result.success) return false;
  const age = Date.now() - Date.parse(result.data.challenge_ts);
  return (
    result.data.score >= options.minimumScore &&
    options.hostnames.includes(result.data.hostname) &&
    age >= -10000 &&
    age <= 120000
  );
}
