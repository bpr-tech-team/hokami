import Image from "next/image";
import { Section } from "@/components/layout/section";
import { ContactLinks } from "@/components/sections/contact-links/contact-links";
import { ButtonLink } from "@/components/ui/button/button-link";

type ContactCtaProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  action: { label: string; href: string };
};

export function ContactCta({
  id,
  eyebrow,
  title,
  description,
  action,
}: ContactCtaProps) {
  return (
    <Section
      id={id}
      eyebrow={eyebrow}
      title={title}
      description={description}
      descriptionTone="secondary"
      descriptionClassName="max-w-copy"
      className="bg-surface-accent-subtle"
      contentClassName="desktop:grid desktop:grid-cols-[minmax(0,1fr)_384px] desktop:items-end desktop:gap-6"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <ButtonLink
          href={action.href}
          size="lg"
          className="w-full"
          icon={
            <Image
              src="/images/about/contact/arrow-right.svg"
              alt=""
              width={20}
              height={20}
              unoptimized
            />
          }
        >
          {action.label}
        </ButtonLink>
        <ContactLinks />
      </div>
    </Section>
  );
}
