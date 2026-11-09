import { getTranslations } from "next-intl/server";
import { ServiceMediaSection } from "../detail/service-media-section";
import { serviceImages } from "../detail/images";
import { ServiceEquipmentSection } from "../detail/service-equipment-section";
import { equipmentModels } from "../detail/data";

export async function ThtContent() {
  const t = await getTranslations("Tht");
  return (
    <>
      <ServiceMediaSection
        blocks={[
          {
            id: "production",
            eyebrow: t("first.eyebrow"),
            title: t("first.title"),
            image: {
              src: serviceImages["tht"].first,
              alt: t("first.imageAlt"),
            },
            imagePosition: "right",
            paragraphs: [{ id: "p1", text: t("first.p1") }],
          },
          {
            id: "quality",
            eyebrow: t("second.eyebrow"),
            title: t("second.title"),
            image: {
              src: serviceImages["tht"].second,
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
      <ServiceEquipmentSection
        id="equipment"
        title={t("equipment.title")}
        groups={[
          {
            id: "wave",
            title: t("equipment.wave"),
            items: equipmentModels.tht.wave,
          },
          {
            id: "selective",
            title: t("equipment.selective"),
            items: equipmentModels.tht.selective,
          },
          {
            id: "manual",
            title: t("equipment.manual"),
            items: equipmentModels.tht.manual.map(({ id, model }) => ({
              id,
              text: t("equipment.station", { model }),
            })),
          },
        ]}
      />
    </>
  );
}
