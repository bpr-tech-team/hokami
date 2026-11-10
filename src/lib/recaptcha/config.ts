import { z } from "zod";

const configSchema = z.object({
  secret: z.string().min(1),
  minimumScore: z.coerce.number().min(0).max(1),
});

export function getRecaptchaConfig() {
  const result = configSchema.safeParse({
    secret: process.env.RECAPTCHA_SECRET_KEY,
    minimumScore: process.env.RECAPTCHA_MIN_SCORE || "0.5",
  });
  if (!result.success) return null;
  return {
    ...result.data,
    hostnames: (
      process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "hokami.cz,www.hokami.cz"
    )
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  };
}
