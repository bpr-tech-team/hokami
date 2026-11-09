import type { ComponentProps } from "react";
import { Container } from "@/components/layout/container";
import { sectionVariants } from "@/components/layout/section-variants";
import { MediaTextBlock } from "@/components/sections/media-text/media-text-block";
import { Text } from "@/components/typography/text";
import { EquipmentList, type EquipmentItem } from "./equipment-list";

export type ServiceMediaBlock = Pick<
  ComponentProps<typeof MediaTextBlock>,
  "id" | "eyebrow" | "title" | "image" | "imagePosition"
> & {
  paragraphs: readonly EquipmentItem[];
  items?: readonly EquipmentItem[];
  conclusion?: string;
};

export function ServiceMediaSection({
  blocks,
}: {
  blocks: readonly ServiceMediaBlock[];
}) {
  return (
    <div className={sectionVariants()}>
      <Container className="flex flex-col gap-10 desktop:gap-16">
        {blocks.map(({ paragraphs, items, conclusion, ...block }) => (
          <MediaTextBlock key={block.id} {...block}>
            {paragraphs.map(({ id, text }) => (
              <Text key={id} tone="secondary">
                {text}
              </Text>
            ))}
            {items && <EquipmentList items={items} />}
            {conclusion && <Text tone="secondary">{conclusion}</Text>}
          </MediaTextBlock>
        ))}
      </Container>
    </div>
  );
}
