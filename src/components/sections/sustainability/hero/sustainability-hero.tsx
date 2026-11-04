import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";

export async function SustainabilityHero() {
  const t = await getTranslations("SustainabilityHero");

  return (
    <HeroSection
      id="hero"
      layout="section"
      size="compact"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionVisibility="always"
      descriptionProps={{
        variant: "lead",
        tone: "secondary",
        className: "max-w-copy",
      }}
    />
  );
}
