import Image from "next/image";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Card, CardContent } from "@/components/ui/card";
import { CardLinkLabel } from "@/components/ui/card-link-label";
import type { PressPublisher } from "./data";

type PressCardProps = {
  id: string;
  href: string;
  publisher: PressPublisher;
  title: string;
  linkLabel: string;
  opensInNewTab: string;
};

export function PressCard({
  id,
  href,
  publisher,
  title,
  linkLabel,
  opensInNewTab,
}: PressCardProps) {
  const titleId = `press-${id}-title`;
  const publisherId = `press-${id}-publisher`;
  const announcementId = `press-${id}-new-tab`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-labelledby={`${titleId} ${publisherId}`}
      aria-describedby={announcementId}
      className="group/card-link block h-full min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <Card variant="outlined" className="h-full">
        <Image
          src={publisher.logo}
          alt=""
          width={publisher.width}
          height={publisher.height}
          loading="lazy"
          unoptimized
          className="h-[216px] w-full shrink-0 object-contain"
        />
        <CardContent className="flex min-w-0 flex-col items-start gap-3 px-6 pt-6 pb-4 tablet:flex-1">
          <MonoText id={publisherId} variant="meta" tone="tertiary">
            {publisher.name}
          </MonoText>
          <Heading id={titleId} as="h3" variant="item">
            {title}
          </Heading>
          <CardLinkLabel className="tablet:mt-auto">{linkLabel}</CardLinkLabel>
          <span id={announcementId} className="sr-only">
            {opensInNewTab}
          </span>
        </CardContent>
      </Card>
    </a>
  );
}
