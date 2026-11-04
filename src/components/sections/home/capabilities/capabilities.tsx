import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { FeatureCardGrid } from "@/components/sections/feature-cards/feature-card-grid";

const capabilities = [
  { id: "assembly", icon: "/images/capabilities/cpu.svg" },
  { id: "production", icon: "/images/capabilities/layers.svg" },
  { id: "testing", icon: "/images/capabilities/search.svg" },
] as const;

export async function Capabilities() {
  const t = await getTranslations("Capabilities");

  return (
    <Section
      id="capabilities"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionTone="black"
      descriptionClassName="desktop:min-h-[87px]"
      contentClassName="desktop:min-h-[538px]"
    >
      <FeatureCardGrid
        items={capabilities.map(({ id, icon }) => ({
          id,
          icon,
          title: t(`cards.${id}.title`),
          description: t(`cards.${id}.description`),
        }))}
      />
    </Section>
  );
}
