"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";
import type { RequesForQuoteErrorKey } from "@/lib/reques-for-quote/validation";
import { RequesForQuoteFile } from "./reques-for-quote-file";

type RequesForQuoteUploadProps = {
  files: File[];
  previewUploads: boolean;
  error?: RequesForQuoteErrorKey;
  disabled: boolean;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
};

export function RequesForQuoteUpload({
  files,
  previewUploads,
  error,
  disabled,
  onAdd,
  onRemove,
}: RequesForQuoteUploadProps) {
  const t = useTranslations("RequesForQuote");
  const input = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div
        className={cn(
          "relative flex flex-wrap items-center gap-4 border border-dashed border-action-primary bg-surface-subtle p-5 transition-colors hover:bg-surface-raised",
          dragging &&
            "border-solid bg-surface-accent-subtle outline-1 outline-action-primary",
          error &&
            "border-solid border-feedback-error-text outline-1 outline-feedback-error-text",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled && event.dataTransfer.types.includes("Files")) {
            dragDepth.current += 1;
            setDragging(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? "none" : "copy";
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (!dragDepth.current) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          if (!disabled) onAdd(Array.from(event.dataTransfer.files));
        }}
      >
        <Image
          src="/images/reques-for-quote/upload.svg"
          width={24}
          height={24}
          alt=""
        />
        <div className="flex min-w-0 basis-[180px] flex-col gap-1 grow">
          <MonoText
            id="reques-for-quote-files-label"
            tone="secondary"
            className="text-text-primary"
          >
            {t("upload.label")}
          </MonoText>
          <Text
            id="reques-for-quote-files-hint"
            variant="small"
            className={cn(
              "text-text-tertiary",
              error && "text-feedback-error-text",
            )}
            role={error ? "alert" : undefined}
          >
            {error ? t(`errors.${error}`) : t("upload.hint")}
          </Text>
        </div>
        <input
          ref={input}
          id="reques-for-quote-files"
          type="file"
          multiple
          disabled={disabled}
          aria-labelledby="reques-for-quote-files-label"
          aria-describedby="reques-for-quote-files-hint"
          aria-invalid={Boolean(error)}
          className="peer sr-only"
          tabIndex={-1}
          onChange={(event) => {
            onAdd(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <Button
          data-upload-button
          type="button"
          variant="outline"
          showTraceDots={false}
          disabled={disabled}
          className="max-w-full"
          onClick={() => input.current?.click()}
          icon={
            <Image
              src="/images/reques-for-quote/paperclip.svg"
              width={20}
              height={20}
              alt=""
            />
          }
        >
          {t("upload.choose")}
        </Button>
      </div>
      {files.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label={t("upload.selected")}>
          {files.map((file, index) => (
            <RequesForQuoteFile
              key={`${file.name}-${file.size}-${file.lastModified}`}
              file={file}
              previewUploads={previewUploads}
              disabled={disabled}
              onRemove={() => onRemove(index)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
