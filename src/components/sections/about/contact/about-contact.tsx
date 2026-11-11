import { getLocale, getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/sections/contact-cta/contact-cta";
import { getPublicFormHref } from "@/lib/forms/navigation";

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
        href: getPublicFormHref(locale, "/#reques-for-quote"),
      }}
    />
  );
}
