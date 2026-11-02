"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "cn";
import { Heading } from "@/components/typography/heading";
import { MonoText } from "@/components/typography/mono-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMotionVisibility } from "@/hooks/use-motion-visibility";
import { LocationArtwork } from "./location-artwork";
import { LocationCard } from "./location-card";
import { LocationDot } from "./location-dot";
import { calloutLayouts, pointPositions } from "./map-layout";
import type { LocationId } from "./data";
import type { Location, LocationRegion } from "./types";

export function LocationExplorer({
  locations,
  regions,
  label,
}: {
  locations: readonly Location[];
  regions: readonly LocationRegion[];
  label: string;
}) {
  const motionRef = useRef<HTMLDivElement>(null);
  const points = useRef<Partial<Record<LocationId, HTMLElement | null>>>({});
  const [hoveredId, setHoveredId] = useState<LocationId | null>(null);
  const [focusedId, setFocusedId] = useState<LocationId | null>(null);
  const [selectedId, setSelectedId] = useState<LocationId | null>(null);
  const [tapInput, setTapInput] = useState(false);
  const previewId = hoveredId ?? focusedId;
  const activeId = previewId ?? selectedId;
  useMotionVisibility(motionRef);

  function toggleLocation(id: LocationId) {
    setSelectedId((current) => (current === id ? null : id));
  }

  function clearLocation() {
    setHoveredId(null);
    setFocusedId(null);
    setSelectedId(null);
  }

  function hoverLocation(id: LocationId) {
    return {
      onPointerEnter(event: PointerEvent<HTMLElement>) {
        if (event.pointerType === "mouse") {
          setTapInput(false);
          setHoveredId(id);
        }
      },
      onPointerLeave() {
        setHoveredId((current) => (current === id ? null : current));
      },
    };
  }

  function control(
    location: Location,
    view: "legend" | "map",
    children?: ReactNode,
  ) {
    const button = (
      <button
        type="button"
        ref={
          view === "map"
            ? (element) => {
                points.current[location.id] = element;
              }
            : undefined
        }
        data-location={location.id}
        data-view={view}
        data-active={activeId === location.id}
        aria-label={
          view === "map"
            ? `${location.city} (${location.country}) — ${location.meta}`
            : undefined
        }
        aria-pressed={selectedId === location.id}
        onClick={() => toggleLocation(location.id)}
        {...hoverLocation(location.id)}
        className={cn(
          "cursor-pointer transition-[background-color,border-color] duration-250",
          view === "map"
            ? cn(
                "absolute left-0 z-10 w-10 -translate-1/2 rounded-none bg-transparent",
                calloutLayouts[location.id].hit,
              )
            : cn(
                "flex min-h-[82px] w-full items-center gap-4 border px-[18px] py-4 text-left",
                activeId === location.id
                  ? "border-border-brand-subtle bg-surface-raised"
                  : "border-transparent bg-transparent",
              ),
        )}
      >
        {children}
      </button>
    );

    if (view === "legend") return button;

    return (
      <Tooltip
        open={!tapInput && previewId === location.id}
        onOpenChange={(open, details) => {
          if (!open && details.reason === "escape-key") clearLocation();
        }}
      >
        <TooltipTrigger render={button} delay={0} closeOnClick={false} />
        <TooltipContent
          variant="map"
          anchor={() => points.current[location.id] ?? null}
          side={location.tooltipSide ?? "top"}
          sideOffset={14}
          className="hidden desktop:flex"
        >
          <MonoText
            as="span"
            variant="meta"
            tone="secondary"
            className="text-text-primary"
          >
            {location.city} ({location.country})
          </MonoText>
          <MonoText as="span" variant="meta" tone="tertiary">
            {location.meta}
          </MonoText>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <TooltipProvider delay={0}>
      <div
        role="group"
        aria-label={label}
        data-slot="location-explorer"
        data-active-location={activeId ?? "none"}
        onPointerDownCapture={(event) => {
          const tap =
            event.pointerType !== "mouse" ||
            !window.matchMedia("(min-width: 67.5rem) and (hover: hover)")
              .matches;
          setTapInput(tap);
          if (tap) {
            setHoveredId(null);
            setFocusedId(null);
          }
        }}
        onFocusCapture={(event) => {
          const id = event.target.closest<HTMLElement>("[data-location]")
            ?.dataset.location as LocationId | undefined;
          if (id && event.target.matches(":focus-visible")) {
            setTapInput(false);
            setFocusedId(id);
          } else setFocusedId(null);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocusedId(null);
        }}
        onKeyDownCapture={(event) => {
          setTapInput(false);
          if (event.key === "Escape") clearLocation();
        }}
        className="flex flex-col gap-6 desktop:gap-8"
      >
        <div
          ref={motionRef}
          data-slot="location-map-grid"
          data-motion="paused"
          className="group/locations grid items-center gap-6 desktop:grid-cols-[minmax(0,412fr)_minmax(0,732fr)] desktop:gap-14"
        >
          <ul className="order-2 grid min-w-0 gap-1.5 tablet:grid-cols-3 desktop:order-1 desktop:grid-cols-1">
            {locations.map((location) => (
              <li key={location.id} className="min-w-0">
                {control(
                  location,
                  "legend",
                  <>
                    <LocationDot active={activeId === location.id} />
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <Heading
                        as="span"
                        variant="item"
                        className="text-base leading-[1.2] tracking-[0.02em] tablet:text-base tablet:leading-[1.2]"
                      >
                        {location.city} ({location.country})
                      </Heading>
                      <MonoText as="span" variant="meta" tone="tertiary">
                        {location.meta}
                      </MonoText>
                    </span>
                  </>,
                )}
              </li>
            ))}
          </ul>
          <div
            data-slot="location-map"
            className="relative order-1 mx-auto aspect-[350/260] w-full min-w-0 overflow-clip desktop:order-2 desktop:aspect-[732/556.32]"
          >
            <LocationArtwork activeId={activeId} />
            {locations.map((location) => (
              <div
                key={location.id}
                data-location-anchor={location.id}
                className={cn("absolute size-0", pointPositions[location.id])}
              >
                <span
                  aria-hidden="true"
                  data-location-leader={location.id}
                  className={cn(
                    "pointer-events-none absolute top-0 h-px bg-action-primary/75 transition-[color,opacity] duration-250",
                    calloutLayouts[location.id].leader,
                    activeId === location.id && "opacity-0",
                  )}
                />
                <span
                  aria-hidden="true"
                  data-location-label={location.id}
                  className={cn(
                    "pointer-events-none absolute -translate-y-1/2 font-mono text-xs leading-[1.6] tracking-[0.12em] whitespace-nowrap uppercase transition-[color,opacity] duration-250",
                    calloutLayouts[location.id].label,
                    "text-text-secondary",
                    activeId === location.id && "opacity-0",
                  )}
                >
                  <span className="desktop:hidden">{location.city}</span>
                  <span className="hidden desktop:inline">
                    {location.city} · {location.country}
                    {location.headquarters && " · HQ"}
                  </span>
                </span>
                {control(location, "map")}
              </div>
            ))}
          </div>
        </div>
        <ul
          data-slot="location-regions"
          className="grid tablet:grid-cols-2 desktop:grid-cols-4"
        >
          {regions.map((region) => {
            const location = locations.find(
              (item) => item.id === region.locationId,
            );
            return (
              <li key={region.id} className="min-w-0">
                <LocationCard
                  region={region}
                  active={activeId === region.locationId}
                  selected={selectedId === region.locationId}
                  locationLabel={
                    location
                      ? `${location.city} (${location.country})`
                      : region.locationId
                  }
                  onSelect={() => toggleLocation(region.locationId)}
                  {...hoverLocation(region.locationId)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </TooltipProvider>
  );
}
