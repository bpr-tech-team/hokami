"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import NumberFlow, {
  NumberFlowGroup,
  continuous,
  useCanAnimate,
  type Format,
} from "@number-flow/react";
import { cn } from "@/lib/utils";
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
  | "additionalValues"
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

type RollingNumberProps = Pick<
  AnimatedNumberProps,
  "value" | "locale" | "prefix" | "suffix"
> & {
  format?: Format;
  started: boolean;
  isolate?: boolean;
  className?: string;
};

function RollingNumber({
  value,
  locale,
  prefix,
  suffix,
  format,
  started,
  isolate,
  className,
}: RollingNumberProps) {
  return (
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
      isolate={isolate}
      className={cn(
        "[--number-flow-mask-height:0px] [--number-flow-mask-width:0px]",
        className,
      )}
    />
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
  additionalValues,
  locale,
}: AnimatedNumberProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const motionAllowed = useCanAnimate();
  const canAnimate = motionAllowed && supportsAnimation;
  const hasNonZeroValue =
    value !== 0 || Boolean(additionalValues?.some((part) => part.value !== 0));

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      !canAnimate ||
      started ||
      !hasNonZeroValue ||
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
  }, [canAnimate, started, hasNonZeroValue]);

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
          "wrap-anywhere whitespace-pre-wrap",
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
        additionalValues?.length ? (
          <span
            aria-hidden="true"
            data-slot="animated-number-parts"
            className={cn(
              "pointer-events-none absolute inset-0 inline-flex items-start whitespace-pre",
              started && canAnimate ? "visible" : "invisible",
            )}
          >
            {prefix && <span>{prefix}</span>}
            <NumberFlowGroup>
              <RollingNumber
                value={value}
                locale={locale}
                format={format}
                started={started}
              />
              {additionalValues.map((part) => (
                <Fragment key={part.id}>
                  <span>{part.prefix}</span>
                  <RollingNumber
                    value={part.value}
                    locale={locale}
                    format={format}
                    started={started}
                  />
                </Fragment>
              ))}
            </NumberFlowGroup>
            {suffix && <span>{suffix}</span>}
          </span>
        ) : (
          <RollingNumber
            value={value}
            locale={locale}
            format={format}
            prefix={prefix}
            suffix={suffix}
            started={started}
            isolate
            className={cn(
              "pointer-events-none absolute inset-0",
              started && canAnimate ? "visible" : "invisible",
            )}
          />
        )
      ) : null}
    </span>
  );
}
