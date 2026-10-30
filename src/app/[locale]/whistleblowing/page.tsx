import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { WhistleblowingContent } from "@/content/legal/whistleblowing";

export const metadata: Metadata = {
  title: "Whistleblowing | HOKAMI",
};

export default function WhistleblowingPage() {
  return (
    <LegalPage title="Whistleblowing">
      <WhistleblowingContent />
    </LegalPage>
  );
}
