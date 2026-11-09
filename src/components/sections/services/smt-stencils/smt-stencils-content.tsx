import { getLocale, getTranslations } from "next-intl/server";
import { ServiceMediaSection } from "../detail/service-media-section";
import { serviceImages } from "../detail/images";
import { TrustStrip } from "@/components/sections/trust-strip/trust-strip";
import { ServiceSpecifications } from "../detail/service-specifications";
import { serviceStatistics } from "../detail/data";
import { smtStencilCapabilities } from "./data";

export async function SmtStencilsContent() {
  const [t, locale] = await Promise.all([
    getTranslations("SmtStencils"),
    getLocale(),
  ]);
  const { width, heights, thickness } = smtStencilCapabilities;
  return (
    <>
      <TrustStrip
        id="service-statistics"
        aria-label={t("statistics.label")}
        locale={locale}
        items={serviceStatistics.stencils.map((item) => ({
          ...item,
          label: t(`statistics.${item.id}`),
          ...(item.id === "hours"
            ? { suffix: t("statistics.hoursSuffix") }
            : {}),
        }))}
      />
      <ServiceMediaSection
        blocks={[
          {
            id: "production",
            eyebrow: t("first.eyebrow"),
            title: t("first.title"),
            image: {
              src: serviceImages["smt-stencils"].first,
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
              src: serviceImages["smt-stencils"].second,
              alt: t("second.imageAlt"),
            },
            imagePosition: "left",
            paragraphs: [{ id: "p1", text: t("second.p1") }],
          },
        ]}
      />
      <ServiceSpecifications
        title={t("specifications.title")}
        rows={[
          {
            id: "size",
            label: t("specifications.size.label"),
            values: [
              {
                id: "value",
                text: t("specifications.size.value", {
                  width,
                  firstHeight: heights[0],
                  secondHeight: heights[1],
                }),
              },
            ],
          },
          {
            id: "thickness",
            label: t("specifications.thickness.label"),
            values: [
              {
                id: "value",
                text: t("specifications.thickness.value", {
                  minimum: thickness.minimum,
                  maximum: thickness.maximum,
                  standardThicknesses: thickness.standard
                    .map((value) =>
                      t("specifications.thickness.item", { value }),
                    )
                    .join(", "),
                }),
              },
            ],
          },
          {
            id: "material",
            label: t("specifications.material.label"),
            values: [
              { id: "line1", text: t("specifications.material.line1") },
              { id: "line2", text: t("specifications.material.line2") },
              { id: "line3", text: t("specifications.material.line3") },
              { id: "line4", text: t("specifications.material.line4") },
            ],
          },
          {
            id: "services",
            label: t("specifications.services.label"),
            values: [
              { id: "line1", text: t("specifications.services.line1") },
              { id: "line2", text: t("specifications.services.line2") },
              { id: "line3", text: t("specifications.services.line3") },
              { id: "line4", text: t("specifications.services.line4") },
            ],
          },
        ]}
      />
    </>
  );
}
