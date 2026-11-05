import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { sectionVariants } from "@/components/layout/section-variants";
import { MediaTextBlock } from "@/components/sections/media-text/media-text-block";
import { FeatureCardGrid } from "@/components/sections/feature-cards/feature-card-grid";
import { Text } from "@/components/typography/text";
import { smtFeatureCards, smtProductionBlocks } from "./data";

export async function SmtProduction() {
  const t = await getTranslations("Smt");
  return (
    <div className={sectionVariants()}>
      <Container className="flex flex-col gap-10 desktop:gap-16">
        {smtProductionBlocks.map(({ id, image, imagePosition }) => (
          <MediaTextBlock
            key={id}
            id={id}
            eyebrow={t(`${id}.eyebrow`)}
            title={t(`${id}.title`)}
            image={{ src: image, alt: t(`${id}.imageAlt`) }}
            imagePosition={imagePosition}
          >
            <Text tone="secondary">{t(`${id}.description`)}</Text>
          </MediaTextBlock>
        ))}
        <FeatureCardGrid
          items={smtFeatureCards.map(({ id, icon }) => ({
            id,
            icon,
            title: t(`cards.${id}.title`),
            description: t(`cards.${id}.description`),
          }))}
        />
      </Container>
    </div>
  );
}
