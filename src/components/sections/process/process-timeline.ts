export const PROCESS_STEP_DURATION = 4000;

// Figma's movement and text easing, with an 18 px text offset.
const movementEasing = "cubic-bezier(0.4, 0, 0.2, 1)";
const textEasing = "cubic-bezier(0.2, 0.7, 0.2, 1)";
const textTransition = 550;

export function getProcessNode(index: number, count: number) {
  const angle = (index / count) * 2 * Math.PI;
  const radius = 268.667;

  return {
    x: 310 + Math.sin(angle) * radius,
    y: 310 - Math.cos(angle) * radius,
  };
}

export function getProcessTimeline(count: number) {
  const duration = count * PROCESS_STEP_DURATION;
  const orbit: Keyframe[] = [];
  const progress: Keyframe[] = [];

  for (let index = 0; index < count; index++) {
    const start = index * PROCESS_STEP_DURATION;
    for (const [time, fraction, easing] of [
      [start, index / count, "linear"],
      [start + 300, index / count, movementEasing],
      [start + PROCESS_STEP_DURATION - 500, (index + 1) / count, "linear"],
      [start + PROCESS_STEP_DURATION, (index + 1) / count, "linear"],
    ] as const) {
      orbit.push({
        offset: time / duration,
        transform: `rotate(${fraction * 360}deg)`,
        easing,
      });
      progress.push({
        offset: time / duration,
        "--process-angle": `${fraction * 360}deg`,
        easing,
      });
    }
  }

  const steps = Array.from({ length: count }, (_, index) => {
    const start = index * PROCESS_STEP_DURATION;
    const end = start + PROCESS_STEP_DURATION;
    const frames: Keyframe[] = [
      {
        offset: 0,
        opacity: index === 0 ? 1 : 0,
        transform: index === 0 ? "translateY(0)" : "translateY(18px)",
      },
    ];

    if (index > 0) {
      frames.push(
        {
          offset: (start - textTransition) / duration,
          opacity: 0,
          transform: "translateY(18px)",
          easing: textEasing,
        },
        { offset: start / duration, opacity: 1, transform: "translateY(0)" },
      );
    }

    if (index < count - 1) {
      frames.push(
        {
          offset: (end - textTransition) / duration,
          opacity: 1,
          transform: "translateY(0)",
          easing: textEasing,
        },
        { offset: end / duration, opacity: 0, transform: "translateY(18px)" },
        { offset: 1, opacity: 0, transform: "translateY(18px)" },
      );
    } else {
      frames.push({ offset: 1, opacity: 1, transform: "translateY(0)" });
    }

    return frames;
  });

  const nodes = Array.from({ length: count }, (_, index): Keyframe[] =>
    index === 0
      ? [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 1 },
        ]
      : [
          { offset: 0, opacity: 0 },
          {
            offset: (index * PROCESS_STEP_DURATION - 500) / duration,
            opacity: 0,
            easing: textEasing,
          },
          { offset: index / count, opacity: 1 },
          { offset: 1, opacity: 1 },
        ],
  );

  return { duration, orbit, progress, steps, nodes };
}
