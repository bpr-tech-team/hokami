"use client";

import {
  Fragment,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { ProcessDiagram } from "./process-diagram";
import { ProcessStep } from "./process-step";
import { getProcessScrollRange } from "./process-scroll-timeline";
import { processScrollLayoutStyle } from "./process-scroll-layout";
import { useProcessScroll } from "./use-process-scroll";
import type { ProcessStep as ProcessStepContent } from "./types";
import "./process-scroll.css";

export function ProcessScrollRing({
  steps,
  labelledBy,
  background,
}: {
  steps: readonly ProcessStepContent[];
  labelledBy: string;
  background?: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const choiceId = useId();
  useProcessScroll(rootRef, steps.length);

  if (!steps.length) return null;

  return (
    <div
      ref={rootRef}
      data-slot="process-scroll"
      data-static={steps.length === 1 ? "true" : undefined}
      style={processScrollLayoutStyle}
      className={cn(
        "hokami-process-scroll relative h-[calc(var(--process-scene-height)+var(--process-distance,0px)+var(--process-controls-space))] w-full [--process-bottom:max(var(--process-gap),env(safe-area-inset-bottom))] [--process-controls-space:64px] [--process-gap:clamp(8px,2svh,16px)] [--process-scene-height:calc(100svh-var(--process-top)-var(--process-bottom))] [--process-top:calc(var(--site-sticky-offset)+var(--process-gap))]",
        steps.length === 1 && "[--process-controls-space:0px]",
      )}
    >
      <div
        data-process-scroll-scene
        className="sticky top-(--process-top) isolate grid h-(--process-scene-height) place-items-center"
      >
        {background}
        <fieldset
          data-process-scroll-ring
          aria-labelledby={labelledBy}
          className="@container/process relative mx-auto aspect-square w-[min(100%,620px,var(--process-scene-height))] min-w-0 border-0 p-0"
        >
          <ProcessDiagram
            count={steps.length}
            angleProperty="--process-scroll-angle"
          />
          {steps.map((step, index) => {
            const range = getProcessScrollRange(index, steps.length);
            const id = `${choiceId}-${step.id}`;

            return (
              <Fragment key={step.id}>
                <input
                  id={id}
                  type="radio"
                  name={choiceId}
                  value={step.id}
                  defaultChecked={index === 0}
                  aria-label={`${step.label}: ${step.title}`}
                  className="hokami-process-scroll-choice sr-only"
                />
                <div
                  data-process-scroll-step={index}
                  data-first={index === 0 ? "true" : undefined}
                  style={
                    {
                      "--process-enter-start": `${range.enterStart * 100}%`,
                      "--process-enter-end": `${range.enterEnd * 100}%`,
                    } as CSSProperties
                  }
                  className="hokami-process-scroll-step pointer-events-none absolute inset-x-[14.52%] inset-y-0 items-center text-center"
                >
                  <div
                    data-process-scroll-exit
                    data-last={index === steps.length - 1 ? "true" : undefined}
                    style={
                      {
                        "--process-exit-start": `${range.exitStart * 100}%`,
                        "--process-exit-end": `${range.exitEnd * 100}%`,
                      } as CSSProperties
                    }
                    className="hokami-process-scroll-exit"
                  >
                    <ProcessStep step={step} ring compact />
                  </div>
                </div>
                {steps.length > 1 && (
                  <label
                    htmlFor={id}
                    aria-hidden="true"
                    style={{
                      left: `calc(50% + ${(index - (steps.length - 1) / 2) * 48}px)`,
                    }}
                    className="hokami-process-scroll-control absolute top-[calc(100%+12px)] flex size-10 -translate-x-1/2 cursor-pointer items-center justify-center border border-border-subtle bg-surface-default font-mono text-xs text-text-secondary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </label>
                )}
              </Fragment>
            );
          })}
        </fieldset>
      </div>
    </div>
  );
}
