import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { ContactLinks } from "@/components/sections/contact-links/contact-links";
import { Text } from "@/components/typography/text";
import { ButtonLink } from "@/components/ui/button/button-link";
import { company, formatCompanyAddress } from "@/content/company";

export async function ContactHero() {
  const [t, details] = await Promise.all([
    getTranslations("ContactHero"),
    getTranslations("CompanyDetails"),
  ]);

  return (
    <HeroSection
      id="hero"
      eyebrow={company.name}
      title={t("title")}
      size="compact"
      className="overflow-clip tablet:bg-surface-default"
    >
      <div className="flex w-full min-w-0 flex-col items-start gap-10 desktop:gap-16">
        <div className="flex w-full min-w-0 flex-col gap-2">
          <div className="flex items-start gap-3">
            <Image
              src="/images/contact/map-pin.svg"
              alt=""
              width={20}
              height={20}
              unoptimized
              className="shrink-0"
            />
            <Text tone="secondary" className="max-w-copy">
              {formatCompanyAddress(details("country"))}
            </Text>
          </div>
          <ContactLinks className="w-full gap-2" linkClassName="gap-3" />
        </div>
        <ButtonLink
          href="#contact-form"
          size="lg"
          className="min-h-14 w-[215px] max-w-full py-4 whitespace-normal desktop:w-auto"
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
      </div>
    </HeroSection>
  );
}
