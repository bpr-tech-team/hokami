import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const capabilities = [
  { id: "assembly", icon: "/images/capabilities/cpu.svg" },
  { id: "production", icon: "/images/capabilities/layers.svg" },
  { id: "testing", icon: "/images/capabilities/search.svg" },
] as const;

export async function Capabilities() {
  const t = await getTranslations("Capabilities");

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="bg-surface-default px-5 py-18 wrap-anywhere tablet:px-10 tablet:py-24 desktop:px-20 desktop:py-32"
    >
      <div className="mx-auto flex max-w-content flex-col gap-6 desktop:min-h-[538px] desktop:gap-8">
        <p className="font-mono text-xs leading-[1.6] tracking-[0.22em] text-text-accent uppercase">
          {t("eyebrow")}
        </p>
        <h2
          id="capabilities-heading"
          className="font-display text-[32px] leading-[35px] font-semibold tracking-[-0.01em] text-text-primary uppercase tablet:text-[40px] tablet:leading-[42px] desktop:text-[52px] desktop:leading-[53px]"
        >
          {t("title")}
        </h2>
        <p className="text-lg leading-[1.6] text-black desktop:min-h-[87px]">
          {t("description")}
        </p>
        <ul className="grid bg-border-brand-subtle p-px tablet:grid-cols-2 desktop:grid-cols-3 desktop:p-0">
          {capabilities.map(({ id, icon }) => (
            <li key={id} className="min-w-0">
              <Card variant="capability" className="h-full">
                <CardHeader className="flex flex-col gap-[22px] px-0">
                  <Image src={icon} alt="" width={32} height={32} unoptimized />
                  <div className="flex w-full flex-col gap-3.5">
                    <CardTitle className="text-base leading-[19px] font-semibold tracking-[0.06em] uppercase tablet:text-lg tablet:leading-[22px]">
                      <h3>{t(`cards.${id}.title`)}</h3>
                    </CardTitle>
                    <CardDescription className="text-base leading-[1.6] text-text-secondary">
                      <p>{t(`cards.${id}.description`)}</p>
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
