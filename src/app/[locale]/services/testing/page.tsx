import { PageMain } from "@/components/layout/page-main";
import { LocalizedServiceHero } from "@/components/sections/services/detail/localized-service-hero";
import { LocalizedServiceContact } from "@/components/sections/services/detail/localized-service-contact";
import { TestingContent } from "@/components/sections/services/testing/testing-content";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("testing");
}

export default function TestingPage() {
  return (
    <PageMain>
      <LocalizedServiceHero
        namespace="Testing"
        action="checks"
        target="checks"
      />
      <TestingContent />
      <LocalizedServiceContact namespace="Testing" />
    </PageMain>
  );
}
