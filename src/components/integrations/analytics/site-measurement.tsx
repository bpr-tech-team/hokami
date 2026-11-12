"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager } from "@next/third-parties/google";
import { hasServiceConsent, useServiceConsent } from "@/lib/cookie-consent";
import { getGoogleMeasurementConfig } from "@/lib/analytics/google-tag-manager";

export function SiteMeasurement() {
  const analytics = useServiceConsent("vercelAnalytics");
  const performance = useServiceConsent("speedInsights");
  const google = useServiceConsent("googleAnalytics");
  const googleConfig = google ? getGoogleMeasurementConfig() : undefined;

  return (
    <>
      {googleConfig && <GoogleTagManager gtmId={googleConfig.containerId} />}
      {analytics && (
        <Analytics
          beforeSend={(event) =>
            hasServiceConsent("vercelAnalytics") ? event : null
          }
        />
      )}
      {performance && (
        <SpeedInsights
          beforeSend={(event) =>
            hasServiceConsent("speedInsights") ? event : null
          }
        />
      )}
    </>
  );
}
