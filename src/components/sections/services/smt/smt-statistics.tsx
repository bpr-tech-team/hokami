import { getLocale, getTranslations } from "next-intl/server";
import { TrustStrip } from "@/components/sections/trust-strip/trust-strip";
import type { TrustStatistic } from "@/components/sections/trust-strip/types";
import { smtStatistics as values } from "./data";

export async function SmtStatistics() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Smt.statistics"),
  ]);
  const items: TrustStatistic[] = [
    {
      id: "lines",
      value: values.lines,
      label: t("lines.label"),
      suffix: t("lines.suffix", { count: values.lines }),
    },
    {
      id: "placements",
      value: values.placements,
      label: t("placements.label"),
      format: { notation: "compact", maximumFractionDigits: 0 },
      suffix: "+",
    },
    {
      id: "dimensions",
      value: values.boardWidth,
      additionalValues: [
        { id: "height", value: values.boardHeight, prefix: " × " },
      ],
      suffix: " mm",
      label: t("dimensions.label"),
      compact: {
        suffix: "",
        label: t("dimensions.compactLabel"),
      },
      accessibleValue: t("dimensions.accessible", {
        width: values.boardWidth,
        height: values.boardHeight,
      }),
    },
    {
      id: "express",
      value: values.expressHours,
      label: t("express.label"),
      suffix: " h",
    },
  ];
  return (
    <TrustStrip
      id="service-statistics"
      aria-label={t("label")}
      items={items}
      locale={locale}
    />
  );
}
