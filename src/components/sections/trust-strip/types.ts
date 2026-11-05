export type AdditionalStatisticValue = {
  id: string;
  value: number;
  prefix: string;
};

export type TrustStatistic = {
  id: string;
  value: number;
  label: string;
  format?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  accessibleValue?: string;
  additionalValues?: readonly AdditionalStatisticValue[];
  compact?: { label: string; suffix: string };
};

export type PreparedStatistic = Omit<TrustStatistic, "compact"> & {
  formattedValue: string;
  supportsAnimation: boolean;
  compact?: { label: string; suffix: string; formattedValue: string };
};
