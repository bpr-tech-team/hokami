import { FeatureCard, type FeatureCardProps } from "./feature-card";
import { cn } from "@/lib/utils";

type FeatureCardItem = FeatureCardProps & { id: string };

export function FeatureCardGrid({
  items,
  columns = 3,
}: {
  items: readonly FeatureCardItem[];
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={cn(
        "grid bg-border-brand-subtle p-px tablet:grid-cols-2 desktop:bg-transparent desktop:p-0",
        columns === 2 ? "desktop:grid-cols-2" : "desktop:grid-cols-3",
      )}
    >
      {items.map(({ id, ...card }) => (
        <li key={id} className="min-w-0">
          <FeatureCard {...card} />
        </li>
      ))}
    </ul>
  );
}
