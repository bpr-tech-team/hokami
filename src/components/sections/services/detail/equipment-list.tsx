import { Text } from "@/components/typography/text";
import { FactListGrid } from "@/components/sections/fact-list/fact-list-grid";

export type EquipmentItem = { id: string; text: string };

export function EquipmentList({
  items,
  columns = 1,
}: {
  items: readonly EquipmentItem[];
  columns?: 1 | 2;
}) {
  return (
    <FactListGrid
      columns={columns}
      items={items.map(({ id, text }) => ({
        id,
        content: <Text>{text}</Text>,
      }))}
    />
  );
}
