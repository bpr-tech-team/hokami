import type { ComponentProps } from "react";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { LocationRegion } from "./types";

type LocationCardProps = Pick<
  ComponentProps<"div">,
  "onPointerEnter" | "onPointerLeave" | "onFocusCapture" | "onBlurCapture"
> & {
  region: LocationRegion;
  active: boolean;
  selected: boolean;
  locationLabel: string;
  onSelect: () => void;
};

export function LocationCard({
  region,
  active,
  selected,
  locationLabel,
  onSelect,
  ...interactions
}: LocationCardProps) {
  return (
    <Card
      variant="location"
      data-region={region.id}
      data-location={region.locationId}
      data-active={active}
      className="h-full"
      {...interactions}
    >
      <CardHeader className="flex flex-col gap-3.5 px-0">
        <MonoText variant="label" tone="tertiary">
          {region.code}
        </MonoText>
        <CardTitle>
          <Heading as="h3" variant="item" className="text-lg leading-[22px]">
            <button
              type="button"
              aria-label={`${region.title} — ${locationLabel}`}
              aria-pressed={selected}
              onClick={onSelect}
              className="cursor-pointer text-left uppercase after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus-ring"
            >
              {region.title}
            </button>
          </Heading>
        </CardTitle>
        <ul className="flex w-full min-w-0 flex-col gap-[9px] font-mono text-[13px] leading-body tracking-[0.04em] text-text-secondary">
          {region.contacts.map(({ label, href }) => (
            <li key={href} className="min-w-0">
              <a
                href={href}
                className="relative z-10 wrap-anywhere underline-offset-4 transition-colors hover:text-text-accent hover:underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </CardHeader>
    </Card>
  );
}
