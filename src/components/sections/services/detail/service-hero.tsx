import Image from "next/image";
import { HeroSection } from "@/components/sections/hero/hero-section";

type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  backLink: { label: string; href: string };
  action: { label: string; href: string };
};

export function ServiceHero({
  eyebrow,
  title,
  description,
  backLink,
  action,
}: ServiceHeroProps) {
  return (
    <HeroSection
      id="hero"
      layout="section"
      size="compact"
      eyebrow={eyebrow}
      title={title}
      headingClassName="leading-[42px] tablet:leading-[58px] desktop:leading-[100px]"
      backLink={backLink}
      description={description}
      descriptionProps={{
        variant: "lead",
        tone: "secondary",
        className: "max-w-copy",
      }}
      actions={[
        {
          ...action,
          size: "lg",
          className: "w-full tablet:w-auto",
          icon: (
            <Image
              src="/images/services/arrow-right.svg"
              alt=""
              width={20}
              height={20}
              unoptimized
            />
          ),
        },
      ]}
      actionsClassName="mt-4 w-full desktop:mt-8"
    />
  );
}
