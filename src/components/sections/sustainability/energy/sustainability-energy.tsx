import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { PhotoTrace } from "@/components/ui/photo-trace";
import { SustainabilityCopy } from "../sustainability-copy";

export async function SustainabilityEnergy() {
  const t = await getTranslations("SustainabilityEnergy");

  return (
    <Section
      id="energy"
      eyebrow={t("eyebrow")}
      title={t("title")}
      layout="split-equal"
      headingClassName="desktop:gap-8"
      headerClassName="desktop:gap-8"
      contentClassName="gap-10 desktop:gap-6"
      metadata={
        <SustainabilityCopy
          paragraphs={[t("technology"), t("photovoltaics")]}
        />
      }
    >
      <div className="relative aspect-3/2 min-w-0">
        <Image
          src="/images/sustainability/forest.png"
          alt=""
          fill
          sizes="(min-width: 1360px) 588px, (min-width: 1080px) calc((100vw - 184px) / 2), (min-width: 760px) calc(100vw - 80px), calc(100vw - 40px)"
          className="object-cover"
        />
        <PhotoTrace />
      </div>
    </Section>
  );
}
