"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "cn";
import { showCookiePreferences } from "@/lib/cookie-consent";
import { footerLinkVariants } from "./footer-link";

export function CookieSettings({ className }: { className?: string }) {
  const t = useTranslations("Cookies");
  const locale = useLocale();

  return (
    <button
      type="button"
      className={cn(footerLinkVariants(), "cursor-pointer", className)}
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
