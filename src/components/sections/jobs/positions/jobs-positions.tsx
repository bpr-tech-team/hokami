import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { getPathname } from "@/i18n/navigation";
import { jobs } from "../data";
import { JobCard } from "./job-card";

export async function JobsPositions() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Jobs.positions"),
  ]);

  return (
    <Section
      id="positions"
      eyebrow={t("eyebrow")}
      title={t("title")}
      contentClassName="gap-10 tablet:gap-12 desktop:gap-16"
    >
      <ul className="grid min-w-0 grid-cols-1 gap-4 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3">
        {jobs.map(({ id, href }) => (
          <li key={id} className="min-w-0">
            <JobCard
              id={id}
              href={getPathname({ locale, href })}
              department={t(`items.${id}.department`)}
              title={t(`items.${id}.title`)}
              description={t(`items.${id}.description`)}
              linkLabel={t(`items.${id}.link`)}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
