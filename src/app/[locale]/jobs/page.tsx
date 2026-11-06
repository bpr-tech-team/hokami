import { PageMain } from "@/components/layout/page-main";
import { JobsHero } from "@/components/sections/jobs/hero/jobs-hero";
import { JobsPositions } from "@/components/sections/jobs/positions/jobs-positions";
import { JobsContact } from "@/components/sections/jobs/contact/jobs-contact";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("careers");
}

export default function JobsPage() {
  return (
    <PageMain>
      <JobsHero />
      <JobsPositions />
      <JobsContact />
    </PageMain>
  );
}
