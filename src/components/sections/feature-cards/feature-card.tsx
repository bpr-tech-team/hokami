import Image from "next/image";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type FeatureCardProps = {
  icon?: string;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card variant="feature" className="h-full">
      <CardHeader className="flex flex-col gap-[22px] px-0">
        {icon && <Image src={icon} alt="" width={32} height={32} unoptimized />}
        <div className="flex w-full flex-col gap-3.5">
          <CardTitle>
            <Heading as="h3" variant="item">
              {title}
            </Heading>
          </CardTitle>
          <CardDescription>
            <Text tone="secondary">{description}</Text>
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
