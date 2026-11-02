import type { LocationId } from "./data";

export type Location = {
  id: LocationId;
  city: string;
  country: string;
  headquarters: boolean;
  meta: string;
  tooltipSide?: "left" | "right" | "top" | "bottom";
};

export type LocationRegion = {
  id: string;
  locationId: LocationId;
  code: string;
  title: string;
  contacts: readonly { label: string; href: string }[];
};
