import { getLocale, getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/sections/contact-cta/contact-cta";
import { getPathname } from "@/i18n/navigation";

export async function SustainabilityContact() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("SustainabilityContact"),
  ]);

  return (
    <ContactCta
      id="contact"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      action={{
        label: t("contact"),
        href: getPathname({ locale, href: "/contact" }),
      }}
    />
  );
}
