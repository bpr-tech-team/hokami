import { PageMain } from "@/components/layout/page-main";
import { Capabilities } from "@/components/sections/home/capabilities/capabilities";
import { Industries } from "@/components/sections/home/industries/industries";
import { getPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateMetadata() {
  return getPageMetadata("home");
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      legalName: "Hokami CZ s.r.o.",
      url: site.url,
      logo: `${site.url}/web-app-manifest-512x512.png`,
      email: "info@hokami.cz",
      telephone: "+420 482 425 984",
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <PageMain>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Capabilities />
      <Industries />
    </PageMain>
  );
}
