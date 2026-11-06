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
  "relative isolate bg-surface-default px-5 py-18 wrap-anywhere tablet:bg-surface-accent-subtle tablet:px-10 tablet:py-24 desktop:px-20 desktop:pt-[84px] desktop:pb-24",
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

type HeroAction = Pick<
  ButtonLinkProps,
  "href" | "size" | "showIcon" | "icon" | "className"
> & {
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
    headingClassName?: string;
    backLink?: { label: string; href: string };
    description?: ReactNode;
    descriptionProps?: Omit<TextProps, "children">;
    descriptionVisibility?: "always" | "tablet";
    contentClassName?: string;
    actions?: readonly HeroAction[];
    actionsClassName?: string;
    background?: ReactNode;
    media?: ReactNode;
  };

export function HeroSection({
  id,
  eyebrow,
  title,
  headingAs = "h1",
  headingClassName,
  backLink,
  description,
  descriptionProps,
  descriptionVisibility = "always",
  contentClassName,
  actions = [],
  actionsClassName,
  background = <HeroBackground />,
  media,
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
      className={cn(
        heroSectionVariants({ layout, size }),
        media && "pb-0 tablet:pb-0 desktop:pb-0",
        className,
      )}
    >
      {background}
      <Container
        className={cn(
          "relative flex flex-col items-start gap-6",
          layout === "section" && "desktop:gap-8",
          contentClassName,
        )}
      >
        {backLink && (
          <a
            href={backLink.href}
            className="relative inline-flex min-h-11 max-w-full items-center py-3 text-text-accent after:absolute after:bottom-[6.5px] after:left-0 after:h-[1.5px] after:w-[5%] after:bg-current after:transition-[width] after:duration-250 hover:text-text-accent-hover hover:after:w-full focus-visible:after:w-full"
          >
            <MonoText as="span">{backLink.label}</MonoText>
          </a>
        )}
        <MonoText variant="eyebrow" className="max-w-[250px] tablet:max-w-none">
          {eyebrow}
        </MonoText>
        <Heading
          as={headingAs}
          id={headingId}
          variant="hero"
          className={cn("w-full", headingClassName)}
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
                icon={action.icon}
                className={action.className}
              >
                {action.label}
              </ButtonLink>
            ))}
          </div>
        )}
        {children}
      </Container>
      {media && (
        <div className="relative -mx-5 py-10 tablet:-mx-10 tablet:py-12 desktop:-mx-20">
          {media}
        </div>
      )}
    </section>
  );
}
