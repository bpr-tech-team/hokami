import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/utils";
import { awards } from "./data";

export async function AboutAwards() {
  const t = await getTranslations("AboutAwards");

  return (
    <Section
      id="awards"
      eyebrow={t("eyebrow")}
      title={t("title")}
      contentClassName="gap-8 desktop:gap-16"
    >
      <ul className="grid min-w-0 grid-cols-1 items-center gap-8 desktop:grid-cols-2">
        {awards.map(({ id, src, width, height, variant }) => (
          <li
            key={id}
            className="flex min-w-0 items-center justify-center px-4"
          >
            <Image
              src={src}
              alt={t(`images.${id}`)}
              width={width}
              height={height}
              sizes={
                variant === "diploma"
                  ? "(max-width: 394px) calc(100vw - 72px), 322px"
                  : undefined
              }
              loading="lazy"
              unoptimized={src.endsWith(".svg")}
              className={cn(
                "h-auto max-w-full object-contain",
                variant === "diploma" && "w-[322px]",
              )}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
