import { PageMain } from "@/components/layout/page-main";
import { SmtHero } from "@/components/sections/services/smt/smt-hero";
import { SmtStatistics } from "@/components/sections/services/smt/smt-statistics";
import { SmtProduction } from "@/components/sections/services/smt/smt-production";
import { SmtEquipment } from "@/components/sections/services/smt/smt-equipment";
import { SmtContact } from "@/components/sections/services/smt/smt-contact";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("smt");
}

export default function SmtPage() {
  return (
    <PageMain>
      <SmtHero />
      <SmtStatistics />
      <SmtProduction />
      <SmtEquipment />
      <SmtContact />
    </PageMain>
  );
}
