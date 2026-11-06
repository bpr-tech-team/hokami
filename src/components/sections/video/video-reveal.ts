type RevealDimensions = {
  top: number;
  width: number;
  height: number;
  viewportHeight: number;
  viewportWidth: number;
  bottomGap: number;
  topOffset: number;
  compact: boolean;
  previewInset?: number;
};

export type VideoRevealMeasurement = RevealDimensions & {
  reducedMotion: boolean;
};

export function hasVideoRevealLayoutChanged(
  previous: VideoRevealMeasurement | undefined,
  next: VideoRevealMeasurement,
) {
  // The aspect-ratio stage stays fixed when mobile browser toolbars move. A change
  // to innerHeight alone must not collapse the slot or rebuild its animations.
  return (
    !previous ||
    previous.top !== next.top ||
    previous.width !== next.width ||
    previous.height !== next.height ||
    previous.viewportWidth !== next.viewportWidth ||
    previous.bottomGap !== next.bottomGap ||
    previous.topOffset !== next.topOffset ||
    previous.compact !== next.compact ||
    previous.previewInset !== next.previewInset ||
    previous.reducedMotion !== next.reducedMotion
  );
}

export function getVideoRevealGeometry({
  top,
  width,
  height,
  viewportHeight,
  viewportWidth,
  bottomGap,
  topOffset,
  compact,
  previewInset = 0,
}: RevealDimensions) {
  const previewWidth = Math.min(
    width,
    320,
    compact ? viewportWidth * 0.8 : 320,
  );
  const previewHeight = previewWidth * (9 / 16);
  const start = Math.max(0, top + previewHeight + bottomGap - viewportHeight);
  const end = Math.max(start + 1, top - topOffset);
  const mediaHeight = width * (9 / 16);
  const mediaScale = Math.max(1, height / mediaHeight);

  return {
    start,
    end,
    previewWidth,
    previewHeight,
    previewInset,
    clip: `inset(0px ${width - previewInset - previewWidth}px ${height - previewHeight}px ${previewInset}px)`,
    mediaStart: `translate(${previewInset}px, 0px) scale(${previewWidth / width})`,
    // Uniform scaling preserves the source proportions throughout the reveal.
    mediaEnd: `translate(${(width - width * mediaScale) / 2}px, ${(height - mediaHeight * mediaScale) / 2}px) scale(${mediaScale})`,
  };
}

export function getVideoRevealProgress(
  {
    start,
    end,
  }: Pick<ReturnType<typeof getVideoRevealGeometry>, "start" | "end">,
  scrollY: number,
) {
  return Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
}
