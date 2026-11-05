import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { recruitmentContact } from "../data";

export async function JobsHero() {
  const t = await getTranslations("Jobs.hero");

  return (
    <HeroSection
      id="hero"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionProps={{ tone: "secondary", className: "max-w-copy" }}
      className="min-h-[max(489px,calc(100svh-var(--site-header-height)))] pb-60 tablet:min-h-[max(740px,calc(100svh-var(--site-header-height)))] tablet:pb-60 desktop:pb-60"
      actionsClassName="mt-4 w-full gap-4 desktop:mt-10"
      actions={[
        {
          label: t("positions"),
          href: "#positions",
          size: "lg",
          className: "w-full tablet:w-auto",
        },
        {
          label: t("resume"),
          href: recruitmentContact.href,
          size: "lg",
          showIcon: false,
          className: "w-full tablet:w-auto",
        },
      ]}
    />
  );
}
