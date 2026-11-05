import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text, type TextProps } from "@/components/typography/text";
import {
  ButtonLink,
  type ButtonLinkProps,
} from "@/components/ui/button/button-link";
import { HeroBackground } from "./hero-background";

const heroSectionVariants = cva(
  "relative isolate bg-surface-default px-5 py-18 wrap-anywhere tablet:bg-surface-accent-subtle tablet:px-10 tablet:py-24 desktop:px-20 desktop:pt-[84px] desktop:pb-32",
  {
    variants: {
      layout: {
        standard: "",
        section: "desktop:pt-32",
      },
      size: {
        default: "min-h-[489px] tablet:min-h-[740px]",
        compact: "min-h-0",
      },
    },
    defaultVariants: { layout: "standard", size: "default" },
  },
);

type HeroAction = Pick<ButtonLinkProps, "href" | "size" | "showIcon"> & {
  label: string;
};

type HeroSectionProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "title" | "id"
> &
  VariantProps<typeof heroSectionVariants> & {
    id: string;
    eyebrow: ReactNode;
    title: ReactNode;
    headingAs?: "h1" | "h2";
    description?: ReactNode;
    descriptionProps?: Omit<TextProps, "children">;
    descriptionVisibility?: "always" | "tablet";
    contentClassName?: string;
    actions?: readonly HeroAction[];
    actionsClassName?: string;
    background?: ReactNode;
  };

export function HeroSection({
  id,
  eyebrow,
  title,
  headingAs = "h1",
  description,
  descriptionProps,
  descriptionVisibility = "always",
  contentClassName,
  actions = [],
  actionsClassName,
  background = <HeroBackground />,
  layout,
  size,
  className,
  children,
  ...props
}: HeroSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      {...props}
      id={id}
      aria-labelledby={headingId}
      className={cn(heroSectionVariants({ layout, size }), className)}
    >
      {background}
      <Container
        className={cn(
          "relative flex flex-col items-start gap-6",
          layout === "section" && "desktop:gap-8",
          contentClassName,
        )}
      >
        <MonoText variant="eyebrow" className="max-w-[250px] tablet:max-w-none">
          {eyebrow}
        </MonoText>
        <Heading
          as={headingAs}
          id={headingId}
          variant="hero"
          className="w-full"
        >
          {title}
        </Heading>
        {description != null && (
          <Text
            variant="lead"
            tone="black"
            {...descriptionProps}
            className={cn(
              "w-full max-w-[1000px]",
              descriptionVisibility === "tablet" && "hidden tablet:block",
              descriptionProps?.className,
            )}
          >
            {description}
          </Text>
        )}
        {actions.length > 0 && (
          <div
            className={cn(
              "flex max-w-full flex-col items-start gap-[25px] tablet:flex-row tablet:flex-wrap tablet:items-center",
              actionsClassName,
            )}
          >
            {actions.map((action, index) => (
              <ButtonLink
                key={action.href}
                href={action.href}
                variant={index === 0 ? "default" : "outline"}
                size={action.size}
                showIcon={action.showIcon}
              >
                {action.label}
              </ButtonLink>
            ))}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
