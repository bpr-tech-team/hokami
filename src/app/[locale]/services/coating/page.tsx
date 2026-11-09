import { PageMain } from "@/components/layout/page-main";
import { LocalizedServiceHero } from "@/components/sections/services/detail/localized-service-hero";
import { LocalizedServiceContact } from "@/components/sections/services/detail/localized-service-contact";
import { CoatingContent } from "@/components/sections/services/coating/coating-content";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("coating");
}

export default function CoatingPage() {
  return (
    <PageMain>
      <LocalizedServiceHero
        namespace="Coating"
        action="equipment"
        target="equipment"
      />
      <CoatingContent />
      <LocalizedServiceContact namespace="Coating" />
    </PageMain>
  );
}
