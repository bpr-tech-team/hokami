import type { ImageProps } from "next/image";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/layout/section-header";
import { PhotoFrame } from "@/components/ui/photo-frame";

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
      <PhotoFrame
        src={image.src}
        alt={image.alt}
        sizes="(min-width: 1360px) 588px, (min-width: 1080px) calc((100vw - 184px) / 2), (min-width: 760px) calc(100vw - 80px), calc(100vw - 40px)"
        objectPosition={image.objectPosition}
        className={imagePosition === "left" ? "desktop:-order-1" : undefined}
      />
    </section>
  );
}
