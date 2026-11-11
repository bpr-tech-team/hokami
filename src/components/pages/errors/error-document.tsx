import type { Locale } from "next-intl";
import { ibmPlexMono, ibmPlexSans, saira } from "@/app/fonts";
import { HokamiWordmark } from "@/components/brand/hokami-wordmark";
import { Container } from "@/components/layout/container";
import { errorMessages } from "@/i18n/error-messages";
import { ErrorPage, type ErrorStatus } from "./error-page";

/** A complete fallback document that needs no public layout or providers. */
export function ErrorDocument({
  locale,
  status,
}: {
  locale: Locale;
  status: ErrorStatus;
}) {
  return (
    <html
      lang={locale}
      className={`${saira.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
    >
      <body className="min-h-dvh bg-surface-accent-subtle">
        <header className="bg-surface-default px-5 tablet:px-10 desktop:px-20">
          <Container className="flex h-16 items-center desktop:h-18">
            <a
              href={`/${locale}`}
              aria-label={`HOKAMI — ${errorMessages[locale].home}`}
              className="inline-flex min-h-11 items-center"
            >
              <HokamiWordmark />
            </a>
          </Container>
        </header>
        <ErrorPage locale={locale} status={status} />
      </body>
    </html>
  );
}
