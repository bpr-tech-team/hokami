import { PageMain } from "@/components/layout/page-main";
import { AboutAwards } from "@/components/sections/about/awards/about-awards";
import { AboutCampus } from "@/components/sections/about/campus/about-campus";
import { AboutContact } from "@/components/sections/about/contact/about-contact";
import { AboutDocuments } from "@/components/sections/about/documents/about-documents";
import { AboutHero } from "@/components/sections/about/hero/about-hero";
import { AboutHistory } from "@/components/sections/about/history/about-history";
import { AboutPress } from "@/components/sections/about/press/about-press";
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
      <AboutAwards />
      <AboutPress />
      <AboutDocuments />
      <AboutContact />
    </PageMain>
  );
}
