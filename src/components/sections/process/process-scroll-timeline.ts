const transitionFraction = 0.12;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getProcessScrollProgress(
  scrollY: number,
  start: number,
  distance: number,
) {
  return distance > 0 ? clamp((scrollY - start) / distance) : 0;
}

export function getProcessScrollRange(index: number, count: number) {
  const start = index / count;
  const end = (index + 1) / count;
  const transition = transitionFraction / count;

  return {
    enterStart: Math.max(0, start - transition),
    enterEnd: start,
    exitStart: end - transition,
    exitEnd: end,
  };
}

/** Shared normalized states for the fallback and the CSS attachment ranges. */
export function getProcessScrollState(
  progress: number,
  count: number,
  reducedMotion = false,
  textOffset = 18,
) {
  const position = clamp(progress);
  const active = Math.min(count - 1, Math.floor(position * count));
  const angle =
    count < 2
      ? 0
      : 360 * (reducedMotion ? Math.floor(position * count) / count : position);

  return {
    angle,
    active,
    nodes: Array.from({ length: count }, (_, index) =>
      position >= index / count ? 1 : 0,
    ),
    steps: Array.from({ length: count }, (_, index) => {
      if (reducedMotion) {
        return {
          enter: index === active ? 1 : 0,
          exit: 1,
          enterY: 0,
          exitY: 0,
        };
      }

      const range = getProcessScrollRange(index, count);
      const transition = transitionFraction / count;
      const enter =
        index === 0 ? 1 : clamp((position - range.enterStart) / transition);
      const exit =
        index === count - 1
          ? 1
          : 1 - clamp((position - range.exitStart) / transition);

      return {
        enter,
        exit,
        enterY: (1 - enter) * textOffset,
        exitY: (1 - exit) * textOffset,
      };
    }),
  };
}
