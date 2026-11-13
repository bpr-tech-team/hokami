import { z } from "zod";

const configSchema = z.object({
  token: z.string().trim().min(1),
  from: z.email(),
  to: z.email(),
});

export function getMailtrapConfig(destination?: { to: string | undefined }) {
  const result = configSchema.safeParse({
    token: process.env.MAILTRAP_API_TOKEN,
    from: process.env.MAILTRAP_FROM_EMAIL,
    to: destination
      ? destination.to
      : process.env.FORMS_TO_EMAIL || "info@hokami.cz",
  });
  return result.success ? result.data : null;
}

export type FormEmail = {
  subject: string;
  text: string;
  category: string;
};

export type FormReplyTo = { email: string; name: string };

export async function sendFormEmail(
  config: NonNullable<ReturnType<typeof getMailtrapConfig>>,
  message: FormEmail,
  replyTo: FormReplyTo | undefined,
  files: readonly File[],
) {
  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      type: file.type || "application/octet-stream",
      disposition: "attachment",
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })),
  );
  const response = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      "User-Agent": "HOKAMI/1.0",
    },
    body: JSON.stringify({
      from: { email: config.from, name: "HOKAMI" },
      to: [{ email: config.to }],
      reply_to: replyTo
        ? { ...replyTo, name: replyTo.name.replace(/[\r\n]+/g, " ") }
        : undefined,
      ...message,
      attachments,
    }),
    signal: AbortSignal.timeout(30000),
  });
  const result: unknown = await response.json();
  if (
    !response.ok ||
    !result ||
    typeof result !== "object" ||
    !("success" in result) ||
    result.success !== true
  ) {
    // Do not log provider response bodies: they can contain personal data.
    console.error("Mailtrap submission failed", { status: response.status });
    throw new Error("Email submission failed");
  }
}
