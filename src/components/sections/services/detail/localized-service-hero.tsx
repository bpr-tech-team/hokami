import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { ServiceHero } from "./service-hero";

export type ServiceNamespace =
  | "Pcb"
  | "Tht"
  | "Cleaning"
  | "Testing"
  | "Coating"
  | "MechanicalAssembly"
  | "SmtStencils";

export async function LocalizedServiceHero({
  namespace,
  action,
  target,
}: {
  namespace: ServiceNamespace;
  action: "equipment" | "possibilities" | "checks" | "includedServices";
  target: string;
}) {
  const [locale, t, common] = await Promise.all([
    getLocale(),
    getTranslations(namespace),
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
      action={{ label: common(action), href: `#${target}` }}
    />
  );
}
