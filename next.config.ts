import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  redirects() {
    return ["career", "careers"].flatMap((path) => [
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
    ]);
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
