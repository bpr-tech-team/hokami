"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Accordion } from "@/components/ui/accordion";
import { ImageAccordionGallery } from "./image-accordion-gallery";
import { ImageAccordionItem } from "./image-accordion-item";
import type { ImageAccordionEntry } from "./types";

export function ImageAccordion({
  items,
  listClassName,
}: {
  items: ImageAccordionEntry[];
  listClassName?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] ?? items[0];
  if (!activeItem) return null;

  function changeItem(value: string[]) {
    const nextIndex = items.findIndex((item) => item.id === value[0]);
    // Keep one panel open, including on repeated clicks of its trigger.
    if (nextIndex !== -1) setActiveIndex(nextIndex);
  }

  return (
    <div className="py-6">
      <div className="desktop:grid desktop:grid-cols-[5fr_7fr]">
        <Accordion
          value={[activeItem.id]}
          onValueChange={changeItem}
          className={cn(
            "min-w-0 border-t border-border-brand-subtle desktop:min-h-[536px] desktop:border-r",
            listClassName,
          )}
        >
          {items.map((item) => (
            <ImageAccordionItem key={item.id} item={item} />
          ))}
        </Accordion>
        <ImageAccordionGallery items={items} activeIndex={activeIndex} />
      </div>
    </div>
  );
}
