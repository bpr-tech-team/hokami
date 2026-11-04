import type { ComponentProps } from "react";
import { Section } from "@/components/layout/section";
import { LocationExplorer } from "./location-explorer";
import type { Location, LocationRegion } from "./types";

type LocationsSectionProps = {
  id?: string;
  tone?: ComponentProps<typeof Section>["tone"];
  eyebrow: string;
  title: string;
  description: string;
  mapLabel: string;
  locations: readonly Location[];
  regions: readonly LocationRegion[];
};

export function LocationsSection({
  id = "locations",
  tone = "subtle",
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
      tone={tone}
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
