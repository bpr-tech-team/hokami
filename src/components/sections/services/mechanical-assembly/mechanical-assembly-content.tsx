import { getTranslations } from "next-intl/server";
import { ServiceMediaSection } from "../detail/service-media-section";
import { serviceImages } from "../detail/images";
import { ServiceFactSection } from "../detail/service-fact-section";

export async function MechanicalAssemblyContent() {
  const t = await getTranslations("MechanicalAssembly");
  return (
    <>
      <ServiceMediaSection
        blocks={[
          {
            id: "production",
            eyebrow: t("first.eyebrow"),
            title: t("first.title"),
            image: {
              src: serviceImages["mechanical-assembly"].first,
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
              src: serviceImages["mechanical-assembly"].second,
              alt: t("second.imageAlt"),
            },
            imagePosition: "left",
            paragraphs: [{ id: "p1", text: t("second.p1") }],
          },
        ]}
      />
      <ServiceFactSection
        id="included-services"
        title={t("included.title")}
        items={[
          { id: "harnesses", text: t("included.harnesses") },
          { id: "parts", text: t("included.parts") },
          { id: "enclosures", text: t("included.enclosures") },
          { id: "completion", text: t("included.completion") },
          { id: "components", text: t("included.components") },
          { id: "labeling", text: t("included.labeling") },
          { id: "packaging", text: t("included.packaging") },
          { id: "dispatch", text: t("included.dispatch") },
          { id: "logistics", text: t("included.logistics") },
        ]}
      />
    </>
  );
}
