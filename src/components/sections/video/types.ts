export type VideoLabels = {
  title: string;
  caption: string;
  play: string;
  pausePreview: string;
  resumePreview: string;
  close: string;
  error: string;
  openFile: string;
};

export type VideoTrack = {
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
};

export type VideoSectionProps = {
  id: string;
  src: string;
  mobileSrc?: string;
  poster: string;
  /** A short, silent loop. Never downloaded on mobile or under reduced motion. */
  previewSrc?: string;
  labels: VideoLabels;
  tracks?: readonly VideoTrack[];
  motion?: "scroll" | "none";
  className?: string;
};
