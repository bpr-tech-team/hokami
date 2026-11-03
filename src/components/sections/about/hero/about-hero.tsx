import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";

export async function AboutHero() {
  const t = await getTranslations("AboutHero");

  return (
    <HeroSection
      id="hero"
      contentClassName="gap-8"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionProps={{
        variant: "lead",
        tone: "secondary",
        className: "max-w-copy",
      }}
      actionsClassName="gap-4"
      actions={[
        { label: t("contact"), href: "#contact", size: "lg" },
        { label: t("history"), href: "#history", size: "lg", showIcon: false },
      ]}
    />
  );
}
