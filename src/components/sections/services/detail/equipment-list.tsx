import { Text } from "@/components/typography/text";
import { FactList } from "@/components/sections/fact-list/fact-list";

export type EquipmentItem = { id: string; text: string };

export function EquipmentList({ items }: { items: readonly EquipmentItem[] }) {
  return (
    <FactList>
      <ul>
        {items.map(({ id, text }) => (
          <li key={id}>
            <Text className="min-w-0 flex-1">{text}</Text>
          </li>
        ))}
      </ul>
    </FactList>
  );
}
