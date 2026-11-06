import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { TextProps } from "@/components/typography/text";
import { Container } from "./container";
import { SectionHeader } from "./section-header";
import { sectionVariants } from "./section-variants";

type SectionProps = Omit<ComponentPropsWithoutRef<"section">, "title"> &
  VariantProps<typeof sectionVariants> & {
    id: string;
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    descriptionTone?: TextProps["tone"];
    descriptionClassName?: string;
    headerClassName?: string;
    headingClassName?: string;
    contentClassName?: string;
    layout?: "stack" | "split" | "split-equal";
    metadata?: ReactNode;
  };

export function Section({
  id,
  eyebrow,
  title,
  description,
  descriptionTone,
  descriptionClassName,
  headerClassName,
  headingClassName,
  contentClassName,
  layout = "stack",
  metadata,
  tone,
  className,
  children,
  ...props
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      {...props}
      className={cn(sectionVariants({ tone }), className)}
    >
      <Container
        className={cn(
          "flex flex-col gap-6 desktop:gap-8",
          layout === "split" &&
            "gap-8 desktop:grid desktop:grid-cols-[minmax(0,508fr)_minmax(0,622fr)] desktop:items-start desktop:gap-[70px]",
          layout === "split-equal" &&
            "desktop:grid desktop:grid-cols-2 desktop:items-start desktop:gap-6",
          contentClassName,
        )}
      >
        <SectionHeader
          headingId={headingId}
          eyebrow={eyebrow}
          title={title}
          description={description}
          descriptionTone={descriptionTone}
          descriptionClassName={descriptionClassName}
          metadata={metadata}
          className={cn(
            "flex min-w-0 flex-col gap-6 desktop:gap-8",
            layout === "split" && "gap-5 desktop:gap-5",
            layout === "split-equal" && "desktop:gap-6",
            headerClassName,
          )}
          headingClassName={cn(
            "flex flex-col gap-6 desktop:gap-8",
            layout === "split-equal" && "desktop:gap-6",
            headingClassName,
          )}
        />
        {children}
      </Container>
    </section>
  );
}
