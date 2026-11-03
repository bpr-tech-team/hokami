import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { prepareStatistic } from "./format-statistic";
import { StatGrid } from "./stat-grid";
import { StatItem } from "./stat-item";
import { getStatLayout } from "./stat-layout";
import type { TrustStatistic } from "./types";

type TrustStripProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "aria-label"
> & {
  "aria-label": string;
  items: readonly TrustStatistic[];
  locale: string;
};

export function TrustStrip({
  items,
  locale,
  className,
  ...props
}: TrustStripProps) {
  if (items.length === 0) return null;

  const layouts = ([1, 2, 3, 4] as const).map((columns) =>
    getStatLayout(items.length, columns),
  );

  return (
    <section
      {...props}
      data-slot="trust-strip"
      className={cn(
        "@container/trust-strip border-y border-brand-identity/50 bg-surface-subtle",
        className,
      )}
    >
      <div className="px-5 @min-[760px]/trust-strip:px-10 @min-[1080px]/trust-strip:px-20">
        <Container className="@container/trust-grid">
          <StatGrid>
            {items.map((item, index) => (
              <StatItem
                key={item.id}
                statistic={prepareStatistic(item, locale)}
                locale={locale}
                layouts={layouts.map((layout) => layout[index])}
              />
            ))}
          </StatGrid>
        </Container>
      </div>
    </section>
  );
}
