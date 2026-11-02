export const locations = [
  {
    id: "liberec",
    city: "Liberec",
    country: "CZ",
    headquarters: true,
    tooltipSide: "left",
  },
  { id: "zawidow", city: "Zawidów", country: "PL", headquarters: false },
  { id: "helsinki", city: "Helsinki", country: "FI", headquarters: false },
] as const;

export type LocationId = (typeof locations)[number]["id"];

export const regions = [
  {
    id: "west",
    locationId: "liberec",
    code: "01 · CZ / WEST EU",
    contacts: [
      { label: "+420 482 425 984", href: "tel:+420482425984" },
      { label: "info@hokami.cz", href: "mailto:info@hokami.cz" },
    ],
  },
  {
    id: "east",
    locationId: "zawidow",
    code: "02 · PL / EAST EU",
    contacts: [
      { label: "+48 757 221 271", href: "tel:+48757221271" },
      {
        label: "agnieszka.trawnik@hokami.pl",
        href: "mailto:agnieszka.trawnik@hokami.pl",
      },
    ],
  },
  {
    id: "north",
    locationId: "helsinki",
    code: "03 · SCAN / BALT",
    contacts: [
      {
        label: "Kengo.Tashiro@hokami.cz",
        href: "mailto:Kengo.Tashiro@hokami.cz",
      },
    ],
  },
  {
    id: "global",
    locationId: "liberec",
    code: "04 · GLOBAL",
    contacts: [
      { label: "+420 482 425 984", href: "tel:+420482425984" },
      { label: "info@hokami.cz", href: "mailto:info@hokami.cz" },
    ],
  },
] as const;
