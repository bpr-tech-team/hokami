import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text, type TextProps } from "@/components/typography/text";

type SectionHeaderProps = {
  headingId: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  descriptionTone?: TextProps["tone"];
  descriptionClassName?: string;
  headingClassName?: string;
  className?: string;
  metadata?: ReactNode;
};

export function SectionHeader({
  headingId,
  eyebrow,
  title,
  description,
  descriptionTone,
  descriptionClassName,
  headingClassName,
  className,
  metadata,
}: SectionHeaderProps) {
  return (
    <header
      className={cn("flex min-w-0 flex-col gap-6 desktop:gap-8", className)}
    >
      <div
        className={cn("flex flex-col gap-6 desktop:gap-8", headingClassName)}
      >
        <MonoText variant="eyebrow">{eyebrow}</MonoText>
        <Heading id={headingId}>{title}</Heading>
      </div>
      {description != null && (
        <Text
          variant="lead"
          tone={descriptionTone}
          className={descriptionClassName}
        >
          {description}
        </Text>
      )}
      {metadata}
    </header>
  );
}
