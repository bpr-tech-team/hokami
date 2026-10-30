import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en", "de", "fi", "pl"],
  defaultLocale: "cs",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
});
