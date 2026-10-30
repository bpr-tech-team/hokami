import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text, type TextProps } from "@/components/typography/text";
import { Container } from "./container";

const sectionVariants = cva(
  "px-5 py-18 wrap-anywhere tablet:px-10 tablet:py-24 desktop:px-20 desktop:py-32",
  {
    variants: {
      tone: {
        default: "bg-surface-default",
        subtle: "bg-surface-subtle",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

type SectionProps = Omit<ComponentPropsWithoutRef<"section">, "title"> &
  VariantProps<typeof sectionVariants> & {
    id: string;
    eyebrow: ReactNode;
    title: ReactNode;
    description: ReactNode;
    descriptionTone?: TextProps["tone"];
    descriptionClassName?: string;
    contentClassName?: string;
  };

export function Section({
  id,
  eyebrow,
  title,
  description,
  descriptionTone,
  descriptionClassName,
  contentClassName,
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
        className={cn("flex flex-col gap-6 desktop:gap-8", contentClassName)}
      >
        <header className="flex flex-col gap-6 desktop:gap-8">
          <MonoText variant="eyebrow">{eyebrow}</MonoText>
          <Heading id={headingId}>{title}</Heading>
          <Text
            variant="lead"
            tone={descriptionTone}
            className={descriptionClassName}
          >
            {description}
          </Text>
        </header>
        {children}
      </Container>
    </section>
  );
}
