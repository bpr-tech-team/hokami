import { useId } from "react";
import { cn } from "cn";
import {
  desktopArtwork,
  mobileArtwork,
  type HeroArtwork,
} from "./hero-artwork";
import { HeroMotion } from "./hero-motion";
import { HeroHorizonGlow } from "./hero-horizon-glow";
import "./hero-motion.css";

type HeroBackgroundProps = {
  animated?: boolean;
  className?: string;
};

// Contact positions follow each trace; their diameter stays fixed in CSS pixels.
const mobileTraces = mobileArtwork.pulses.map((pulse, index) => {
  return {
    id: pulse.nodeId,
    artwork: {
      width: pulse.width,
      height: pulse.height,
      bases: [],
      pulses: [{ ...pulse, x: 0, y: 0 }],
      via: mobileArtwork.via,
      vias: [],
    } satisfies HeroArtwork,
    contacts: mobileArtwork.vias.slice(index * 2, index * 2 + 2).map((via) => ({
      left: `${((via.x - pulse.x + mobileArtwork.via.width / 2) / pulse.width) * 100}%`,
      top: `${((via.y - pulse.y + mobileArtwork.via.height / 2) / pulse.height) * 100}%`,
    })),
  };
});

const mobileTraceLayouts = [
  "absolute top-[31.7553px] -left-[15px] h-auto w-[calc(100%+30px)] max-w-none",
  "absolute bottom-[19.2702px] -left-[15px] h-auto w-[calc(100%+30px)] max-w-none",
  "absolute top-[-15.4043px] right-[12.3px] h-[calc(100%+30.808px)] w-auto max-w-none",
] as const;

function Artwork({
  artwork,
  prefix,
  className,
  baseStrokeWidth,
  nonScalingStroke = false,
}: {
  artwork: HeroArtwork;
  prefix: string;
  className: string;
  baseStrokeWidth?: number;
  nonScalingStroke?: boolean;
}) {
  const vectorEffect = nonScalingStroke ? "non-scaling-stroke" : undefined;

  return (
    <svg
      width={artwork.width}
      height={artwork.height}
      viewBox={`0 0 ${artwork.width} ${artwork.height}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      focusable="false"
      className={className}
    >
      {baseStrokeWidth == null &&
        artwork.bases.map(({ src, ...placement }) => (
          <image key={src} href={src} {...placement} />
        ))}
      {artwork.pulses.map((pulse, index) => {
        const filterId = `${prefix}-pulse-${index}`;

        return (
          <svg
            key={pulse.nodeId}
            x={pulse.x}
            y={pulse.y}
            width={pulse.width}
            height={pulse.height}
            viewBox={`0 0 ${pulse.width} ${pulse.height}`}
            overflow="visible"
            fill="none"
          >
            <defs>
              <filter
                id={filterId}
                x={pulse.filter.x}
                y={pulse.filter.y}
                width={pulse.filter.width}
                height={pulse.filter.height}
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
                <feGaussianBlur stdDeviation={pulse.filter.blur} />
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
                <feBlend mode="normal" in="SourceGraphic" in2="pulseGlow" />
              </filter>
            </defs>
            {baseStrokeWidth != null && (
              <path
                data-slot="hero-trace-base"
                d={pulse.d}
                stroke="var(--color-brand-identity)"
                strokeOpacity="0.5"
                strokeWidth={baseStrokeWidth}
                vectorEffect={vectorEffect}
                shapeRendering={nonScalingStroke ? "crispEdges" : undefined}
              />
            )}
            <g filter={`url(#${filterId})`}>
              <path
                data-node-id={pulse.nodeId}
                d={pulse.d}
                pathLength="1"
                stroke={pulse.stroke}
                strokeOpacity={pulse.strokeOpacity}
                strokeWidth="1.4"
                vectorEffect={vectorEffect}
                shapeRendering={pulse.crispEdges ? "crispEdges" : undefined}
                className={cn("hokami-hero-pulse", pulse.animation)}
              />
            </g>
          </svg>
        );
      })}
      {artwork.vias.map(({ x, y }) => (
        <ellipse
          key={`${x}:${y}`}
          cx={x + artwork.via.width / 2}
          cy={y + artwork.via.height / 2}
          rx={(artwork.via.width - 1) / 2}
          ry={(artwork.via.height - 1) / 2}
          fill="var(--color-surface-default)"
          stroke={artwork.via.stroke}
          vectorEffect={vectorEffect}
        />
      ))}
    </svg>
  );
}

/** The parent supplies a positioned box; this background also works without HeroSection. */
export function HeroBackground({
  animated = true,
  className,
}: HeroBackgroundProps) {
  const id = useId();

  return (
    <HeroMotion
      animated={animated}
      className={cn("hokami-hero-background", className)}
    >
      {/* Keep the large, unchanging blur outside the animated SVG paint surface. */}
      <HeroHorizonGlow />
      <Artwork
        artwork={desktopArtwork}
        prefix={`${id}-desktop`}
        className="absolute top-1/2 left-1/2 hidden h-[900px] w-[1440px] max-w-none -translate-1/2 tablet:block"
      />
      <div className="absolute inset-0 tablet:hidden">
        {mobileTraces.map((trace, index) => (
          <div
            key={trace.id}
            className={mobileTraceLayouts[index]}
            style={{
              aspectRatio: `${trace.artwork.width} / ${trace.artwork.height}`,
            }}
          >
            <Artwork
              artwork={trace.artwork}
              prefix={`${id}-mobile-${index}`}
              className="block size-full max-w-none"
              baseStrokeWidth={1}
              nonScalingStroke
            />
            {trace.contacts.map((position, contactIndex) => (
              <span
                key={contactIndex}
                data-slot="hero-trace-contact"
                className="absolute size-[7px] -translate-1/2 rounded-full border border-action-primary bg-surface-default"
                style={position}
              />
            ))}
          </div>
        ))}
      </div>
    </HeroMotion>
  );
}
