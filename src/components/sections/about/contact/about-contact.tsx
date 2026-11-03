import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button/button-link";
import { getPathname } from "@/i18n/navigation";

const contacts = [
  {
    label: "+420 482 425 984",
    href: "tel:+420482425984",
    icon: "/images/about/contact/phone.svg",
  },
  {
    label: "info@hokami.cz",
    href: "mailto:info@hokami.cz",
    icon: "/images/about/contact/mail.svg",
  },
] as const;

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
        {contacts.map(({ label, href, icon }) => (
          <a
            key={href}
            href={href}
            className="flex min-h-11 items-center gap-2 text-text-accent underline decoration-from-font underline-offset-auto transition-colors hover:text-text-accent-hover"
          >
            <Image src={icon} alt="" width={20} height={20} unoptimized />
            {label}
          </a>
        ))}
      </div>
    </Section>
  );
}
