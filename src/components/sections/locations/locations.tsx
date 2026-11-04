import { getTranslations } from "next-intl/server";
import type { ComponentProps } from "react";
import { locations, regions } from "./data";
import { LocationsSection } from "./locations-section";

/** The same translated section and contact data can be used on any page. */
export async function Locations({
  id = "locations",
  tone,
}: Pick<ComponentProps<typeof LocationsSection>, "id" | "tone">) {
  const t = await getTranslations("Locations");

  return (
    <LocationsSection
      id={id}
      tone={tone}
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      mapLabel={t("mapLabel")}
      locations={locations.map((location) => ({
        ...location,
        meta: t(`branches.${location.id}`),
      }))}
      regions={regions.map((region) => ({
        ...region,
        code: t("regionCode", { code: region.code }),
        title: t(`regions.${region.id}`),
      }))}
    />
  );
}
