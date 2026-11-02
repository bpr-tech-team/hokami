import { getLocale, getTranslations } from "next-intl/server";
import { TrustStrip } from "@/components/sections/trust-strip/trust-strip";
import type { TrustStatistic } from "@/components/sections/trust-strip/types";

const years = 35;
const specialists = 300;

export async function HomeTrustStrip() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("TrustStrip"),
  ]);

  const items: TrustStatistic[] = [
    {
      id: "years",
      value: years,
      label: t("years.label"),
      suffix: t("years.suffix", { count: years }),
    },
    {
      id: "specialists",
      value: specialists,
      label: t("specialists.label", { count: specialists }),
      suffix: t("specialists.suffix"),
    },
    {
      id: "turnover",
      value: 30000000,
      label: t("turnover.label"),
      format: { notation: "compact", maximumFractionDigits: 0 },
      suffix: t("turnover.suffix"),
    },
    {
      id: "export",
      value: 0.85,
      label: t("export.label"),
      format: { style: "percent", maximumFractionDigits: 0 },
    },
  ];

  return (
    <TrustStrip
      id="company-statistics"
      aria-label={t("label")}
      items={items}
      locale={locale}
    />
  );
}
