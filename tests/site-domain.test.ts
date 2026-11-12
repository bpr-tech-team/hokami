import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const inspectConfiguration = `
  const { site } = require('./src/lib/site.ts');
  const { getJobUrl } = require('./src/lib/jobs/urls.ts');
  const { getRecaptchaConfig } = require('./src/lib/recaptcha/config.ts');
  const { createConsentConfig } = require('./src/components/integrations/cookie-consent/config.ts');
  const { resolveGoogleMeasurementConfig } = require('./src/lib/analytics/google-tag-manager.ts');
  const cookies = createConsentConfig('en').categories.analytics.services.googleAnalytics.cookies;
  process.stdout.write(JSON.stringify({
    site,
    jobUrl: getJobUrl('buyer', 'en'),
    recaptchaHosts: getRecaptchaConfig().hostnames,
    cookieDomains: cookies.map(cookie => cookie.domain).filter(Boolean),
    analytics: resolveGoogleMeasurementConfig('www.example.test', 'GTM-TEST123', 'G-TEST456'),
    previousDomain: resolveGoogleMeasurementConfig('hokami.cz', 'GTM-TEST123', 'G-TEST456'),
  }));
`;

test("one domain variable configures URLs, analytics, cookie cleanup and default reCAPTCHA hosts", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--eval", inspectConfiguration],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_DOMAIN: "example.test",
        RECAPTCHA_SECRET_KEY: "test-only-secret",
        RECAPTCHA_ALLOWED_HOSTNAMES: "",
      },
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const resultConfig = JSON.parse(result.stdout);
  assert.equal(resultConfig.site.domain, "example.test");
  assert.equal(resultConfig.site.url, "https://example.test");
  assert.equal(resultConfig.jobUrl, "https://example.test/en/jobs/buyer");
  assert.deepEqual(resultConfig.recaptchaHosts, [
    "example.test",
    "www.example.test",
  ]);
  assert.deepEqual(resultConfig.cookieDomains, ["example.test"]);
  assert.deepEqual(resultConfig.analytics, {
    containerId: "GTM-TEST123",
    measurementId: "G-TEST456",
  });
  assert.equal(resultConfig.previousDomain, undefined);
});
