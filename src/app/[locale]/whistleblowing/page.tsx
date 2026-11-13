import { LegalPage } from "@/components/pages/legal/legal-page";
import { WhistleblowingForm } from "@/components/pages/whistleblowing/whistleblowing-form";
import { WhistleblowingContent } from "@/content/legal/whistleblowing";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("whistleblowing");
}

export default function WhistleblowingPage() {
  return (
    <LegalPage title="Whistleblowing" afterContent={<WhistleblowingForm />}>
      <WhistleblowingContent />
    </LegalPage>
  );
}
