import { getLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { ContactLinks } from "@/components/sections/contact-links/contact-links";
import { publicFormsEnabled } from "@/lib/forms/availability";
import { getPublicFormHref } from "@/lib/forms/navigation";
import type { ResolvedJobDetail } from "@/lib/jobs/resolve-detail";
import { recruitmentContact } from "../data";

export async function JobHero({ job }: { job: ResolvedJobDetail }) {
  const [locale, t, contact] = await Promise.all([
    getLocale(),
    getTranslations("Jobs.hero"),
    getTranslations("ContactHero"),
  ]);
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
          label: publicFormsEnabled ? t("resume") : contact("contact"),
          href: getPublicFormHref(
            locale,
            `/jobs/${job.id}#job-application`,
            `/jobs/${job.id}`,
          ),
          size: "lg",
          className: "w-full tablet:w-auto",
        },
      ]}
    >
      {!publicFormsEnabled && <ContactLinks contacts={[recruitmentContact]} />}
    </HeroSection>
  );
}
