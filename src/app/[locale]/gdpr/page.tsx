import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { GdprContent } from "@/content/legal/gdpr";

export const metadata: Metadata = {
  title: "GDPR | HOKAMI",
};

export default function GdprPage() {
  return (
    <LegalPage title="GDPR">
      <GdprContent />
    </LegalPage>
  );
}
