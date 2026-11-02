import { getTranslations } from "next-intl/server";
import { ProcessSection } from "@/components/sections/process/process-section";

const stepIds = [
  "documentation",
  "assessment",
  "prototype",
  "production",
] as const;

export async function HomeProcess() {
  const t = await getTranslations("Process");

  return (
    <ProcessSection
      id="process"
      eyebrow={t("eyebrow")}
      title={t("title")}
      steps={stepIds.map((id, index) => ({
        id,
        label: t("step", { number: String(index + 1).padStart(2, "0") }),
        title: t(`steps.${id}.title`),
        description: t(`steps.${id}.description`),
      }))}
    />
  );
}
