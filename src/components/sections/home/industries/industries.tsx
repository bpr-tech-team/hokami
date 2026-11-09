import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { industries } from "@/content/industries";
import { IndustryAccordion } from "./industry-accordion";

export async function Industries() {
  const t = await getTranslations("Industries");
  const items = industries.map(({ id, code, image }) => ({
    id,
    code,
    image,
    name: t(`items.${id}.name`),
    description: t(`items.${id}.description`),
    focus: t(`items.${id}.focus`),
    imageAlt: t("imageAlt", { industry: t(`items.${id}.name`) }),
  }));

  return (
    <Section
      id="industries"
      tone="subtle"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <IndustryAccordion items={items} />
    </Section>
  );
}
