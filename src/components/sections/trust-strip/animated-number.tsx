"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow, {
  continuous,
  useCanAnimate,
  type Format,
} from "@number-flow/react";
import { cn } from "cn";
import type { PreparedStatistic } from "./types";

type AnimatedNumberProps = Pick<
  PreparedStatistic,
  | "value"
  | "format"
  | "prefix"
  | "suffix"
  | "formattedValue"
  | "accessibleValue"
  | "supportsAnimation"
> & {
  locale: string;
};

const spinTiming = {
  duration: 1600,
  easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
};
const transformTiming = { duration: 0 };
const plugins = [continuous];

function supportsRolling(
  format?: Intl.NumberFormatOptions,
): format is Format | undefined {
  return (
    format?.notation !== "scientific" && format?.notation !== "engineering"
  );
}

export function AnimatedNumber({
  value,
  format,
  prefix,
  suffix,
  formattedValue,
  accessibleValue = formattedValue,
  supportsAnimation,
  locale,
}: AnimatedNumberProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const motionAllowed = useCanAnimate();
  const canAnimate = motionAllowed && supportsAnimation;

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      !canAnimate ||
      started ||
      value === 0 ||
      typeof IntersectionObserver !== "function"
    ) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (!entry.isIntersecting || entry.intersectionRatio < 0.25) return;

        timer = setTimeout(() => {
          const measurement = root.querySelector<HTMLElement>(
            "[data-stat-measure]",
          );

          // Very long values keep their wrapping, readable static presentation.
          if (
            document.hidden ||
            (measurement &&
              measurement.getBoundingClientRect().width > root.clientWidth + 1)
          ) {
            return;
          }

          observer.disconnect();
          setStarted(true);
        }, 200);
      },
      { threshold: 0.25 },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [canAnimate, started, value]);

  return (
    <span
      ref={rootRef}
      data-slot="animated-number"
      data-started={started}
      className="relative inline-grid max-w-full min-w-0 overflow-clip align-top tabular-nums"
    >
      <span className="sr-only">{accessibleValue}</span>
      <span
        aria-hidden="true"
        className={cn(
          "whitespace-pre-wrap wrap-anywhere",
          started && canAnimate && "invisible",
        )}
      >
        {formattedValue}
      </span>
      <span
        aria-hidden="true"
        data-stat-measure=""
        className="pointer-events-none invisible absolute w-max whitespace-pre"
      >
        {formattedValue}
      </span>
      {supportsAnimation && supportsRolling(format) ? (
        <NumberFlow
          aria-hidden="true"
          value={started ? value : 0}
          locales={locale}
          format={format}
          prefix={prefix}
          suffix={suffix}
          trend={Math.sign(value) || 1}
          plugins={plugins}
          spinTiming={spinTiming}
          transformTiming={transformTiming}
          opacityTiming={{ duration: 200, easing: "ease-out" }}
          isolate
          className={cn(
            "pointer-events-none absolute inset-0 [--number-flow-mask-height:0px] [--number-flow-mask-width:0px]",
            started && canAnimate ? "visible" : "invisible",
          )}
        />
      ) : null}
    </span>
  );
}
