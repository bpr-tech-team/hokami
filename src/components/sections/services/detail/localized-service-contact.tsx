import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { ContactCta } from "@/components/sections/contact-cta/contact-cta";
import type { ServiceNamespace } from "./localized-service-hero";

export async function LocalizedServiceContact({
  namespace,
}: {
  namespace: ServiceNamespace;
}) {
  const [locale, t, common] = await Promise.all([
    getLocale(),
    getTranslations(namespace),
    getTranslations("ServiceDetail.contact"),
  ]);
  return (
    <ContactCta
      id="contact"
      eyebrow={common("eyebrow")}
      title={common("title")}
      description={t("contact.description")}
      action={{
        label: common("action"),
        href: getPathname({ locale, href: "/contact#contact-form" }),
      }}
    />
  );
}
