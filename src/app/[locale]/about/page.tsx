import { PageMain } from "@/components/layout/page-main";
import { AboutHero } from "@/components/sections/about/hero/about-hero";
import { AboutHistory } from "@/components/sections/about/history/about-history";
import { getPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("about");
}

export default function AboutPage() {
  return (
    <PageMain>
      <AboutHero />
      <AboutHistory />
    </PageMain>
  );
}
