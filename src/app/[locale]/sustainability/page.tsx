import { PageMain } from "@/components/layout/page-main";
import { SustainabilityContact } from "@/components/sections/sustainability/contact/sustainability-contact";
import { SustainabilityEnergy } from "@/components/sections/sustainability/energy/sustainability-energy";
import { SustainabilityHero } from "@/components/sections/sustainability/hero/sustainability-hero";
import { SustainabilityProduction } from "@/components/sections/sustainability/production/sustainability-production";
import { SustainabilityResponsibility } from "@/components/sections/sustainability/responsibility/sustainability-responsibility";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("sustainability");
}

export default function SustainabilityPage() {
  return (
    <PageMain>
      <SustainabilityHero />
      <SustainabilityEnergy />
      <SustainabilityProduction />
      <SustainabilityResponsibility />
      <SustainabilityContact />
    </PageMain>
  );
}
