import { getLocale, getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/sections/contact-cta/contact-cta";
import { getPathname } from "@/i18n/navigation";

export async function AboutContact() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("AboutContact"),
  ]);

  return (
    <ContactCta
      id="contact"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      action={{
        label: t("contact"),
        href: getPathname({ locale, href: "/#reques-for-quote" }),
      }}
    />
  );
}
