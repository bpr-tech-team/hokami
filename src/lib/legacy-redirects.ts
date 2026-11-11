import type { NextConfig } from "next";

type Redirects = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

// Verified against the former WordPress sitemap and page content on 2026-11-11.
const legacyPaths: Record<string, string> = {
  "o-hokami": "/about",
  kontakt: "/contact",
  udrzitelnost: "/sustainability",
  kariera: "/jobs",
  kampus: "/about#campus",
  sluzby: "/services",
  osazovani: "/services/smt",
  pajeni: "/services/tht",
  cisteni: "/services/cleaning",
  testovani: "/services/testing",
  lakovani: "/services/coating",
  kompletace: "/services/mechanical-assembly",
  "desky-plosnych-spoju": "/services/pcb",
  sablony: "/services/smt-stencils",
  "delnik-delnice-v-elektronice": "/jobs/production",
  "konstrukter-testeru-elektroniky-vyvoj-sw-aplikaci": "/jobs/test-engineer",
  nakupci: "/jobs/buyer",
  "category/kariera": "/jobs",
  "author/111": "/jobs",
  "author/josef-suska": "/jobs",
};

export function createLegacyRedirects(
  locales: readonly string[],
  defaultLocale: string,
): Redirects {
  const localizedRoot = `/:locale(${locales.join("|")})`;

  return [
    ...["/", localizedRoot].map((source) => ({
      source,
      has: [{ type: "query" as const, key: "page_id", value: "176" }],
      destination: `/${defaultLocale}/gdpr`,
      permanent: true,
    })),
    ...Object.entries(legacyPaths).flatMap(([source, destination]) => [
      {
        source: `${localizedRoot}/${source}`,
        destination: `/:locale${destination}`,
        permanent: true,
      },
      {
        source: `/${source}`,
        destination: `/${defaultLocale}${destination}`,
        permanent: true,
      },
    ]),
    // The unprefixed legal links appeared in the old site's footer.
    ...["gdpr", "whistleblowing"].map((path) => ({
      source: `/${path}`,
      destination: `/${defaultLocale}/${path}`,
      permanent: true,
    })),
  ];
}
