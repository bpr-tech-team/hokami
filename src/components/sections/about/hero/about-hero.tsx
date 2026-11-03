import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { HeroBackground } from "@/components/sections/hero/hero-background";
import {
  desktopArtwork,
  type HeroArtwork,
} from "@/components/sections/hero/hero-artwork";

// Figma's About artwork shifts one contact and adds another to the shared traces.
const aboutArtwork = {
  ...desktopArtwork,
  vias: [
    ...desktopArtwork.vias.map((via, index) =>
      index === 3 ? { x: 256.5, y: 651.5 } : via,
    ),
    { x: 115.5, y: 176.5 },
  ],
} satisfies HeroArtwork;

export async function AboutHero() {
  const t = await getTranslations("AboutHero");

  return (
    <HeroSection
      id="hero"
      className="min-h-0 overflow-clip tablet:min-h-0 tablet:bg-surface-default desktop:pt-32"
      contentClassName="gap-8"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionProps={{
        variant: "lead",
        tone: "secondary",
        className: "max-w-copy",
      }}
      actionsClassName="gap-4"
      actions={[
        { label: t("contact"), href: "#contact", size: "lg" },
        { label: t("history"), href: "#history", size: "lg", showIcon: false },
      ]}
      background={
        <HeroBackground
          className="tablet:-top-[142px] tablet:-bottom-[242px]"
          desktopArtwork={aboutArtwork}
          desktopClassName="tablet:top-[calc(50%-34px)] tablet:opacity-50"
        />
      }
    />
  );
}
