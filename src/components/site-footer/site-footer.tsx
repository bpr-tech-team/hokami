import Image from "next/image";
import { cacheLife } from "next/cache";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CookieSettings } from "./cookie-settings";
import { FooterLanguages } from "./footer-languages";

const linkClassName =
  "inline-flex min-h-11 items-center underline decoration-from-font underline-offset-2 transition-opacity duration-150 hover:opacity-75";

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
      <div className="mx-auto flex max-w-content flex-col items-center gap-5">
        <Link
          href="/"
          aria-label={t("home")}
          className="flex w-[165.785px] flex-col items-center gap-[9.6px]"
        >
          <Image
            src="/images/footer/wordmark.svg"
            alt="HOKAMI"
            width={165.785}
            height={29.2864}
            unoptimized
          />
          <span className="flex h-[12.8px] w-full items-center gap-[9.6px]">
            <span
              aria-hidden="true"
              className="h-[1.6px] flex-1 bg-brand-identity"
            />
            <Image
              src="/images/footer/tagline.svg"
              alt="PCBA production"
              width={114.584}
              height={6.26157}
              unoptimized
            />
            <span
              aria-hidden="true"
              className="h-[1.6px] flex-1 bg-brand-identity"
            />
          </span>
        </Link>

        {/* Negative row margins keep the design spacing with 44 px link targets. */}
        <div className="-my-2.5 flex flex-wrap items-center justify-center gap-x-2">
          <span className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap">
            <span>© {year} Hokami CZ s.r.o.</span>
            <span aria-hidden="true">•</span>
            <span>Liberec</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <span aria-hidden="true" className="hidden tablet:inline">
              •
            </span>
            <a href="mailto:info@hokami.cz" className={linkClassName}>
              info@hokami.cz
            </a>
            <span aria-hidden="true">•</span>
            <a href="tel:+420482425984" className={linkClassName}>
              +420 482 425 984
            </a>
          </span>
        </div>

        <nav
          aria-label={t("legal")}
          className="-my-2.5 flex flex-wrap items-center justify-center gap-x-2"
        >
          <Link href="/gdpr" className={linkClassName}>
            {t("privacy")}
          </Link>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true">•</span>
            <CookieSettings className={`${linkClassName} cursor-pointer`} />
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true">•</span>
            <Link href="/whistleblowing" className={linkClassName}>
              {t("whistleblowing")}
            </Link>
          </span>
        </nav>

        <FooterLanguages locale={locale} label={t("language")} />
      </div>
    </footer>
  );
}
