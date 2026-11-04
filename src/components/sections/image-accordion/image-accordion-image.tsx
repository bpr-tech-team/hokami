import Image from "next/image";
import { cn } from "@/lib/utils";
import { MonoText } from "@/components/typography/mono-text";
import type { ImageAccordionEntry, ImageCrop } from "./types";

function cropStyle(crop: ImageCrop) {
  // Scale the complete Figma crop uniformly to cover either responsive frame.
  const scale = `max(100cqw / ${crop.frameWidth}, 100cqh / ${crop.frameHeight})`;
  return {
    left: `calc(${crop.x} * ${scale})`,
    top: `calc(${crop.y} * ${scale})`,
    width: `calc(${crop.width} * ${scale})`,
    height: `calc(${crop.height} * ${scale})`,
  };
}

export function ImageAccordionImage({
  item,
  showCode = false,
}: {
  item: ImageAccordionEntry;
  showCode?: boolean;
}) {
  const crop = showCode ? item.imageCrop?.desktop : item.imageCrop?.compact;
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-inverse",
        showCode ? "h-full" : "h-[200px] shrink-0 tablet:h-80 desktop:hidden",
      )}
    >
      <div className="[container-type:size] absolute inset-0">
        <div
          className="absolute inset-0"
          style={crop ? cropStyle(crop) : undefined}
        >
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes={
              crop
                ? "(min-width: 760px) 1800px, 1501px"
                : showCode
                  ? "(min-width: 1360px) 700px, 54vw"
                  : "(min-width: 1080px) 1px, (min-width: 760px) calc(100vw - 120px), calc(100vw - 80px)"
            }
            className="object-cover"
          />
        </div>
      </div>
      {showCode && (
        <MonoText
          as="span"
          tone="inverse"
          className="absolute bottom-8 left-8 flex items-center gap-2.5 border border-action-primary bg-surface-inverse px-3 py-2 backdrop-blur-sm"
        >
          <span
            className="size-1.5 shrink-0 rounded-[50%] bg-action-primary shadow-[0_0_8px_rgb(from_var(--color-brand-identity)_r_g_b/0.8)]"
            aria-hidden="true"
          />
          {item.code}
        </MonoText>
      )}
    </div>
  );
}
