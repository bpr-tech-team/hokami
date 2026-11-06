import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { getPathname } from "@/i18n/navigation";
import { Text } from "@/components/typography/text";
import { getJobCards } from "@/lib/jobs/reader";
import { JobCard } from "./job-card";
import { getJobPath } from "@/lib/jobs/urls";

export async function JobsPositions() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Jobs.positions"),
  ]);
  const jobs = await getJobCards(locale);

  return (
    <Section
      id="positions"
      eyebrow={t("eyebrow")}
      title={t("title")}
      contentClassName="gap-10 tablet:gap-12 desktop:gap-16"
    >
      {jobs.length > 0 ? (
        <ul className="grid min-w-0 grid-cols-1 gap-4 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3">
          {jobs.map(({ id, ...job }) => (
            <li key={id} className="row-span-4 grid min-w-0 grid-rows-subgrid">
              <JobCard
                id={id}
                {...job}
                linkLabel={t("readMore")}
                linkLocale={locale}
                href={getPathname({ locale, href: getJobPath(id) })}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Text tone="secondary">{t("empty")}</Text>
      )}
    </Section>
  );
}
