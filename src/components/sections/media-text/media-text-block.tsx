import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/layout/section-header";
import { PhotoTrace } from "@/components/ui/photo-trace";
import { cn } from "@/lib/utils";

type MediaTextBlockProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  image: Pick<ImageProps, "src" | "alt"> & { objectPosition?: string };
  imagePosition?: "left" | "right";
};

export function MediaTextBlock({
  id,
  eyebrow,
  title,
  children,
  image,
  imagePosition = "right",
}: MediaTextBlockProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="grid gap-6 desktop:grid-cols-2 desktop:items-start"
    >
      <SectionHeader
        headingId={`${id}-heading`}
        eyebrow={eyebrow}
        title={title}
        metadata={
          <div className="flex flex-col gap-6 desktop:gap-8">{children}</div>
        }
      />
      <div
        className={cn(
          "relative aspect-3/2 min-w-0",
          imagePosition === "left" && "desktop:-order-1",
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1360px) 588px, (min-width: 1080px) calc((100vw - 184px) / 2), (min-width: 760px) calc(100vw - 80px), calc(100vw - 40px)"
          className="object-cover"
          style={
            image.objectPosition
              ? { objectPosition: image.objectPosition }
              : undefined
          }
        />
        <PhotoTrace />
      </div>
    </section>
  );
}
