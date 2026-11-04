import { ImageAccordion } from "@/components/sections/image-accordion/image-accordion";
import type { Industry } from "./types";

export function IndustryAccordion({ items }: { items: Industry[] }) {
  return (
    <ImageAccordion
      items={items.map(({ certification, ...item }) => ({
        ...item,
        metadata: certification,
      }))}
    />
  );
}
