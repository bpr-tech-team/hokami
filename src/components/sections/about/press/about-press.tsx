import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { pressArticles, pressPublishers } from "./data";
import { PressCard } from "./press-card";

export async function AboutPress() {
  if (pressArticles.length === 0) return null;

  const t = await getTranslations("AboutPress");

  return (
    <Section
      id="press"
      tone="subtle"
      eyebrow={t("eyebrow")}
      title={t("title")}
      contentClassName="gap-10 tablet:gap-12 desktop:gap-16"
    >
      <ul className="grid min-w-0 grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {pressArticles.map(({ id, publisherId, href }) => (
          <li key={id} className="min-w-0">
            <PressCard
              id={id}
              href={href}
              publisher={pressPublishers[publisherId]}
              title={t(`articles.${id}`)}
              linkLabel={t(`publishers.${publisherId}`)}
              opensInNewTab={t("opensInNewTab")}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
