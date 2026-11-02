import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";

export async function HomeHero() {
  const t = await getTranslations("Hero");

  return (
    <HeroSection
      id="hero"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionVisibility="tablet"
      actions={[
        { label: t("contact"), href: "#reques-for-quote" },
        { label: t("production"), href: "#capabilities" },
      ]}
    />
  );
}
