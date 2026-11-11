import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";
import type { ResolvedJobDetail } from "@/lib/jobs/resolve-detail";

export async function JobHero({ job }: { job: ResolvedJobDetail }) {
  const t = await getTranslations("Jobs.hero");
  return (
    <HeroSection
      id="hero"
      size="compact"
      eyebrow={<span lang={job.contentLocale}>{job.department}</span>}
      title={<span lang={job.contentLocale}>{job.title}</span>}
      description={<span lang={job.contentLocale}>{job.description}</span>}
      descriptionProps={{ tone: "secondary" }}
      actionsClassName="mt-4 w-full desktop:mt-10"
      actions={[
        {
          label: t("resume"),
          href: "#job-application",
          size: "lg",
          className: "w-full tablet:w-auto",
        },
      ]}
    />
  );
}
