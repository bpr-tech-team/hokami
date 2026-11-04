import { PageMain } from "@/components/layout/page-main";
import { ServicesHero } from "@/components/sections/services/hero/services-hero";
import { ServicesOverview } from "@/components/sections/services/overview/services-overview";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("services");
}

export default function ServicesPage() {
  return (
    <PageMain>
      <ServicesHero />
      <ServicesOverview />
    </PageMain>
  );
}
