import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { Section } from "@/components/layout/section";
import { ImageAccordion } from "@/components/sections/image-accordion/image-accordion";
import { services } from "./data";

export async function ServicesOverview() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Services"),
  ]);
  const items = services.map(
    ({ id, code, slug, aspectRatio, imagePosition }) => ({
      id,
      code,
      image: `/images/services/${slug}.webp`,
      imagePosition,
      imageQuality: 85,
      imageAlt: t(`items.${id}.imageAlt`),
      name: t(`items.${id}.name`),
      description: t(`items.${id}.description`),
      action: {
        href: getPathname({ locale, href: `/services/${slug}` }),
        label: t(`items.${id}.link`),
      },
      // Account for object-cover's source width in the tall desktop frame.
      imageSizes: {
        desktop: `${Math.ceil(720 * aspectRatio)}px`,
        compact: `(min-width: 1080px) 1px, (min-width: 760px) max(calc(100vw - 120px), ${Math.ceil(320 * aspectRatio)}px), max(calc(100vw - 80px), ${Math.ceil(200 * aspectRatio)}px)`,
      },
    }),
  );

  return (
    <Section
      id="services"
      tone="subtle"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <ImageAccordion items={items} listClassName="desktop:min-h-[720px]" />
    </Section>
  );
}
