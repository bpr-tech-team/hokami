import type { NextConfig } from "next";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { keystaticUiLocale } from "./src/i18n/keystatic-ui";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";
import { createLegacyRedirects } from "./src/lib/legacy-redirects";

const withNextIntl = createNextIntlPlugin();
// Include both custom loader inputs in Turbopack's persistent cache key.
const keystaticUiRevision = createHash("sha256")
  .update(readFileSync(resolve("scripts/keystatic-ui-loader.cjs")))
  .update(readFileSync(resolve("src/i18n/keystatic-ui-messages.json")))
  .digest("hex");

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  // Run the locale supplement consistently in browser and server bundles.
  transpilePackages: ["@keystatic/core"],
  // Keystatic uses the OAuth loopback host in development.
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingIncludes: {
    "/*": ["./src/content/jobs/**/*", "./public/images/jobs/**/*"],
  },
  redirects() {
    return [
      ...createLegacyRedirects(routing.locales, routing.defaultLocale),
      ...["career", "careers"].flatMap((path) => [
        {
          source: `/:locale(${routing.locales.join("|")})/${path}`,
          destination: "/:locale/jobs",
          permanent: true,
        },
        {
          source: `/${path}`,
          destination: `/${routing.defaultLocale}/jobs`,
          permanent: true,
        },
      ]),
    ];
  },
  turbopack: {
    rules: {
      "*.js": {
        condition: { path: /node_modules\/@keystatic\/core\/dist\// },
        loaders: [
          {
            loader: "./scripts/keystatic-ui-loader.cjs",
            options: {
              locale: keystaticUiLocale,
              runtime: true,
              revision: keystaticUiRevision,
            },
          },
        ],
      },
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
