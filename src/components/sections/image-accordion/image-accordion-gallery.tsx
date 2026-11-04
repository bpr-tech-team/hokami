import { ImageAccordionImage } from "./image-accordion-image";
import type { ImageAccordionEntry } from "./types";

export function ImageAccordionGallery({
  items,
  activeIndex,
}: {
  items: ImageAccordionEntry[];
  activeIndex: number;
}) {
  return (
    <div className="relative isolate hidden min-w-0 overflow-hidden bg-surface-inverse desktop:block">
      {items.map((item, index) => (
        <div
          key={item.id}
          aria-hidden={index !== activeIndex}
          data-below={index > activeIndex}
          data-image-accordion-image={item.id}
          className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] data-[below=true]:translate-y-full"
        >
          <ImageAccordionImage item={item} showCode />
        </div>
      ))}
    </div>
  );
}
