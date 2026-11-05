import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { EquipmentList, type EquipmentItem } from "./equipment-list";
import { cn } from "@/lib/utils";

export type EquipmentGroup = {
  id: string;
  title: string;
  items?: readonly EquipmentItem[];
  paragraphs?: readonly { id: string; text: string }[];
};

type ServiceEquipmentSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  groups: readonly EquipmentGroup[];
};

export function ServiceEquipmentSection({
  id,
  eyebrow,
  title,
  groups,
}: ServiceEquipmentSectionProps) {
  return (
    <Section
      id={id}
      eyebrow={eyebrow}
      title={title}
      tone="subtle"
      contentClassName="gap-10 desktop:gap-16"
    >
      <ul
        className={cn(
          "grid gap-6",
          groups.length === 1 ? "tablet:grid-cols-1" : "tablet:grid-cols-2",
          groups.length >= 3
            ? "desktop:grid-cols-3"
            : groups.length === 2
              ? "desktop:grid-cols-2"
              : "desktop:grid-cols-1",
        )}
      >
        {groups.map((group) => (
          <li key={group.id} className="flex min-w-0 flex-col gap-4">
            <Heading as="h3" variant="subsection">
              {group.title}
            </Heading>
            {group.items && <EquipmentList items={group.items} />}
            {group.paragraphs?.map((paragraph) => (
              <Text key={paragraph.id} tone="secondary">
                {paragraph.text}
              </Text>
            ))}
          </li>
        ))}
      </ul>
    </Section>
  );
}
