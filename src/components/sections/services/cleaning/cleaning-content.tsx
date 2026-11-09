import { getTranslations } from "next-intl/server";
import { ServiceMediaSection } from "../detail/service-media-section";
import { serviceImages } from "../detail/images";
import { Section } from "@/components/layout/section";
import { EquipmentList } from "../detail/equipment-list";
import { equipmentModels } from "../detail/data";

export async function CleaningContent() {
  const t = await getTranslations("Cleaning");
  return (
    <>
      <ServiceMediaSection
        blocks={[
          {
            id: "production",
            eyebrow: t("first.eyebrow"),
            title: t("first.title"),
            image: {
              src: serviceImages["cleaning"].first,
              alt: t("first.imageAlt"),
            },
            imagePosition: "right",
            paragraphs: [
              { id: "p1", text: t("first.p1") },
              { id: "p2", text: t("first.p2") },
            ],
          },
          {
            id: "quality",
            eyebrow: t("second.eyebrow"),
            title: t("second.title"),
            image: {
              src: serviceImages["cleaning"].second,
              alt: t("second.imageAlt"),
            },
            imagePosition: "left",
            paragraphs: [
              { id: "p1", text: t("second.p1") },
              { id: "p2", text: t("second.p2") },
            ],
          },
        ]}
      />
      <Section
        id="equipment"
        title={t("equipment.title")}
        description={t("equipment.description")}
        descriptionTone="secondary"
        tone="subtle"
      >
        <EquipmentList
          items={[
            {
              id: "module-clean",
              text: t("equipment.moduleClean", {
                model: equipmentModels.cleaning.moduleClean,
              }),
            },
            {
              id: "mdx",
              text: t("equipment.mdx", { model: equipmentModels.cleaning.mdx }),
            },
            { id: "ultrasonic", text: t("equipment.ultrasonic") },
          ]}
        />
      </Section>
    </>
  );
}
