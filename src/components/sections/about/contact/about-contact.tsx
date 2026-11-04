import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button/button-link";
import { getPathname } from "@/i18n/navigation";
import { ContactLinks } from "@/components/sections/contact-links/contact-links";

export async function AboutContact() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("AboutContact"),
  ]);

  return (
    <Section
      id="contact"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionTone="secondary"
      descriptionClassName="max-w-copy"
      className="bg-surface-accent-subtle"
      contentClassName="desktop:grid desktop:grid-cols-[minmax(0,1fr)_384px] desktop:items-end desktop:gap-6"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <ButtonLink
          href={getPathname({ locale, href: "/#reques-for-quote" })}
          size="lg"
          className="w-full"
          icon={
            <Image
              src="/images/about/contact/arrow-right.svg"
              alt=""
              width={20}
              height={20}
              unoptimized
            />
          }
        >
          {t("contact")}
        </ButtonLink>
        <ContactLinks />
      </div>
    </Section>
  );
}
