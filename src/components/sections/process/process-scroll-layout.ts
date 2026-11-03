import type { CSSProperties } from "react";

// Shared by the native CSS timeline and its JavaScript fallback.
const textMotion = {
  minimumWidth: 280,
  offsetPerPixel: 0.05,
  maximumOffset: 18,
} as const;

export const processScrollLayoutStyle = {
  "--process-text-min-width": `${textMotion.minimumWidth}px`,
  "--process-text-offset-rate": textMotion.offsetPerPixel,
  "--process-text-max-offset": `${textMotion.maximumOffset}px`,
} as CSSProperties;

export function getProcessTextOffset(width: number) {
  return Math.max(
    0,
    Math.min(
      textMotion.maximumOffset,
      (width - textMotion.minimumWidth) * textMotion.offsetPerPixel,
    ),
  );
}
