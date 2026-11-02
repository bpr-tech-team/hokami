import { useId } from "react";
import Image from "next/image";
import { cn } from "cn";
import {
  desktopArtwork,
  mobileArtwork,
  type HeroArtwork,
} from "./hero-artwork";
import { HeroMotion } from "./hero-motion";
import "./hero-motion.css";

type HeroBackgroundProps = {
  animated?: boolean;
  className?: string;
};

function Artwork({
  artwork,
  prefix,
  className,
}: {
  artwork: HeroArtwork;
  prefix: string;
  className: string;
}) {
  return (
    <svg
      width={artwork.width}
      height={artwork.height}
      viewBox={`0 0 ${artwork.width} ${artwork.height}`}
      preserveAspectRatio="none"
      fill="none"
      focusable="false"
      className={className}
    >
      {artwork.bases.map(({ src, ...placement }) => (
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
            <g filter={`url(#${filterId})`}>
              <path
                data-node-id={pulse.nodeId}
                d={pulse.d}
                pathLength="1"
                stroke={pulse.stroke}
                strokeOpacity={pulse.strokeOpacity}
                strokeWidth="1.4"
                shapeRendering={pulse.crispEdges ? "crispEdges" : undefined}
                className={cn("hokami-hero-pulse", pulse.animation)}
              />
            </g>
          </svg>
        );
      })}
      {artwork.vias.map(({ x, y }) => (
        <image
          key={`${x}:${y}`}
          href={artwork.via.src}
          x={x}
          y={y}
          width={artwork.via.width}
          height={artwork.via.height}
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
      <div className="absolute inset-0 hidden tablet:block">
        <Image
          src="/images/hero/desktop-horizon-glow.svg"
          alt=""
          width={2168}
          height={2168}
          unoptimized
          loading="eager"
          draggable={false}
          className="absolute bottom-[-839.2px] left-1/2 max-w-none -translate-x-1/2"
        />
      </div>
      <div className="absolute inset-0 tablet:hidden">
        <Image
          src="/images/hero/mobile-horizon-glow.svg"
          alt=""
          width={593}
          height={593}
          unoptimized
          loading="eager"
          draggable={false}
          className="absolute bottom-[-230.2px] left-1/2 max-w-none -translate-x-1/2"
        />
      </div>
      <Artwork
        artwork={desktopArtwork}
        prefix={`${id}-desktop`}
        className="absolute top-1/2 left-1/2 hidden h-[900px] w-[1440px] max-w-none -translate-1/2 tablet:block"
      />
      <Artwork
        artwork={mobileArtwork}
        prefix={`${id}-mobile`}
        className="absolute inset-0 size-full tablet:hidden"
      />
    </HeroMotion>
  );
}
