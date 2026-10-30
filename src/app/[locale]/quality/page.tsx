import { InfoPage } from "@/components/info-page";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("quality");
}

export default function QualityPage() {
  return <InfoPage page="quality" />;
}
