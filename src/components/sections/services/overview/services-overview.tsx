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
  const items = services.map(({ id, code, slug, crop }) => ({
    id,
    code,
    image: `/images/services/${slug}.png`,
    imageAlt: t(`items.${id}.imageAlt`),
    name: t(`items.${id}.name`),
    description: t(`items.${id}.description`),
    action: {
      href: getPathname({ locale, href: `/services/${slug}` }),
      label: t(`items.${id}.link`),
    },
    imageCrop: {
      desktop: { ...crop, frameWidth: 700, frameHeight: 720 },
      compact: { ...crop, frameWidth: 310, frameHeight: 200 },
    },
  }));

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
