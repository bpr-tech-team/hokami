import { getTranslations } from "next-intl/server";
import { ServiceEquipmentSection } from "../detail/service-equipment-section";
import { smtPlacementEquipment, smtReflowEquipment } from "./data";

export async function SmtEquipment() {
  const t = await getTranslations("Smt.equipment");
  return (
    <ServiceEquipmentSection
      id="equipment"
      eyebrow={t("eyebrow")}
      title={t("title")}
      groups={[
        {
          id: "placement",
          title: t("placement"),
          items: smtPlacementEquipment,
        },
        { id: "reflow", title: t("reflow"), items: smtReflowEquipment },
        {
          id: "bonding",
          title: t("bonding.title"),
          paragraphs: [{ id: "description", text: t("bonding.description") }],
        },
      ]}
    />
  );
}
