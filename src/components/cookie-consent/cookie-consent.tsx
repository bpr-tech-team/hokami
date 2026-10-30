"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { initializeConsent, setConsentLanguage } from "@/lib/cookie-consent";

export function SiteCookieConsent() {
  const locale = useLocale();

  useEffect(() => {
    let active = true;
    void initializeConsent(locale)
      .then(() => {
        if (active) return setConsentLanguage(locale);
      })
      .catch((error: unknown) => {
        // Optional integrations stay disabled if initialization fails.
        console.error("Unable to initialize cookie consent", error);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  return null;
}
