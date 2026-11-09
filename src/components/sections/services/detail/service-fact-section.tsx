import { Section } from "@/components/layout/section";
import { EquipmentList, type EquipmentItem } from "./equipment-list";

export function ServiceFactSection({
  id,
  title,
  description,
  items,
}: {
  id: string;
  title: string;
  description?: string;
  items: readonly EquipmentItem[];
}) {
  return (
    <Section id={id} title={title} description={description} tone="subtle">
      <EquipmentList items={items} columns={2} />
    </Section>
  );
}
