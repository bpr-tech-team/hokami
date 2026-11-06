import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { ContactLinks } from "@/components/sections/contact-links/contact-links";
import { getJobCards } from "@/lib/jobs/reader";
import { recruitmentContact } from "../data";
import { JobApplicationForm } from "./job-application-form";

export async function JobApplicationSection({ jobId }: { jobId: string }) {
  const [t, locale] = await Promise.all([
    getTranslations("JobApplication"),
    getLocale(),
  ]);
  const jobs = (await getJobCards(locale)).map(
    ({ id, title, contentLocale }) => ({ id, title, contentLocale }),
  );
  return (
    <Section
      id="job-application"
      title={t("title")}
      description={t("description")}
      layout="split"
      className="bg-surface-accent-subtle"
      headerClassName="gap-8 desktop:gap-8"
      metadata={<ContactLinks contacts={[recruitmentContact]} />}
    >
      <JobApplicationForm key={jobId} jobId={jobId} jobs={jobs} />
    </Section>
  );
}
