import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { SustainabilityCopy } from "../sustainability-copy";

export async function SustainabilityProduction() {
  const t = await getTranslations("SustainabilityProduction");

  return (
    <Section
      id="responsible-production"
      tone="subtle"
      eyebrow={t("eyebrow")}
      title={t("title")}
      layout="split-equal"
      headingClassName="desktop:gap-8"
    >
      <SustainabilityCopy paragraphs={[t("processes"), t("materials")]} />
    </Section>
  );
}
