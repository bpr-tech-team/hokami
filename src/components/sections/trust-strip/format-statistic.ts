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
  for (const part of statistic.additionalValues ?? []) {
    if (!Number.isFinite(part.value)) {
      throw new RangeError(
        `Statistic "${statistic.id}" part "${part.id}" must have a finite value.`,
      );
    }
  }

  const formatter = new Intl.NumberFormat(locale, statistic.format);
  const number = [
    formatter.format(statistic.value),
    ...(statistic.additionalValues ?? []).map(
      (part) => `${part.prefix}${formatter.format(part.value)}`,
    ),
  ].join("");
  const formattedValue = `${statistic.prefix ?? ""}${number}${statistic.suffix ?? ""}`;
  const compact = statistic.compact && {
    ...statistic.compact,
    formattedValue: `${statistic.prefix ?? ""}${number}${statistic.compact.suffix}`,
  };
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
    formattedValue,
    compact,
    supportsAnimation:
      numberingSystem === "latn" &&
      direction === "ltr" &&
      (notation === "standard" || notation === "compact"),
  };
}
