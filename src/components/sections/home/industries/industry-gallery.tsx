import { IndustryImage } from "./industry-image";
import type { Industry } from "./types";

export function IndustryGallery({
  items,
  activeIndex,
}: {
  items: Industry[];
  activeIndex: number;
}) {
  return (
    <div className="relative isolate hidden min-w-0 overflow-hidden bg-surface-inverse desktop:block">
      {items.map((industry, index) => (
        <div
          key={industry.id}
          aria-hidden={index !== activeIndex}
          data-below={index > activeIndex}
          data-industry-image={industry.id}
          className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] data-[below=true]:translate-y-full"
        >
          <IndustryImage industry={industry} showCode />
        </div>
      ))}
    </div>
  );
}
