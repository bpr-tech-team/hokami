import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { getPathname } from "@/i18n/navigation";
import { Text } from "@/components/typography/text";
import { getJobCards } from "@/lib/jobs/reader";
import { JobCard } from "./job-card";

export async function JobsPositions() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Jobs.positions"),
  ]);
  const jobs = await Promise.all(
    (await getJobCards(locale)).map(async (job) => {
      const contentT = await getTranslations({
        locale: job.contentLocale,
        namespace: "Jobs.positions",
      });
      return {
        ...job,
        linkLabel: job.linkLabel || contentT("readMore", { title: job.title }),
      };
    }),
  );

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
            <li key={id} className="min-w-0">
              <JobCard
                id={id}
                {...job}
                href={getPathname({ locale, href: "/" })}
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
