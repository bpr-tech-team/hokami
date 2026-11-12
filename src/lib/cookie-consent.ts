"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "next-intl";
import * as CookieConsent from "vanilla-cookieconsent";
import { createConsentConfig } from "@/components/integrations/cookie-consent/config";
import { synchronizeGoogleConsent } from "@/lib/analytics/google-tag-manager";

export type MeasurementService =
  "vercelAnalytics" | "speedInsights" | "googleAnalytics";

let initialization: Promise<void> | undefined;

export function initializeConsent(locale: Locale) {
  // CookieConsent owns one DOM tree. Keep it across Strict Mode effects and
  // locale navigation; resetting it would discard open dialogs and listeners.
  if (!initialization) {
    synchronizeGoogleConsent(false);
    const syncGoogle = () =>
      synchronizeGoogleConsent(hasServiceConsent("googleAnalytics"));
    initialization = CookieConsent.run({
      ...createConsentConfig(locale),
      onConsent: syncGoogle,
      onChange: syncGoogle,
    });
  }
  return initialization;
}

export const setConsentLanguage = CookieConsent.setLanguage;

export async function showCookiePreferences(locale: Locale) {
  await initializeConsent(locale);
  await setConsentLanguage(locale);
  CookieConsent.showPreferences();
}

export function hasServiceConsent(service: MeasurementService) {
  return (
    typeof window !== "undefined" &&
    CookieConsent.validConsent() &&
    CookieConsent.acceptedService(service, "analytics")
  );
}

function subscribeConsent(notify: () => void) {
  window.addEventListener("cc:onConsent", notify);
  window.addEventListener("cc:onChange", notify);
  return () => {
    window.removeEventListener("cc:onConsent", notify);
    window.removeEventListener("cc:onChange", notify);
  };
}

function serverConsent() {
  return false;
}

export function useServiceConsent(service: MeasurementService) {
  return useSyncExternalStore(
    subscribeConsent,
    () => hasServiceConsent(service),
    serverConsent,
  );
}
