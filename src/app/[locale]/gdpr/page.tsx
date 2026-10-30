import { LegalPage } from "@/components/legal-page";
import { GdprContent } from "@/content/legal/gdpr";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("gdpr");
}

export default function GdprPage() {
  return (
    <LegalPage title="GDPR">
      <GdprContent />
    </LegalPage>
  );
}
