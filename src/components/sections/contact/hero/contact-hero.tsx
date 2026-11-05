import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { ButtonLink } from "@/components/ui/button/button-link";
import { company } from "@/content/company";

export async function ContactHero() {
  const t = await getTranslations("ContactHero");

  return (
    <HeroSection
      id="hero"
      eyebrow={company.name}
      title={t("title")}
      size="compact"
      className="overflow-clip tablet:bg-surface-default"
    >
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
    </HeroSection>
  );
}
