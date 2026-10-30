import { LegalPage } from "@/components/pages/legal/legal-page";
import { WhistleblowingContent } from "@/content/legal/whistleblowing";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("whistleblowing");
}

export default function WhistleblowingPage() {
  return (
    <LegalPage title="Whistleblowing">
      <WhistleblowingContent />
    </LegalPage>
  );
}
