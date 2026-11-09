import { PageMain } from "@/components/layout/page-main";
import { LocalizedServiceHero } from "@/components/sections/services/detail/localized-service-hero";
import { LocalizedServiceContact } from "@/components/sections/services/detail/localized-service-contact";
import { PcbContent } from "@/components/sections/services/pcb/pcb-content";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("pcb");
}

export default function PcbPage() {
  return (
    <PageMain>
      <LocalizedServiceHero
        namespace="Pcb"
        action="possibilities"
        target="specifications"
      />
      <PcbContent />
      <LocalizedServiceContact namespace="Pcb" />
    </PageMain>
  );
}
