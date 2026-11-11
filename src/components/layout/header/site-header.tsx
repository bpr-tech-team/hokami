import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SiteHeaderClient } from "./site-header-client";
import { headerNavigation } from "./navigation";
import { publicFormsEnabled } from "@/lib/forms/availability";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [t, contact] = await Promise.all([
    getTranslations({ locale, namespace: "Header" }),
    getTranslations({ locale, namespace: "ContactHero" }),
  ]);

  return (
    <SiteHeaderClient
      locale={locale}
      labels={{
        navigation: t("navigation"),
        home: t("home"),
        skip: t("skip"),
        openMenu: t("openMenu"),
        closeMenu: t("closeMenu"),
        language: t("language"),
        request: publicFormsEnabled ? t("request") : contact("contact"),
        requestShort: publicFormsEnabled
          ? t("requestShort")
          : t("items.contact"),
      }}
      items={headerNavigation.map((item) => ({
        ...item,
        label: t(`items.${item.key}`),
      }))}
    />
  );
}
