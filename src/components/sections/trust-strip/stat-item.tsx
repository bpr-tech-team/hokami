import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import { AnimatedNumber } from "./animated-number";
import type { StatLayout } from "./stat-layout";
import type { PreparedStatistic } from "./types";

type StatItemProps = {
  statistic: PreparedStatistic;
  locale: string;
  layouts: StatLayout[];
};

export function StatItem({ statistic, locale, layouts }: StatItemProps) {
  const style: CSSProperties & Record<`--${string}`, number> = {};

  layouts.forEach((layout, index) => {
    const columns = index + 1;
    style[`--stat-span-${columns}`] = layout.span;
    style[`--stat-right-${columns}`] = Number(!layout.rowEnd);
    style[`--stat-bottom-${columns}`] = Number(!layout.lastRow);
  });

  return (
    <div
      data-stat-item={statistic.id}
      style={style}
      className={cn(
        "col-span-(--stat-span) flex min-w-0 flex-col items-center gap-2 border-r-[length:calc(var(--stat-right)*var(--stat-vertical)*1px)] border-b-[length:calc(var(--stat-bottom)*1px)] border-brand-identity/50 px-5 py-6 text-center",
        "[--stat-bottom:var(--stat-bottom-1)] [--stat-right:var(--stat-right-1)] [--stat-span:var(--stat-span-1)]",
        "@min-[320px]/trust-grid:[--stat-bottom:var(--stat-bottom-2)] @min-[320px]/trust-grid:[--stat-right:var(--stat-right-2)] @min-[320px]/trust-grid:[--stat-span:var(--stat-span-2)]",
        "@min-[672px]/trust-grid:[--stat-bottom:var(--stat-bottom-3)] @min-[672px]/trust-grid:[--stat-right:var(--stat-right-3)] @min-[672px]/trust-grid:[--stat-span:var(--stat-span-3)]",
        "@min-[896px]/trust-grid:px-10 @min-[896px]/trust-grid:[--stat-bottom:var(--stat-bottom-4)] @min-[896px]/trust-grid:[--stat-right:var(--stat-right-4)] @min-[896px]/trust-grid:[--stat-span:var(--stat-span-4)]",
        "group-data-[columns=1]/stat-grid:[--stat-bottom:var(--stat-bottom-1)] group-data-[columns=1]/stat-grid:[--stat-right:var(--stat-right-1)] group-data-[columns=1]/stat-grid:[--stat-span:var(--stat-span-1)]",
        "group-data-[columns=2]/stat-grid:[--stat-bottom:var(--stat-bottom-2)] group-data-[columns=2]/stat-grid:[--stat-right:var(--stat-right-2)] group-data-[columns=2]/stat-grid:[--stat-span:var(--stat-span-2)]",
        "group-data-[columns=3]/stat-grid:[--stat-bottom:var(--stat-bottom-3)] group-data-[columns=3]/stat-grid:[--stat-right:var(--stat-right-3)] group-data-[columns=3]/stat-grid:[--stat-span:var(--stat-span-3)]",
        "group-data-[columns=4]/stat-grid:[--stat-bottom:var(--stat-bottom-4)] group-data-[columns=4]/stat-grid:[--stat-right:var(--stat-right-4)] group-data-[columns=4]/stat-grid:[--stat-span:var(--stat-span-4)]",
      )}
    >
      <dt className="order-2 w-full wrap-anywhere">
        <MonoText tone="tertiary">
          {statistic.compact ? (
            <>
              <span className="@min-[672px]/trust-grid:hidden">
                {statistic.compact.label}
              </span>
              <span className="hidden @min-[672px]/trust-grid:inline">
                {statistic.label}
              </span>
            </>
          ) : (
            statistic.label
          )}
        </MonoText>
      </dt>
      <dd className="max-w-full min-w-0">
        <Text
          as="span"
          variant="stat"
          className="block @min-[672px]/trust-grid:text-[32px] @min-[672px]/trust-grid:leading-[32px]"
        >
          {statistic.compact ? (
            <>
              <span className="@min-[672px]/trust-grid:hidden">
                <AnimatedNumber
                  {...statistic}
                  suffix={statistic.compact.suffix}
                  formattedValue={statistic.compact.formattedValue}
                  accessibleValue={
                    statistic.accessibleValue ?? statistic.formattedValue
                  }
                  locale={locale}
                />
              </span>
              <span className="hidden @min-[672px]/trust-grid:inline">
                <AnimatedNumber {...statistic} locale={locale} />
              </span>
            </>
          ) : (
            <AnimatedNumber {...statistic} locale={locale} />
          )}
        </Text>
      </dd>
    </div>
  );
}
