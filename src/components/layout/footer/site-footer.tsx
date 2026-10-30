import { cacheLife } from "next/cache";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { CookieSettings } from "./cookie-settings";
import { FooterLanguages } from "./footer-languages";
import { FooterLink } from "./footer-link";
import { FooterLogo } from "./footer-logo";
import { FooterGroup, FooterRow } from "./footer-row";
import { FooterSeparator } from "./footer-separator";

async function getCopyrightYear() {
  "use cache";
  cacheLife("hours");
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    timeZone: "Europe/Prague",
  }).format(new Date());
}

export async function SiteFooter({ locale }: { locale: Locale }) {
  const [t, year] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getCopyrightYear(),
  ]);

  return (
    <footer className="bg-surface-inverse px-5 py-10 text-center text-sm leading-[1.55] text-text-on-inverse tablet:px-10 tablet:py-12 desktop:px-20 desktop:py-16">
      <Container className="flex flex-col items-center gap-5">
        <FooterLogo label={t("home")} />

        {/* Negative row margins keep the design spacing with 44 px link targets. */}
        <FooterRow>
          <FooterGroup className="min-h-11 whitespace-nowrap">
            <span>© {year} Hokami CZ s.r.o.</span>
            <FooterSeparator />
            <span>Liberec</span>
          </FooterGroup>
          <FooterGroup className="whitespace-nowrap">
            <FooterSeparator className="hidden tablet:inline" />
            <FooterLink href="mailto:info@hokami.cz">info@hokami.cz</FooterLink>
            <FooterSeparator />
            <FooterLink href="tel:+420482425984">+420 482 425 984</FooterLink>
          </FooterGroup>
        </FooterRow>

        <FooterRow as="nav" aria-label={t("legal")}>
          <FooterLink href="/gdpr">{t("privacy")}</FooterLink>
          <FooterGroup>
            <FooterSeparator />
            <CookieSettings />
          </FooterGroup>
          <FooterGroup>
            <FooterSeparator />
            <FooterLink href="/whistleblowing">
              {t("whistleblowing")}
            </FooterLink>
          </FooterGroup>
        </FooterRow>

        <FooterLanguages locale={locale} label={t("language")} />
      </Container>
    </footer>
  );
}
