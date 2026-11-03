type RevealDimensions = {
  top: number;
  width: number;
  height: number;
  viewportHeight: number;
  viewportWidth: number;
  bottomGap: number;
  compact: boolean;
};

export function getVideoRevealGeometry({
  top,
  width,
  height,
  viewportHeight,
  viewportWidth,
  bottomGap,
  compact,
}: RevealDimensions) {
  const previewWidth = Math.min(
    width,
    320,
    compact ? viewportWidth * 0.8 : 320,
  );
  const previewHeight = previewWidth * (9 / 16);
  const start = Math.max(0, top - viewportHeight);
  const end = Math.max(start + 1, top + height - viewportHeight + bottomGap);
  const mediaHeight = width * (9 / 16);
  const mediaScale = Math.max(1, height / mediaHeight);

  return {
    start,
    end,
    previewWidth,
    previewHeight,
    clip: `inset(${height - previewHeight}px ${width - previewWidth}px 0px 0px)`,
    mediaStart: `translate(0px, 0px) scale(${previewWidth / width})`,
    // Uniform scaling preserves the video's aspect ratio, including the tall
    // mobile frame. Only the surrounding viewport changes shape.
    mediaEnd: `translate(${(width - width * mediaScale) / 2}px, ${(mediaHeight * mediaScale - height) / 2}px) scale(${mediaScale})`,
  };
}

export function getVideoRevealPosition(
  {
    start,
    end,
  }: Pick<ReturnType<typeof getVideoRevealGeometry>, "start" | "end">,
  scrollY: number,
) {
  return {
    progress: Math.max(0, Math.min(1, (scrollY - start) / (end - start))),
    translateY: Math.min(0, Math.max(start, scrollY) - end),
  };
}
