import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";

export async function HomeHero() {
  const t = await getTranslations("Hero");

  return (
    <HeroSection
      id="hero"
      eyebrow={t("eyebrow")}
      title={t.rich("title", {
        accent: (chunks) => (
          <span className="text-brand-identity">{chunks}</span>
        ),
      })}
      description={t("description")}
      actions={[
        { label: t("contact"), href: "#reques-for-quote" },
        { label: t("production"), href: "#industries" },
      ]}
    />
  );
}
