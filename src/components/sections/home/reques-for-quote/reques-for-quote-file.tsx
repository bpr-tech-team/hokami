"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";

type FileProgress = { percentage: number; uploaded: boolean };

type RequesForQuoteFileProps = {
  file: File;
  previewUploads: boolean;
  disabled: boolean;
  onRemove: () => void;
};

// Preview the design locally while file delivery remains unimplemented.
function useUploadPreview(enabled: boolean) {
  const [progress, setProgress] = useState<FileProgress>({
    percentage: 0,
    uploaded: false,
  });

  useEffect(() => {
    if (!enabled) return;
    let frame: number;
    let startedAt: number | undefined;
    let previousPercentage = -1;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function animate(timestamp: number) {
      startedAt ??= timestamp;
      const percentage = reducedMotion
        ? 100
        : Math.min(100, Math.floor(((timestamp - startedAt) / 1800) * 100));
      if (percentage !== previousPercentage) {
        previousPercentage = percentage;
        setProgress({ percentage, uploaded: percentage === 100 });
      }
      if (percentage < 100) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  return enabled ? progress : undefined;
}

export function RequesForQuoteFile({
  file,
  previewUploads,
  disabled,
  onRemove,
}: RequesForQuoteFileProps) {
  const t = useTranslations("RequesForQuote.upload");
  const format = useFormatter();
  const current = useUploadPreview(previewUploads);
  const uploading = current?.uploaded === false;
  const divisor =
    file.size >= 1024 * 1024 ? 1024 * 1024 : file.size >= 1024 ? 1024 : 1;
  const unit = file.size >= 1024 * 1024 ? "MB" : file.size >= 1024 ? "KB" : "B";

  return (
    <li className="flex min-w-0 items-center gap-3 overflow-hidden border border-border-subtle py-3 pr-2 pl-3.5">
      <Image
        src="/images/reques-for-quote/file.svg"
        width={20}
        height={20}
        alt=""
        className="shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Text variant="small" className="truncate" title={file.name}>
          {file.name}
        </Text>
        <MonoText
          variant="meta"
          tone="tertiary"
          className="flex flex-wrap items-center gap-x-1.5"
        >
          <span className="whitespace-nowrap">
            {format.number(file.size / divisor, { maximumFractionDigits: 1 })}{" "}
            {unit}
          </span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">
            {uploading
              ? t("uploading", { progress: current.percentage })
              : t("uploaded")}
          </span>
        </MonoText>
        <div
          role={uploading ? "progressbar" : undefined}
          aria-label={uploading ? file.name : undefined}
          aria-valuemin={uploading ? 0 : undefined}
          aria-valuemax={uploading ? 100 : undefined}
          aria-valuenow={uploading ? current.percentage : undefined}
          className={cn(
            "h-0.5 w-full overflow-hidden bg-border-subtle",
            !uploading && "invisible",
          )}
        >
          <div
            className="h-full bg-action-primary transition-[width] duration-100 ease-linear"
            style={{ width: `${current?.percentage ?? 100}%` }}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        aria-label={t("remove", { name: file.name })}
        onClick={onRemove}
      >
        <Image
          src="/images/reques-for-quote/remove.svg"
          width={20}
          height={20}
          alt=""
        />
      </Button>
    </li>
  );
}
