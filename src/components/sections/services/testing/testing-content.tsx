import { getTranslations } from "next-intl/server";
import { ServiceMediaSection } from "../detail/service-media-section";
import { serviceImages } from "../detail/images";
import { ServiceEquipmentSection } from "../detail/service-equipment-section";
import { Section } from "@/components/layout/section";
import { ServiceFactSection } from "../detail/service-fact-section";
import { FeatureCardGrid } from "@/components/sections/feature-cards/feature-card-grid";
import { equipmentModels } from "../detail/data";

export async function TestingContent() {
  const t = await getTranslations("Testing");
  return (
    <>
      <ServiceMediaSection
        blocks={[
          {
            id: "production",
            eyebrow: t("first.eyebrow"),
            title: t("first.title"),
            image: {
              src: serviceImages["testing"].first,
              alt: t("first.imageAlt"),
            },
            imagePosition: "right",
            paragraphs: [
              { id: "p1", text: t("first.p1") },
              { id: "p2", text: t("first.p2") },
            ],
          },
        ]}
      />
      <ServiceFactSection
        id="checks"
        title={t("checks.title")}
        items={[
          { id: "spi", text: t("checks.spi") },
          { id: "aoi", text: t("checks.aoi") },
          { id: "bga", text: t("checks.bga") },
          { id: "ict", text: t("checks.ict") },
          { id: "functional", text: t("checks.functional") },
          { id: "programming", text: t("checks.programming") },
          { id: "burnIn", text: t("checks.burnIn") },
          { id: "highVoltage", text: t("checks.highVoltage") },
          { id: "mechanical", text: t("checks.mechanical") },
          { id: "optical", text: t("checks.optical") },
          { id: "buzzer", text: t("checks.buzzer") },
          { id: "visual", text: t("checks.visual") },
        ]}
      />
      <ServiceEquipmentSection
        id="equipment"
        title={t("equipment.title")}
        tone="default"
        groups={[
          {
            id: "aoi",
            title: t("equipment.aoi.title"),
            description: t("equipment.aoi.description"),
            listLabel: t("equipment.title"),
            items: [
              ...equipmentModels.testing.aoi,
              { id: "endoscope", text: t("equipment.aoi.endoscope") },
            ],
          },
          {
            id: "ict",
            title: t("equipment.ict.title"),
            description: t("equipment.ict.description"),
            listLabel: t("equipment.title"),
            items: [
              ...equipmentModels.testing.ict.map(({ id, model, fixture }) => ({
                id,
                text: t("equipment.ict.manual", { model, fixture }),
              })),
              {
                id: "oversized",
                text: t("equipment.ict.oversized", {
                  fixture: equipmentModels.testing.oversized,
                }),
              },
            ],
          },
          {
            id: "functional",
            title: t("equipment.functional.title"),
            description: t("equipment.functional.description"),
            listLabel: t("equipment.functional.listLabel"),
            items: [
              { id: "assemblies", text: t("equipment.functional.assemblies") },
              {
                id: "communication",
                text: t("equipment.functional.communication"),
              },
              { id: "firmware", text: t("equipment.functional.firmware") },
              { id: "burnIn", text: t("equipment.functional.burnIn") },
              {
                id: "highVoltage",
                text: t("equipment.functional.highVoltage"),
              },
              { id: "mechanical", text: t("equipment.functional.mechanical") },
              { id: "optical", text: t("equipment.functional.optical") },
              { id: "sound", text: t("equipment.functional.sound") },
            ],
          },
        ]}
      />
      <Section id="quality-assurance" title={t("cards.title")} tone="subtle">
        <FeatureCardGrid
          columns={2}
          items={[
            {
              id: "traceability",
              title: t("cards.traceability.title"),
              description: t("cards.traceability.description"),
            },
            {
              id: "esd",
              title: t("cards.esd.title"),
              description: t("cards.esd.description"),
            },
            {
              id: "calibration",
              title: t("cards.calibration.title"),
              description: t("cards.calibration.description"),
            },
            {
              id: "fixtures",
              title: t("cards.fixtures.title"),
              description: t("cards.fixtures.description"),
            },
          ]}
        />
      </Section>
    </>
  );
}
