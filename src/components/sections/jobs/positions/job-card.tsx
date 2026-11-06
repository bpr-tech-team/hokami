import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import { Card, CardContent } from "@/components/ui/card";
import { CardLinkLabel } from "@/components/ui/card-link-label";

type JobCardProps = {
  id: string;
  department: string;
  title: string;
  description: string;
  linkLabel: string;
  linkLocale: string;
  href: string;
  contentLocale: string;
};

export function JobCard({
  id,
  department,
  title,
  description,
  linkLabel,
  linkLocale,
  href,
  contentLocale,
}: JobCardProps) {
  const titleId = `job-${id}-title`;
  const departmentId = `job-${id}-department`;

  return (
    <a
      href={href}
      lang={contentLocale}
      aria-labelledby={`${titleId} ${departmentId}`}
      className="group/card-link row-span-4 grid min-w-0 grid-rows-subgrid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <Card
        variant="outlined"
        className="row-span-4 grid grid-rows-subgrid items-start justify-items-start gap-3 px-6 pt-6 pb-4"
      >
        <CardContent className="contents">
          <MonoText id={departmentId} variant="meta" tone="tertiary">
            {department}
          </MonoText>
          <Heading as="h3" id={titleId} variant="item">
            {title}
          </Heading>
          <Text variant="small" tone="secondary">
            {description}
          </Text>
          <CardLinkLabel lang={linkLocale}>{linkLabel}</CardLinkLabel>
        </CardContent>
      </Card>
    </a>
  );
}
