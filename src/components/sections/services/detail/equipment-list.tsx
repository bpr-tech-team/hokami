import Image from "next/image";
import { Text } from "@/components/typography/text";

export type EquipmentItem = { id: string; text: string };

export function EquipmentList({ items }: { items: readonly EquipmentItem[] }) {
  return (
    <ul>
      {items.map(({ id, text }) => (
        <li
          key={id}
          className="flex items-start gap-3 border-b border-border-subtle py-3"
        >
          <Image
            src="/images/services/check.svg"
            alt=""
            width={20}
            height={20}
            unoptimized
            className="shrink-0"
          />
          <Text className="min-w-0 flex-1">{text}</Text>
        </li>
      ))}
    </ul>
  );
}
