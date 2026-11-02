import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "cn";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import { ButtonLink } from "@/components/ui/button/button-link";
import { HeroBackground } from "./hero-background";

type HeroAction = {
  label: string;
  href: string;
};

type HeroSectionProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "title" | "id"
> & {
  id: string;
  eyebrow: ReactNode;
  title: ReactNode;
  headingAs?: "h1" | "h2";
  description?: ReactNode;
  descriptionVisibility?: "always" | "tablet";
  actions?: readonly HeroAction[];
  background?: ReactNode;
};

export function HeroSection({
  id,
  eyebrow,
  title,
  headingAs = "h1",
  description,
  descriptionVisibility = "always",
  actions = [],
  background = <HeroBackground />,
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
        "relative isolate min-h-[489px] bg-surface-default px-5 py-18 wrap-anywhere tablet:min-h-[740px] tablet:bg-surface-accent-subtle tablet:px-10 tablet:py-24 desktop:px-20 desktop:pt-[84px] desktop:pb-32",
        className,
      )}
    >
      {background}
      <Container className="relative flex flex-col items-start gap-6">
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
            variant="quote"
            tone="black"
            className={cn(
              "max-w-[1000px]",
              descriptionVisibility === "tablet" && "hidden tablet:block",
            )}
          >
            {description}
          </Text>
        )}
        {actions.length > 0 && (
          <div className="flex max-w-full flex-col items-start gap-[25px] tablet:flex-row tablet:flex-wrap tablet:items-center">
            {actions.map((action, index) => (
              <ButtonLink
                key={action.href}
                href={action.href}
                variant={index === 0 ? "default" : "outline"}
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
