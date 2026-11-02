import type { PreparedStatistic, TrustStatistic } from "./types";

export function prepareStatistic(
  statistic: TrustStatistic,
  locale: string,
): PreparedStatistic {
  if (!Number.isFinite(statistic.value)) {
    throw new RangeError(
      `Statistic "${statistic.id}" must have a finite value.`,
    );
  }

  const formatter = new Intl.NumberFormat(locale, statistic.format);
  const number = formatter.format(statistic.value);
  const { numberingSystem, notation } = formatter.resolvedOptions();
  // Older engines expose Locale Info through a getter instead of a method.
  const localeInfo = new Intl.Locale(locale) as Intl.Locale & {
    getTextInfo?: () => { direction: "ltr" | "rtl" };
    textInfo?: { direction: "ltr" | "rtl" };
  };
  const direction =
    localeInfo.getTextInfo?.().direction ?? localeInfo.textInfo?.direction;

  return {
    ...statistic,
    formattedValue: `${statistic.prefix ?? ""}${number}${statistic.suffix ?? ""}`,
    supportsAnimation:
      numberingSystem === "latn" &&
      direction === "ltr" &&
      (notation === "standard" || notation === "compact"),
  };
}
