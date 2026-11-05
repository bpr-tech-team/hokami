import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/sections/contact-cta/contact-cta";
import { recruitmentContact } from "../data";

export async function JobsContact() {
  const t = await getTranslations("Jobs.contact");

  return (
    <ContactCta
      id="resume"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      action={{ label: t("action"), href: recruitmentContact.href }}
      contacts={[recruitmentContact]}
    />
  );
}
