import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { MonoText } from "@/components/typography/mono-text";
import { RequesForQuoteForm } from "./reques-for-quote-form";

export async function RequesForQuote() {
  const t = await getTranslations("RequesForQuote");

  return (
    <Section
      id="reques-for-quote"
      layout="split"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionTone="secondary"
      metadata={
        <MonoText variant="meta" tone="tertiary">
          {t("assurance")}
        </MonoText>
      }
    >
      <RequesForQuoteForm
        previewUploads={process.env.NODE_ENV === "development"}
      />
    </Section>
  );
}
