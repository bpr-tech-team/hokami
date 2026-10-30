import { InfoPage } from "@/components/pages/info-page";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("careers");
}

export default function CareersPage() {
  return <InfoPage page="careers" />;
}
