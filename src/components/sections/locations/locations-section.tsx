import { Section } from "@/components/layout/section";
import { LocationExplorer } from "./location-explorer";
import type { Location, LocationRegion } from "./types";

type LocationsSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  mapLabel: string;
  locations: readonly Location[];
  regions: readonly LocationRegion[];
};

export function LocationsSection({
  id = "locations",
  eyebrow,
  title,
  description,
  mapLabel,
  locations,
  regions,
}: LocationsSectionProps) {
  return (
    <Section
      id={id}
      tone="subtle"
      eyebrow={eyebrow}
      title={title}
      description={description}
      descriptionClassName="hidden tablet:block"
    >
      <LocationExplorer
        locations={locations}
        regions={regions}
        label={mapLabel}
      />
    </Section>
  );
}
