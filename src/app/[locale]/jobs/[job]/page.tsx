import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { PageMain } from "@/components/layout/page-main";
import { LegacyFormRedirect } from "@/components/navigation/legacy-form-redirect";
import { publicFormsEnabled } from "@/lib/forms/availability";
import { JobHero } from "@/components/sections/jobs/detail/job-hero";
import { JobContent } from "@/components/sections/jobs/detail/job-content";
import { JobApplicationSection } from "@/components/sections/jobs/application/job-application-section";
import { getJobDetail, getJobLanguages } from "@/lib/jobs/reader";
import { getJobAlternates, getJobUrl } from "@/lib/jobs/urls";
import { createPageMetadata } from "@/lib/seo";

// Visibility is resolved before rendering; known jobs are still prerendered.
export const instant = false;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const jobs = Object.entries(await getJobLanguages())
    .filter(([, locales]) => locales.some((locale) => locale === params.locale))
    .map(([job]) => ({ job }));
  return jobs.length ? jobs : [{ job: "__empty__" }];
}

async function getPageJob(params: PageProps<"/[locale]/jobs/[job]">["params"]) {
  const [{ job: slug }, locale] = await Promise.all([params, getLocale()]);
  const job = await getJobDetail(slug, locale);
  if (!job) notFound();
  return { job, locale };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/jobs/[job]">) {
  const { job, locale } = await getPageJob(params);
  return createPageMetadata({
    title: job.title,
    description: job.description,
    url: getJobUrl(job.id, locale),
    locale,
    locales: job.visibleLocales,
    languages: getJobAlternates(job.id, job.visibleLocales),
  });
}

export default async function JobPage({
  params,
}: PageProps<"/[locale]/jobs/[job]">) {
  const { job, locale } = await getPageJob(params);
  return (
    <PageMain>
      <JobHero job={job} />
      <JobContent body={job.body} locale={job.bodyLocale} />
      {publicFormsEnabled ? (
        <JobApplicationSection jobId={job.id} />
      ) : (
        <LegacyFormRedirect
          locale={locale}
          formHref={`/jobs/${job.id}#job-application`}
        />
      )}
    </PageMain>
  );
}
