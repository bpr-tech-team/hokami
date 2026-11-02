import { getTranslations } from "next-intl/server";
import { locations, regions } from "./data";
import { LocationsSection } from "./locations-section";

/** The same translated section and contact data can be used on any page. */
export async function Locations({ id = "locations" }: { id?: string }) {
  const t = await getTranslations("Locations");

  return (
    <LocationsSection
      id={id}
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
