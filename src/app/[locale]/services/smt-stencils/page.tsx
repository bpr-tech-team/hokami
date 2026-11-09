import { PageMain } from "@/components/layout/page-main";
import { LocalizedServiceHero } from "@/components/sections/services/detail/localized-service-hero";
import { LocalizedServiceContact } from "@/components/sections/services/detail/localized-service-contact";
import { SmtStencilsContent } from "@/components/sections/services/smt-stencils/smt-stencils-content";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("smtStencils");
}

export default function SmtStencilsPage() {
  return (
    <PageMain>
      <LocalizedServiceHero
        namespace="SmtStencils"
        action="possibilities"
        target="specifications"
      />
      <SmtStencilsContent />
      <LocalizedServiceContact namespace="SmtStencils" />
    </PageMain>
  );
}
