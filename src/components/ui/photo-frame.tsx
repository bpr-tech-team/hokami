import Image, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { PhotoTrace } from "./photo-trace";

type PhotoFrameProps = Pick<
  ImageProps,
  "src" | "alt" | "sizes" | "unoptimized"
> & {
  objectPosition?: CSSProperties["objectPosition"];
  className?: string;
};

/** Own the photo's coordinates; className only controls its outer placement. */
export function PhotoFrame({
  src,
  alt,
  sizes,
  unoptimized,
  objectPosition,
  className,
}: PhotoFrameProps) {
  return (
    <div data-rich-text-island className={cn("min-w-0", className)}>
      <div data-photo-frame className="relative aspect-3/2">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            unoptimized={unoptimized}
            className="object-cover"
            style={objectPosition ? { objectPosition } : undefined}
          />
        </div>
        <PhotoTrace />
      </div>
    </div>
  );
}
