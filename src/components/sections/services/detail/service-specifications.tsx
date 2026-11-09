import { Section } from "@/components/layout/section";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";

export type ServiceSpecification = {
  id: string;
  label: string;
  values: readonly { id: string; text: string }[];
};

export function ServiceSpecifications({
  title,
  rows,
}: {
  title: string;
  rows: readonly ServiceSpecification[];
}) {
  return (
    <Section id="specifications" title={title} tone="subtle">
      <dl className="divide-y divide-brand-identity border border-brand-identity bg-surface-default">
        {rows.map(({ id, label, values }) => (
          <div
            key={id}
            className="grid gap-2 p-4 desktop:grid-cols-[1fr_2fr] desktop:gap-6 desktop:p-6"
          >
            <dt>
              <MonoText
                as="span"
                variant="meta"
                tone="tertiary"
                className="font-bold"
              >
                {label}
              </MonoText>
            </dt>
            <dd className="flex min-w-0 flex-col gap-2">
              {values.map((value) => (
                <Text key={value.id}>{value.text}</Text>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
