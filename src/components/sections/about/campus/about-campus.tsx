import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";

const campusCompanies = [
  {
    name: "Cleartex",
    href: "https://cleartex.cz/",
    image: "/images/about/campus/cleartex.png",
    width: 160,
    height: 34,
  },
  {
    name: "Dolicafe",
    href: "https://dolicafe.cz/",
    image: "/images/about/campus/dolicafe.png",
    width: 304,
    height: 75,
  },
  {
    name: "DoodleBeans",
    href: "https://doodlebeans.cz/",
    image: "/images/about/campus/doodlebeans.png",
    width: 775,
    height: 251,
  },
  {
    name: "Dolident",
    href: "https://www.dolident.cz/",
    image: "/images/about/campus/dolident.png",
    width: 157,
    height: 39,
  },
] as const;

export async function AboutCampus() {
  const t = await getTranslations("AboutCampus");

  return (
    <Section
      id="campus"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      descriptionTone="black"
      descriptionClassName="text-base/[1.6]"
      contentClassName="gap-10 desktop:gap-16"
    >
      <ul className="grid grid-cols-1 justify-center justify-items-center gap-x-10 gap-y-8 desktop:grid-cols-[repeat(4,max-content)]">
        {campusCompanies.map(({ name, href, image, width, height }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform duration-200 motion-safe:hover:scale-105"
            >
              <Image
                src={image}
                alt={name}
                width={width}
                height={height}
                className="h-10 w-auto"
                unoptimized
              />
              <span className="sr-only"> ({t("opensInNewTab")})</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
