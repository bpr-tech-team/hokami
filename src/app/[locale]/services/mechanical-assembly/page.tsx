import { PageMain } from "@/components/layout/page-main";
import { LocalizedServiceHero } from "@/components/sections/services/detail/localized-service-hero";
import { LocalizedServiceContact } from "@/components/sections/services/detail/localized-service-contact";
import { MechanicalAssemblyContent } from "@/components/sections/services/mechanical-assembly/mechanical-assembly-content";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("mechanicalAssembly");
}

export default function MechanicalAssemblyPage() {
  return (
    <PageMain>
      <LocalizedServiceHero
        namespace="MechanicalAssembly"
        action="includedServices"
        target="included-services"
      />
      <MechanicalAssemblyContent />
      <LocalizedServiceContact namespace="MechanicalAssembly" />
    </PageMain>
  );
}
