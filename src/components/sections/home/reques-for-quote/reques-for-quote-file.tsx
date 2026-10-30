"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { cn } from "cn";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Progress } from "@/components/ui/progress";

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
    <li className="min-w-0">
      <Attachment state={uploading ? "uploading" : "done"}>
        <AttachmentMedia>
          <Image
            src="/images/reques-for-quote/file.svg"
            width={20}
            height={20}
            alt=""
            className="shrink-0"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle title={file.name}>{file.name}</AttachmentTitle>
          <AttachmentDescription>
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
          </AttachmentDescription>
          <Progress
            value={current?.percentage ?? 100}
            aria-label={file.name}
            aria-hidden={!uploading}
            className={cn("h-0.5 w-full", !uploading && "invisible")}
          />
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction
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
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </li>
  );
}
