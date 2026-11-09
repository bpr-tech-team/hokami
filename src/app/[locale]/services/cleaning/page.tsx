import { PageMain } from "@/components/layout/page-main";
import { LocalizedServiceHero } from "@/components/sections/services/detail/localized-service-hero";
import { LocalizedServiceContact } from "@/components/sections/services/detail/localized-service-contact";
import { CleaningContent } from "@/components/sections/services/cleaning/cleaning-content";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("cleaning");
}

export default function CleaningPage() {
  return (
    <PageMain>
      <LocalizedServiceHero
        namespace="Cleaning"
        action="equipment"
        target="equipment"
      />
      <CleaningContent />
      <LocalizedServiceContact namespace="Cleaning" />
    </PageMain>
  );
}
