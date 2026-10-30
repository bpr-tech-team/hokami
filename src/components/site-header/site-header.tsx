import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SiteHeaderClient } from "./site-header-client";
import { headerNavigation } from "./navigation";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Header" });

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
        request: t("request"),
        requestShort: t("requestShort"),
      }}
      items={headerNavigation.map((item) => ({
        ...item,
        label: t(`items.${item.key}`),
      }))}
    />
  );
}
