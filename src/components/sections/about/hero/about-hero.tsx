import { getLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { getPathname } from "@/i18n/navigation";

export async function AboutHero() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("AboutHero"),
  ]);

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
        {
          label: t("contact"),
          href: getPathname({ locale, href: "/#reques-for-quote" }),
          size: "lg",
        },
        { label: t("history"), href: "#history", size: "lg", showIcon: false },
      ]}
    />
  );
}
