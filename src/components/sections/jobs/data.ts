import type { Messages } from "next-intl";

export const recruitmentContact = {
  label: "prace@hokami.cz",
  href: "mailto:prace@hokami.cz",
  icon: "/images/about/contact/mail.svg",
} as const;

type Job = {
  id: keyof Messages["Jobs"]["positions"]["items"];
  href: string;
};

// Temporary localized homepage links until /jobs/{job} details are available.
export const jobs: readonly Job[] = [
  { id: "buyer", href: "/" },
  { id: "testEngineer", href: "/" },
  { id: "production", href: "/" },
];
