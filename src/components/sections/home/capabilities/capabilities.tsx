import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { CapabilityCard } from "./capability-card";

const capabilities = [
  { id: "assembly", icon: "/images/capabilities/cpu.svg" },
  { id: "production", icon: "/images/capabilities/layers.svg" },
  { id: "testing", icon: "/images/capabilities/search.svg" },
] as const;

export async function Capabilities() {
  const t = await getTranslations("Capabilities");

  return (
    <Section
      id="capabilities"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionTone="black"
      descriptionClassName="desktop:min-h-[87px]"
      contentClassName="desktop:min-h-[538px]"
    >
      <ul className="grid bg-border-brand-subtle p-px tablet:grid-cols-2 desktop:grid-cols-3 desktop:p-0">
        {capabilities.map(({ id, icon }) => (
          <li key={id} className="min-w-0">
            <CapabilityCard
              icon={icon}
              title={t(`cards.${id}.title`)}
              description={t(`cards.${id}.description`)}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
