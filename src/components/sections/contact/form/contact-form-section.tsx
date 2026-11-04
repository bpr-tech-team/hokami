import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { ContactForm } from "./contact-form";

export async function ContactFormSection() {
  const t = await getTranslations("ContactForm");
  return (
    <Section
      id="contact-form"
      tone="subtle"
      eyebrow={t("eyebrow")}
      title={t("title")}
      headingClassName="max-w-[508px]"
      contentClassName="gap-4 desktop:gap-4"
    >
      <ContactForm />
    </Section>
  );
}
