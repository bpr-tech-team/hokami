import { getLocale, getTranslations } from "next-intl/server";
import { ServiceMediaSection } from "../detail/service-media-section";
import { serviceImages } from "../detail/images";
import { TrustStrip } from "@/components/sections/trust-strip/trust-strip";
import { ServiceSpecifications } from "../detail/service-specifications";
import { serviceStatistics } from "../detail/data";
import { pcbSpecificationFields } from "./data";

export async function PcbContent() {
  const [t, locale] = await Promise.all([getTranslations("Pcb"), getLocale()]);
  return (
    <>
      <TrustStrip
        id="service-statistics"
        aria-label={t("statistics.label")}
        locale={locale}
        items={serviceStatistics.pcb.map((item) => ({
          ...item,
          label: t(`statistics.${item.id}`),
        }))}
      />
      <ServiceMediaSection
        blocks={[
          {
            id: "production",
            eyebrow: t("first.eyebrow"),
            title: t("first.title"),
            image: {
              src: serviceImages["pcb"].first,
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
              src: serviceImages["pcb"].second,
              alt: t("second.imageAlt"),
            },
            imagePosition: "left",
            paragraphs: [{ id: "p1", text: t("second.p1") }],
          },
        ]}
      />
      <ServiceSpecifications
        title={t("specifications.title")}
        rows={pcbSpecificationFields.map(({ id, parameters }) => ({
          id,
          label: t(`specifications.${id}.label`),
          values: [
            { id: "value", text: t(`specifications.${id}.value`, parameters) },
          ],
        }))}
      />
    </>
  );
}
