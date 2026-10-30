"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { hasServiceConsent, useServiceConsent } from "@/lib/cookie-consent";

export function SiteMeasurement() {
  const analytics = useServiceConsent("vercelAnalytics");
  const performance = useServiceConsent("speedInsights");

  return (
    <>
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
