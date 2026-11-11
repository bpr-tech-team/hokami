import { getLocale, getTranslations } from "next-intl/server";
import { getPublicFormHref } from "@/lib/forms/navigation";
import { ContactCta } from "@/components/sections/contact-cta/contact-cta";

export async function SmtContact() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Smt.contact"),
  ]);
  return (
    <ContactCta
      id="contact"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      action={{
        label: t("action"),
        href: getPublicFormHref(locale, "/contact#contact-form"),
      }}
    />
  );
}
