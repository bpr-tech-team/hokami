"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { site } from "@/lib/site";

type GoogleMeasurementConfig = {
  containerId: string;
  measurementId: string;
};

type ConsentState = {
  analytics_storage: "granted" | "denied";
  ad_storage: "denied";
  ad_user_data: "denied";
  ad_personalization: "denied";
};

export type FormAnalyticsEvent = {
  event: "generate_lead" | "job_application_submit";
  form_type: "contact" | "request_for_quote" | "job_application";
  site_language: string;
  job_id: string | null;
};

declare global {
  interface Window {
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function resolveGoogleMeasurementConfig(
  hostname: string,
  containerId = process.env.NEXT_PUBLIC_GTM_ID,
  measurementId = process.env.NEXT_PUBLIC_GA4_ID,
) {
  if (
    !site.hostnames.includes(hostname) ||
    !containerId ||
    !/^GTM-[A-Z0-9]+$/.test(containerId) ||
    !measurementId ||
    !/^G-[A-Z0-9]+$/.test(measurementId)
  )
    return;
  return { containerId, measurementId };
}

function consentState(accepted: boolean): ConsentState {
  return {
    analytics_storage: accepted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
}

export function getGoogleMeasurementConfig():
  GoogleMeasurementConfig | undefined {
  if (typeof window === "undefined" || !window.location) return;
  return resolveGoogleMeasurementConfig(window.location.hostname);
}

let initialized = false;
let accepted = false;

// Consent commands use Google's Arguments protocol. The library handles the
// container itself; these commands connect it to our existing consent banner.
const command: (
  name: "consent",
  action: "default" | "update",
  state: ConsentState,
) => void = function () {
  // eslint-disable-next-line prefer-rest-params -- Google expects an Arguments object.
  window.dataLayer!.push(arguments);
};

export function synchronizeGoogleConsent(next: boolean) {
  const config = getGoogleMeasurementConfig();
  if (!config) return;
  window.dataLayer ??= [];
  window[`ga-disable-${config.measurementId}`] = !next;
  if (!initialized) {
    command("consent", "default", consentState(false));
    initialized = true;
  }
  if (accepted === next) return;
  accepted = next;
  command("consent", "update", consentState(next));
  // CookieConsent has saved the choice and cleared service cookies before
  // calling us. Reload to unload scripts/listeners already injected by GTM.
  if (!next) window.location.reload();
}

export function trackGoogleFormEvent(event: FormAnalyticsEvent) {
  // Measurement must never change a successful form submission into a failure,
  // even when an extension or a container replaces dataLayer.push.
  try {
    const config = getGoogleMeasurementConfig();
    if (!config || !accepted || window[`ga-disable-${config.measurementId}`])
      return;
    sendGTMEvent(event);
  } catch {
    // Optional analytics is allowed to fail silently.
  }
}
