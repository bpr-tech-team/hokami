"use client";

import { useLocale, useTranslations } from "next-intl";
import { showCookiePreferences } from "@/lib/cookie-consent";

export function CookieSettings({ className }: { className?: string }) {
  const t = useTranslations("Cookies");
  const locale = useLocale();

  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => {
        void showCookiePreferences(locale).catch((error: unknown) => {
          console.error("Unable to open cookie preferences", error);
        });
      }}
    >
      {t("title")}
    </button>
  );
}
