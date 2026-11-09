import { ImageAccordion } from "@/components/sections/image-accordion/image-accordion";
import type { Industry } from "./types";

export function IndustryAccordion({ items }: { items: Industry[] }) {
  return (
    <ImageAccordion
      items={items.map(({ focus, ...item }) => ({
        ...item,
        metadata: focus,
      }))}
    />
  );
}
