"use client";

import type { Locale } from "next-intl";
import { Suspense } from "react";
import { usePathname } from "@/i18n/navigation";
import { LanguageSwitch } from "@/components/navigation/language-switch";
import { useSiteLocation } from "@/hooks/use-site-location";

type FooterLanguagesProps = { locale: Locale; label: string };

function LanguageLinks({
  locale,
  label,
  href,
}: FooterLanguagesProps & { href: string }) {
  return (
    <LanguageSwitch
      variant="footer"
      locale={locale}
      label={label}
      href={href}
    />
  );
}

function LanguagesWithLocation(props: FooterLanguagesProps) {
  const { pathname, search, hash } = useSiteLocation();
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
