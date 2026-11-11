import { createTranslator, type Locale } from "next-intl";
import type { FormEmail } from "@/lib/mailtrap/send";
import type { RequesForQuoteValues } from "./validation";

export async function createRequesForQuoteEmail({
  values,
  locale,
}: {
  values: RequesForQuoteValues;
  locale: Locale;
}): Promise<FormEmail> {
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  const industry = values.industry
    ? values.industry === "other"
      ? t("RequesForQuote.fields.industry.other")
      : t(`Industries.items.${values.industry}.name`)
    : "—";
  const volume = values.volume
    ? t(`RequesForQuote.fields.volume.options.${values.volume}`)
    : "—";

  return {
    subject: "HOKAMI — Poptávka z webu",
    category: "Website enquiry",
    text: [
      "Poptávka z webu HOKAMI",
      `Jazyk: ${locale}`,
      `Jméno: ${values.name}`,
      `Firma: ${values.company}`,
      `E-mail: ${values.email}`,
      `Země: ${values.country || "—"}`,
      `Obor: ${industry}`,
      `Roční objem: ${volume}`,
      "",
      "Projekt:",
      values.project || "—",
    ].join("\n"),
  };
}
