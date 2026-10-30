import type { Locale } from "next-intl";

export const languages: { locale: Locale; code: string; name: string }[] = [
  { locale: "cs", code: "CS", name: "Čeština" },
  { locale: "en", code: "EN", name: "English" },
  { locale: "de", code: "DE", name: "Deutsch" },
  { locale: "fi", code: "FI", name: "Suomi" },
  { locale: "pl", code: "PL", name: "Polski" },
];
