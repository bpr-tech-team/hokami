import { cn } from "@/lib/utils";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

// Contacts follow the original left/right/right/left trace, independently of
// which side holds the card. Mobile leaders alternate between bottom and top.
const contactLayouts = [
  "left-[6px] desktop:left-[calc(100%+24px)]",
  "left-[54px] desktop:-left-6",
  "left-[54px] desktop:left-[calc(100%+72px)]",
  "left-[6px] desktop:-left-18",
] as const;

const leaderLayouts = [
  "left-2.5 w-15 desktop:left-full desktop:w-5",
  "left-[58px] w-3 desktop:-left-5 desktop:w-5",
  "left-[58px] w-3 desktop:left-full desktop:w-[68px]",
  "left-2.5 w-15 desktop:-left-[68px] desktop:w-[68px]",
] as const;

type HistoryMilestoneProps = {
  year: string;
  description: string;
  index: number;
};

export function HistoryMilestone({
  year,
  description,
  index,
}: HistoryMilestoneProps) {
  const tracePosition = index % contactLayouts.length;

  return (
    <li className="relative min-w-0 self-start pl-[70px] desktop:pl-0 desktop:even:translate-y-12">
      <div
        data-history-card=""
        className={cn(
          "flex min-h-[69px] flex-col gap-1 border-l border-brand-identity bg-white/50 px-4 py-3 desktop:min-h-18",
          index % 2 === 0 &&
            "desktop:border-r desktop:border-l-0 desktop:text-right",
        )}
      >
        <Heading as="h3" variant="item" className="text-text-accent">
          <time dateTime={year}>{year}</time>
        </Heading>
        <Text
          variant="small"
          tone="secondary"
          className="leading-[22px] desktop:leading-small"
        >
          {description}
        </Text>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 h-0 w-full desktop:top-[calc(50%+1px)]",
          index % 2 === 0 ? "top-[calc(100%-18px)]" : "top-4",
        )}
      >
        <span
          className={cn(
            "absolute top-0 h-px bg-border-strong/50",
            leaderLayouts[tracePosition],
          )}
        />
        <span
          data-history-contact=""
          className={cn(
            "absolute top-0 size-[9px] -translate-1/2 rounded-full border border-brand-identity bg-surface-default",
            contactLayouts[tracePosition],
          )}
        />
      </span>
    </li>
  );
}
