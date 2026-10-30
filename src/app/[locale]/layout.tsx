import "../globals.css";
import "@/components/cookie-consent/cookie-consent.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header/site-header";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteMeasurement } from "@/components/site-measurement";
import { SiteCookieConsent } from "@/components/cookie-consent/cookie-consent";
import { site } from "@/lib/site";
import { ibmPlexMono, ibmPlexSans, saira } from "../fonts";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: site.name,
  robots: { index: true, follow: true },
  appleWebApp: {
    title: "Hokami",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${saira.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <SiteCookieConsent />
          <SiteHeader locale={locale} />
          <div className="flex-1">{children}</div>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
        <SiteMeasurement />
      </body>
    </html>
  );
}
