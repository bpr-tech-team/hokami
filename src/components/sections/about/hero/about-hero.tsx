import { getLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { getPublicFormHref } from "@/lib/forms/navigation";

export async function AboutHero() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("AboutHero"),
  ]);

  return (
    <HeroSection
      id="hero"
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
          href: getPublicFormHref(locale, "/#reques-for-quote"),
          size: "lg",
        },
        { label: t("history"), href: "#history", size: "lg", showIcon: false },
      ]}
    />
  );
}
