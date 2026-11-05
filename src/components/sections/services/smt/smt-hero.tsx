import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { ServiceHero } from "../detail/service-hero";

export async function SmtHero() {
  const [locale, t, common] = await Promise.all([
    getLocale(),
    getTranslations("Smt"),
    getTranslations("ServiceDetail"),
  ]);
  return (
    <ServiceHero
      eyebrow={common("eyebrow")}
      title={t("hero.title")}
      description={t("hero.description")}
      backLink={{
        label: common("back"),
        href: getPathname({ locale, href: "/services" }),
      }}
      action={{ label: common("equipment"), href: "#equipment" }}
    />
  );
}
