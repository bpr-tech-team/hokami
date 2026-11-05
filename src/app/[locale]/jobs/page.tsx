import { PageMain } from "@/components/layout/page-main";
import { JobsHero } from "@/components/sections/jobs/hero/jobs-hero";
import { JobsPositions } from "@/components/sections/jobs/positions/jobs-positions";
import { JobsContact } from "@/components/sections/jobs/contact/jobs-contact";
import { CompanyVideo } from "@/components/sections/video/company-video";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("careers");
}

export default function JobsPage() {
  return (
    <PageMain>
      <JobsHero />
      <CompanyVideo />
      <JobsPositions />
      <JobsContact />
    </PageMain>
  );
}
