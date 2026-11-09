import type { ComponentProps } from "react";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import type { EquipmentItem } from "./equipment-list";
import { FactListGrid } from "@/components/sections/fact-list/fact-list-grid";

export type EquipmentGroup = {
  id: string;
  title: string;
  description?: string;
  listLabel?: string;
  items?: readonly EquipmentItem[];
  paragraphs?: readonly { id: string; text: string }[];
};

type ServiceEquipmentSectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  groups: readonly EquipmentGroup[];
  tone?: ComponentProps<typeof Section>["tone"];
};

export function ServiceEquipmentSection({
  id,
  eyebrow,
  title,
  description,
  groups,
  tone = "subtle",
}: ServiceEquipmentSectionProps) {
  const hasDescriptions = groups.some((group) => group.description);
  const hasListLabels = groups.some((group) => group.listLabel);
  return (
    <Section
      id={id}
      eyebrow={eyebrow}
      title={title}
      description={description}
      descriptionTone="secondary"
      tone={tone}
      contentClassName="gap-10 desktop:gap-16"
    >
      <FactListGrid
        columns={3}
        tabletColumns={2}
        groups={groups.map((group) => ({
          id: group.id,
          header: [
            <Heading key="title" as="h3" variant="subsection">
              {group.title}
            </Heading>,
            ...(hasDescriptions
              ? [
                  group.description ? (
                    <Text key="description" tone="secondary">
                      {group.description}
                    </Text>
                  ) : null,
                ]
              : []),
            ...(hasListLabels
              ? [
                  group.listLabel ? (
                    <Heading key="label" as="h4" variant="item">
                      {group.listLabel}
                    </Heading>
                  ) : null,
                ]
              : []),
          ],
          items: group.items?.map(({ id, text }) => ({
            id,
            content: <Text>{text}</Text>,
          })),
          after: group.paragraphs?.length
            ? group.paragraphs.map(({ id, text }) => (
                <Text key={id} tone="secondary">
                  {text}
                </Text>
              ))
            : undefined,
        }))}
      />
    </Section>
  );
}
