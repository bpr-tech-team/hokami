import { PageMain } from "@/components/layout/page-main";
import { AboutCampus } from "@/components/sections/about/campus/about-campus";
import { AboutContact } from "@/components/sections/about/contact/about-contact";
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
      <AboutCampus />
      <AboutHistory />
      <AboutContact />
    </PageMain>
  );
}
