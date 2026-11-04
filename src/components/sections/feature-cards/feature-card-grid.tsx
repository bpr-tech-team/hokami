import { FeatureCard, type FeatureCardProps } from "./feature-card";

type FeatureCardItem = FeatureCardProps & { id: string };

export function FeatureCardGrid({
  items,
}: {
  items: readonly FeatureCardItem[];
}) {
  return (
    <ul className="grid bg-border-brand-subtle p-px tablet:grid-cols-2 desktop:grid-cols-3 desktop:p-0">
      {items.map(({ id, ...card }) => (
        <li key={id} className="min-w-0">
          <FeatureCard {...card} />
        </li>
      ))}
    </ul>
  );
}
