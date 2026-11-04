import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { GoogleMapEmbed } from "@/components/integrations/maps/google-map-embed";
import { MonoText } from "@/components/typography/mono-text";
import { company, formatCompanyAddress } from "@/content/company";

export async function ContactDirections() {
  const [t, details] = await Promise.all([
    getTranslations("ContactDirections"),
    getTranslations("CompanyDetails"),
  ]);

  return (
    <Section
      id="directions"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={formatCompanyAddress(details("country"))}
      descriptionTone="secondary"
      layout="split-equal"
      contentClassName="gap-10 desktop:gap-6"
      metadata={
        <a
          href={company.maps.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-describedby="directions-new-tab"
          className="group/map-link relative flex min-h-11 w-fit max-w-full items-center gap-2 py-3 text-text-accent transition-colors after:absolute after:bottom-[6.5px] after:left-0 after:h-[1.5px] after:w-[5%] after:bg-current after:transition-[width] after:duration-250 hover:text-text-accent-hover hover:after:w-full focus-visible:after:w-full"
        >
          <MonoText as="span" className="min-w-0 text-current">
            {t("openMap")}
          </MonoText>
          <Image
            src="/images/about/press/external-link.svg"
            alt=""
            width={16}
            height={16}
            unoptimized
            className="shrink-0"
          />
          <span id="directions-new-tab" className="sr-only">
            {t("opensInNewTab")}
          </span>
        </a>
      }
    >
      <GoogleMapEmbed src={company.maps.embedUrl} title={t("mapTitle")} />
    </Section>
  );
}
