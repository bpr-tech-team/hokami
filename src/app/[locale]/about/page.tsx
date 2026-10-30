import { InfoPage } from "@/components/info-page";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("about");
}

export default function AboutPage() {
  return <InfoPage page="about" />;
}
