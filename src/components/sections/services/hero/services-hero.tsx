import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { HeroSection } from "@/components/sections/hero/hero-section";

export async function ServicesHero() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("ServicesHero"),
  ]);

  return (
    <HeroSection
      id="hero"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      actions={[
        {
          label: t("contact"),
          href: getPathname({ locale, href: "/contact" }),
        },
      ]}
    />
  );
}
