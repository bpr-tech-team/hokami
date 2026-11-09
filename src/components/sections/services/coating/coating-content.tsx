import { getTranslations } from "next-intl/server";
import { ServiceMediaSection } from "../detail/service-media-section";
import { serviceImages } from "../detail/images";
import { ServiceEquipmentSection } from "../detail/service-equipment-section";
import { equipmentModels } from "../detail/data";

export async function CoatingContent() {
  const t = await getTranslations("Coating");
  return (
    <>
      <ServiceMediaSection
        blocks={[
          {
            id: "production",
            eyebrow: t("first.eyebrow"),
            title: t("first.title"),
            image: {
              src: serviceImages["coating"].first,
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
              src: serviceImages["coating"].second,
              alt: t("second.imageAlt"),
            },
            imagePosition: "left",
            paragraphs: [{ id: "p1", text: t("second.p1") }],
            items: [
              { id: "selective", text: t("second.items.selective") },
              { id: "full", text: t("second.items.full") },
              { id: "automatic", text: t("second.items.automatic") },
              { id: "manual", text: t("second.items.manual") },
              { id: "dip", text: t("second.items.dip") },
              { id: "spray", text: t("second.items.spray") },
            ],
            conclusion: t("second.conclusion"),
          },
        ]}
      />
      <ServiceEquipmentSection
        id="equipment"
        title={t("equipment.title")}
        description={t("equipment.description")}
        groups={[
          {
            id: "lines",
            title: t("equipment.lines.title"),
            items: [
              {
                id: "asymtek",
                text: t("equipment.lines.item", {
                  model: equipmentModels.coating,
                }),
              },
            ],
            paragraphs: [
              { id: "compatibility", text: t("equipment.lines.description") },
            ],
          },
          {
            id: "drying",
            title: t("equipment.drying.title"),
            items: [{ id: "oven", text: t("equipment.drying.item") }],
          },
          {
            id: "quality",
            title: t("equipment.quality.title"),
            paragraphs: [
              { id: "inspection", text: t("equipment.quality.description") },
            ],
          },
        ]}
      />
    </>
  );
}
