import { z } from "zod";
import { routing } from "@/i18n/routing";

export const submissionMetadataSchema = z.object({
  locale: z.enum(routing.locales),
  recaptchaToken: z.string().min(1).max(8192),
});

export const MAX_ATTACHMENT_BYTES = 4_000_000;

export function isValidAttachmentName(name: string) {
  return (
    Boolean(name.trim()) && name.length <= 255 && !/[\x00-\x1f/\\]/.test(name)
  );
}
