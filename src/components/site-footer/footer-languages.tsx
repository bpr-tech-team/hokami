"use client";

import type { Locale } from "next-intl";
import { Suspense } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { headerLanguages } from "@/components/site-header/navigation";
import { useHeaderLocation } from "@/components/site-header/use-header-location";

type FooterLanguagesProps = { locale: Locale; label: string };

function LanguageLinks({
  locale,
  label,
  href,
}: FooterLanguagesProps & { href: string }) {
  return (
    <nav aria-label={label} className="-my-2.5 flex flex-wrap justify-center">
      {headerLanguages.map((language) => (
        <Link
          key={language.locale}
          href={href}
          locale={language.locale}
          lang={language.locale}
          hrefLang={language.locale}
          aria-label={language.name}
          aria-current={language.locale === locale ? "true" : undefined}
          className="inline-flex min-h-11 min-w-11 items-center justify-center underline-offset-2 hover:underline aria-current:underline"
        >
          {language.code}
        </Link>
      ))}
    </nav>
  );
}

function LanguagesWithLocation(props: FooterLanguagesProps) {
  const { pathname, search, hash } = useHeaderLocation();
  return <LanguageLinks {...props} href={`${pathname}${search}${hash}`} />;
}

export function FooterLanguages(props: FooterLanguagesProps) {
  const pathname = usePathname();
  return (
    <Suspense fallback={<LanguageLinks {...props} href={pathname} />}>
      <LanguagesWithLocation {...props} />
    </Suspense>
  );
}
