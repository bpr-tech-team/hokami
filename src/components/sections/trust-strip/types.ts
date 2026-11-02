export type TrustStatistic = {
  id: string;
  value: number;
  label: string;
  format?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  accessibleValue?: string;
};

export type PreparedStatistic = TrustStatistic & {
  formattedValue: string;
  supportsAnimation: boolean;
};
