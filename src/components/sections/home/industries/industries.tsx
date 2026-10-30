import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { IndustryAccordion } from "./industry-accordion";

const industries = [
  { id: "aero", code: "01 / AERO" },
  { id: "auto", code: "02 / AUTO" },
  { id: "med", code: "03 / MED" },
  { id: "def", code: "04 / DEF" },
  { id: "ind", code: "05 / IND" },
  { id: "cons", code: "06 / CONS" },
] as const;

export async function Industries() {
  const t = await getTranslations("Industries");
  const items = industries.map(({ id, code }) => ({
    id,
    code,
    image: `/images/industries/${id}.webp`,
    name: t(`items.${id}.name`),
    description: t(`items.${id}.description`),
    certification: t(`items.${id}.certification`),
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
