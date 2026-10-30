import Image from "next/image";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CapabilityCardProps = {
  icon: string;
  title: string;
  description: string;
};

export function CapabilityCard({
  icon,
  title,
  description,
}: CapabilityCardProps) {
  return (
    <Card variant="capability" className="h-full">
      <CardHeader className="flex flex-col gap-[22px] px-0">
        <Image src={icon} alt="" width={32} height={32} unoptimized />
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
