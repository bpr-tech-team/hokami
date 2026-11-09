import { PageMain } from "@/components/layout/page-main";
import { LocalizedServiceHero } from "@/components/sections/services/detail/localized-service-hero";
import { LocalizedServiceContact } from "@/components/sections/services/detail/localized-service-contact";
import { ThtContent } from "@/components/sections/services/tht/tht-content";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("tht");
}

export default function ThtPage() {
  return (
    <PageMain>
      <LocalizedServiceHero
        namespace="Tht"
        action="equipment"
        target="equipment"
      />
      <ThtContent />
      <LocalizedServiceContact namespace="Tht" />
    </PageMain>
  );
}
