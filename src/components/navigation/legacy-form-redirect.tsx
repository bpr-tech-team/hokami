"use client";

import { Suspense, useEffect } from "react";
import type { Locale } from "next-intl";
import { useSiteLocation } from "@/hooks/use-site-location";
import { getLegacyFormRedirect } from "@/lib/forms/navigation";

type LegacyFormRedirectProps = {
  locale: Locale;
  formHref: string;
};

function RedirectWithLocation({ locale, formHref }: LegacyFormRedirectProps) {
  const { pathname, search, hash } = useSiteLocation();
  useEffect(() => {
    // Read the browser URL to retain the exact query encoding during replacement.
    const href = getLegacyFormRedirect(window.location, locale, formHref);
    if (href) window.location.replace(href);
  }, [locale, formHref, pathname, search, hash]);

  return null;
}

export function LegacyFormRedirect(props: LegacyFormRedirectProps) {
  return (
    <Suspense fallback={null}>
      <RedirectWithLocation {...props} />
    </Suspense>
  );
}
