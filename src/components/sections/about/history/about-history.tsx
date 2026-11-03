import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text";
import { historyMilestones } from "./data";
import { HistoryMilestone } from "./history-milestone";
import { HistoryTimeline } from "./history-timeline";

export async function AboutHistory() {
  const t = await getTranslations("AboutHistory");

  return (
    <Section
      id="history"
      tone="subtle"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionTone="secondary"
      contentClassName="gap-10 desktop:gap-16"
      metadata={
        <Text variant="lead" tone="secondary" className="desktop:text-base">
          {t("invitation")}
        </Text>
      }
    >
      <HistoryTimeline>
        <ol className="mx-auto grid w-full gap-y-3.5 pt-2 pb-2.5 desktop:max-w-[936px] desktop:grid-cols-2 desktop:gap-x-24 desktop:gap-y-10 desktop:pt-[3px] desktop:pb-[53px]">
          {historyMilestones.map(({ id, year }, index) => (
            <HistoryMilestone
              key={id}
              year={year}
              description={t(`milestones.${id}`)}
              index={index}
            />
          ))}
        </ol>
      </HistoryTimeline>
      <Text variant="lead" tone="secondary" className="desktop:text-base">
        {t("conclusion")}
      </Text>
    </Section>
  );
}
