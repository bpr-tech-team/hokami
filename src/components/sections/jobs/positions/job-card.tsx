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
  href: string;
};

export function JobCard({
  id,
  department,
  title,
  description,
  linkLabel,
  href,
}: JobCardProps) {
  const titleId = `job-${id}-title`;
  const departmentId = `job-${id}-department`;

  return (
    <a
      href={href}
      aria-labelledby={`${titleId} ${departmentId}`}
      className="group/card-link block h-full min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <Card variant="outlined" className="h-full">
        <CardContent className="flex min-w-0 flex-col items-start gap-3 px-6 pt-6 pb-4">
          <MonoText id={departmentId} variant="meta" tone="tertiary">
            {department}
          </MonoText>
          <Heading as="h3" id={titleId} variant="item">
            {title}
          </Heading>
          <Text variant="small" tone="secondary">
            {description}
          </Text>
          <CardLinkLabel>{linkLabel}</CardLinkLabel>
        </CardContent>
      </Card>
    </a>
  );
}
