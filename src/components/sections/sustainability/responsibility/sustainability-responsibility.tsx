import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { FeatureCardGrid } from "@/components/sections/feature-cards/feature-card-grid";
import { responsibilityCards } from "./data";

export async function SustainabilityResponsibility() {
  const t = await getTranslations("SustainabilityResponsibility");

  return (
    <Section
      id="responsibility"
      eyebrow={t("eyebrow")}
      title={t("title")}
      contentClassName="gap-10 desktop:gap-16"
    >
      <FeatureCardGrid
        items={responsibilityCards.map(({ id, icon }) => ({
          id,
          icon,
          title: t(`cards.${id}.title`),
          description: t(`cards.${id}.description`),
        }))}
      />
    </Section>
  );
}
