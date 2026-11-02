import { useId } from "react";
import { cn } from "cn";
import type { LocationId } from "./data";
import { LocationDot } from "./location-dot";
import { mapSites } from "./map-layout";
import { mapBases, mapPulses } from "./map-artwork";
import "./locations-motion.css";

const vias = [
  { x: 499.956, y: 219.6 },
  { x: 419.436, y: 300.12 },
  { x: 248.88, y: 360.144 },
  { x: 512.4, y: 256.2 },
  { x: 409.92, y: 136.152 },
  { x: 409.188, y: 453.84 },
];

const motionClass =
  "hidden [animation-play-state:paused] motion-safe:group-data-[motion-ready=true]/locations:block group-data-[motion=running]/locations:[animation-play-state:running]";

export function LocationArtwork({ activeId }: { activeId: LocationId | null }) {
  const prefix = useId();
  return (
    <div
      aria-hidden="true"
      className="@container pointer-events-none absolute top-[-29.6154%] left-[-47.1429%] aspect-[732/556.32] w-[177.1429%] desktop:inset-0 desktop:w-full"
    >
      <svg
        focusable="false"
        width={732}
        height={556.32}
        viewBox="0 0 732 556.32"
        fill="none"
        className="absolute inset-0 size-full"
      >
        <image
          href="/images/locations/europe-pixel-grid.svg"
          width={732}
          height={556.32}
        />
        {mapBases.map(({ x, y, ...path }, index) => (
          <path key={index} {...path} transform={`translate(${x} ${y})`} />
        ))}
        {mapPulses.map((pulse) => {
          const filterId = `${prefix}-${pulse.nodeId}`;
          return (
            <g
              key={pulse.nodeId}
              transform={`translate(${pulse.x} ${pulse.y})`}
            >
              <defs>
                <filter
                  id={filterId}
                  {...pulse.filter}
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation={pulse.blur} />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.996078 0 0 0 0 0.278431 0 0 0 0 0.0156863 0 0 0 0.9 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="pulseGlow"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="pulseGlow"
                    result="shape"
                  />
                </filter>
              </defs>
              <g
                filter={`url(#${filterId})`}
                stroke={pulse.stroke}
                strokeWidth={pulse.strokeWidth}
              >
                <path
                  d={pulse.d}
                  className="motion-safe:group-data-[motion-ready=true]/locations:hidden"
                />
                <path
                  data-node-id={pulse.nodeId}
                  data-slot="location-pulse"
                  d={pulse.d}
                  pathLength="1"
                  className={cn(motionClass, pulse.animation)}
                />
              </g>
            </g>
          );
        })}
      </svg>
      {vias.map((via) => (
        <span
          key={`${via.x}:${via.y}`}
          className="absolute aspect-square w-[0.9%] -translate-1/2 rounded-[50%] bg-[radial-gradient(circle_closest-side,white_0_77.7778%,#fe4704_80%_97%,transparent_100%)]"
          style={{
            left: `${(via.x / 732) * 100}%`,
            top: `${(via.y / 556.32) * 100}%`,
          }}
        />
      ))}
      {mapSites.map((site) => (
        <span
          key={site.id}
          data-location-marker={site.id}
          data-active={activeId === site.id}
          className="absolute w-[1.6%] -translate-1/2"
          style={{
            left: `${(site.x / 732) * 100}%`,
            top: `${(site.y / 556.32) * 100}%`,
          }}
        >
          <LocationDot variant="map" active={activeId === site.id} />
        </span>
      ))}
    </div>
  );
}
