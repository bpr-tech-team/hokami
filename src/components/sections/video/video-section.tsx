"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";
import { ButtonLink } from "@/components/ui/button/button-link";
import { MonoText } from "@/components/typography/mono-text";
import { VideoFrame } from "./video-frame";
import { useVideoReveal } from "./use-video-reveal";
import { useVideoPreview } from "./use-video-preview";
import type { VideoSectionProps } from "./types";

export function VideoSection({
  id,
  src,
  mobileSrc,
  poster,
  previewSrc,
  labels,
  tracks = [],
  motion = "scroll",
  className,
}: VideoSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [error, setError] = useState(false);
  useVideoReveal(rootRef, active, motion === "scroll");
  useVideoPreview(previewRef, previewSrc, !active && !paused);

  function play() {
    const player = playerRef.current;
    if (!player) return;
    previewRef.current?.pause();
    setError(false);
    setActive(true);
    // Assign/play in the user's gesture so sound is allowed on iOS. No full
    // video source is present in the initial HTML or on a mobile page load.
    if (!player.hasAttribute("src")) {
      player.src =
        mobileSrc && window.matchMedia("(max-width: 47.499rem)").matches
          ? mobileSrc
          : src;
    }
    player.play().catch(() => {
      /* Native controls allow retry if autoplay is blocked. */
    });
    rootRef.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    requestAnimationFrame(() => player.focus({ preventScroll: true }));
  }

  function close() {
    playerRef.current?.pause();
    if (playerRef.current && playerRef.current.readyState > 0)
      playerRef.current.currentTime = 0;
    setActive(false);
    setError(false);
    requestAnimationFrame(() =>
      playRef.current?.focus({ preventScroll: true }),
    );
  }

  return (
    <section
      ref={rootRef}
      id={id}
      aria-label={labels.title}
      data-slot="video-section"
      data-active={active || undefined}
      className={cn(
        "group/video relative z-10 scroll-mt-(--site-header-height) px-5 [--video-gap:20px] [--video-height:max(320px,calc(100svh-var(--video-top)-var(--video-gap)))] [--video-top:var(--site-sticky-offset)] [overflow-anchor:none] tablet:px-10 tablet:[--video-gap:40px]",
        className,
      )}
    >
      <div data-video-slot className="relative h-0 w-full">
        <div
          data-video-stage
          className="pointer-events-none invisible absolute inset-x-0 top-0 h-(--video-height) group-data-ready/video:visible motion-reduce:aspect-video motion-reduce:h-auto"
        >
          <div
            data-video-frame
            className="pointer-events-none absolute inset-0"
          >
            <div
              data-video-clip
              className="pointer-events-auto absolute inset-0 overflow-hidden bg-surface-inverse"
            >
              <div
                data-video-media
                className="absolute bottom-0 left-0 size-full origin-bottom-left group-data-active/video:invisible"
              >
                <Image
                  src={poster}
                  alt=""
                  fill
                  sizes="(max-width: 759px) 100vw, 1440px"
                  unoptimized
                  className="object-cover"
                />
                {previewSrc && (
                  <video
                    ref={previewRef}
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster={poster}
                    aria-hidden="true"
                    tabIndex={-1}
                    onPlaying={() => setPreviewPlaying(true)}
                    onPause={() => setPreviewPlaying(false)}
                    className="absolute inset-0 size-full object-cover"
                  />
                )}
              </div>
              <video
                ref={playerRef}
                controls
                playsInline
                preload="none"
                poster={poster}
                aria-label={labels.title}
                tabIndex={active ? 0 : -1}
                onError={() => setError(true)}
                className={cn(
                  "absolute inset-0 size-full bg-surface-inverse object-contain",
                  !active && "invisible",
                )}
              >
                {tracks.map((track) => (
                  <track key={track.srcLang} kind="captions" {...track} />
                ))}
              </video>
            </div>
            <VideoFrame>
              {!active ? (
                <>
                  <MonoText
                    tone="inverse"
                    className="absolute top-4 left-4 max-w-[calc(100%-32px)] tablet:top-6 tablet:left-6"
                  >
                    {labels.caption}
                  </MonoText>
                  <Button
                    ref={playRef}
                    onClick={play}
                    showIcon={false}
                    className="pointer-events-auto absolute bottom-4 left-4 tablet:bottom-6 tablet:left-6"
                  >
                    {labels.play}
                  </Button>
                  {previewSrc && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPaused((value) => !value)}
                      aria-label={
                        paused ? labels.resumePreview : labels.pausePreview
                      }
                      aria-pressed={paused}
                      className={cn(
                        "pointer-events-auto absolute right-6 bottom-6 hidden bg-surface-inverse/60 text-text-on-inverse hover:bg-surface-inverse hover:text-text-on-inverse motion-reduce:hidden",
                        (previewPlaying || paused) && "tablet:inline-flex",
                      )}
                    >
                      {paused ? <PlayIcon /> : <PauseIcon />}
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={close}
                  aria-label={labels.close}
                  className="pointer-events-auto absolute top-4 right-4 bg-surface-inverse/80 text-text-on-inverse hover:bg-surface-inverse hover:text-text-on-inverse tablet:top-6 tablet:right-6"
                >
                  <XIcon />
                </Button>
              )}
              {active && error && (
                <div
                  role="alert"
                  className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-6 bg-surface-inverse px-6 text-center text-text-on-inverse"
                >
                  <p>{labels.error}</p>
                  <ButtonLink href={mobileSrc ?? src} showIcon={false}>
                    {labels.openFile}
                  </ButtonLink>
                  <Button
                    variant="outline"
                    onClick={close}
                    className="text-text-on-inverse"
                  >
                    {labels.close}
                  </Button>
                </div>
              )}
            </VideoFrame>
          </div>
        </div>
      </div>
      <noscript>
        <div className="relative aspect-video w-full">
          <Image
            src={poster}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <p className="mt-4">
          <ButtonLink href={src} showIcon={false}>
            {labels.play}
          </ButtonLink>
        </p>
      </noscript>
    </section>
  );
}
