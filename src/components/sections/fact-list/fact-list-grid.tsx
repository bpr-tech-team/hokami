import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FactList } from "./fact-list";

export type FactListGridItem = { id: string; content: ReactNode };

export type FactListGridGroup = {
  id: string;
  /** Matching positions share a row; null leaves an optional heading slot empty. */
  header?: readonly ReactNode[];
  items?: readonly FactListGridItem[];
  /** Prose occupies the remaining rows without inflating one neighboring list item. */
  after?: ReactNode;
};

type Columns = 1 | 2 | 3;
type FactListGridProps = {
  columns?: Columns;
  tabletColumns?: Columns;
  decoration?: "checks" | "none";
  className?: string;
} & (
  | { items: readonly FactListGridItem[]; groups?: never }
  | { groups: readonly FactListGridGroup[]; items?: never }
);

function columnClasses(tablet: number, desktop: number) {
  return cn(
    "grid-cols-1",
    tablet === 2 && "tablet:grid-cols-2",
    tablet === 3 && "tablet:grid-cols-3",
    desktop === 2 && "desktop:grid-cols-2",
    desktop === 3 && "desktop:grid-cols-3",
  );
}

function renderItems(items: readonly FactListGridItem[]) {
  return items.map((item) => (
    <li key={item.id} data-fact-list-item={item.id} className="min-w-0">
      {item.content}
    </li>
  ));
}

function groupSpan(
  groups: readonly FactListGridGroup[],
  index: number,
  columns: number,
  headerRows: number,
) {
  const start = Math.floor(index / columns) * columns;
  return (
    headerRows +
    Math.max(
      1,
      ...groups
        .slice(start, start + columns)
        .map(
          (group) => (group.items?.length ?? 0) + Number(Boolean(group.after)),
        ),
    )
  );
}

export function FactListGrid({
  items,
  groups: suppliedGroups,
  columns = 1,
  tabletColumns = 1,
  decoration = "checks",
  className,
}: FactListGridProps) {
  const ListFrame = decoration === "checks" ? FactList : "div";
  if (items) {
    if (!items.length) return null;
    const desktopCount = Math.min(columns, items.length);
    const tabletCount = Math.min(tabletColumns, desktopCount);
    const style: CSSProperties & Record<`--fact-${string}`, number> = {
      "--fact-tablet-rows": Math.ceil(items.length / tabletCount),
      "--fact-desktop-rows": Math.ceil(items.length / desktopCount),
    };
    return (
      <ListFrame>
        <ul
          data-fact-list-grid=""
          style={style}
          className={cn(
            "m-0 min-w-0 list-none gap-x-6 p-0 desktop:grid desktop:grid-flow-col desktop:grid-rows-[repeat(var(--fact-desktop-rows),auto)]",
            tabletCount > 1 &&
              "tablet:grid tablet:grid-flow-col tablet:grid-rows-[repeat(var(--fact-tablet-rows),auto)]",
            columnClasses(tabletCount, desktopCount),
            className,
          )}
        >
          {renderItems(items)}
        </ul>
      </ListFrame>
    );
  }

  const groups = suppliedGroups;
  if (!groups.length) return null;

  const desktopCount = Math.min(columns, groups.length);
  const tabletCount = Math.min(tabletColumns, desktopCount);
  const headerRows = Math.max(
    0,
    ...groups.map((group) => group.header?.length ?? 0),
  );
  const hasItems = groups.some((group) => group.items?.length);

  return (
    <div
      data-fact-list-grid=""
      className={cn(
        "grid min-w-0 gap-6",
        columnClasses(tabletCount, desktopCount),
        className,
      )}
    >
      {groups.map((group, index) => {
        const itemCount = group.items?.length ?? 0;
        const style: CSSProperties & Record<`--fact-${string}`, number> = {
          "--fact-tablet-span": groupSpan(
            groups,
            index,
            tabletCount,
            headerRows,
          ),
          "--fact-desktop-span": groupSpan(
            groups,
            index,
            desktopCount,
            headerRows,
          ),
          "--fact-list-start": headerRows + 1,
          "--fact-list-rows": itemCount,
          "--fact-after-start": headerRows + itemCount + 1,
        };

        return (
          <div
            key={group.id}
            data-fact-list-group={group.id}
            style={style}
            className={cn(
              "min-w-0 desktop:row-span-(--fact-desktop-span) desktop:grid desktop:grid-rows-subgrid desktop:gap-y-0",
              tabletCount > 1 &&
                "tablet:row-span-(--fact-tablet-span) tablet:grid tablet:grid-rows-subgrid tablet:gap-y-0",
            )}
          >
            {group.header?.map((content, headerIndex) =>
              content ? (
                <div
                  key={headerIndex}
                  data-slot="fact-list-header"
                  style={{ gridRow: headerIndex + 1 }}
                  className="min-w-0 pb-4 [&>:first-child]:mt-0 [&>:last-child]:mb-0"
                >
                  {content}
                </div>
              ) : null,
            )}
            {itemCount > 0 && (
              <ListFrame
                className={cn(
                  "min-w-0 desktop:row-span-(--fact-list-rows) desktop:row-start-(--fact-list-start) desktop:grid desktop:grid-rows-subgrid desktop:gap-y-0",
                  tabletCount > 1 &&
                    "tablet:row-span-(--fact-list-rows) tablet:row-start-(--fact-list-start) tablet:grid tablet:grid-rows-subgrid tablet:gap-y-0",
                )}
              >
                <ul
                  className={cn(
                    "m-0 list-none p-0 desktop:row-span-full desktop:grid desktop:grid-rows-subgrid desktop:gap-y-0",
                    tabletCount > 1 &&
                      "tablet:row-span-full tablet:grid tablet:grid-rows-subgrid tablet:gap-y-0",
                  )}
                >
                  {renderItems(group.items ?? [])}
                </ul>
              </ListFrame>
            )}
            {group.after && (
              <div
                data-slot="fact-list-after"
                className={cn(
                  "flex min-w-0 flex-col gap-4 self-start desktop:row-start-(--fact-after-start) desktop:-row-end-1",
                  tabletCount > 1 &&
                    "tablet:row-start-(--fact-after-start) tablet:-row-end-1",
                  itemCount > 0 ? "mt-4" : hasItems && "pt-3",
                )}
              >
                {group.after}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
