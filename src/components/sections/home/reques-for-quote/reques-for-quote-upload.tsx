"use client";

import { useTranslations } from "next-intl";
import type { RequesForQuoteErrorKey } from "@/lib/reques-for-quote/validation";
import { FileDropzone } from "@/components/forms/file-dropzone";
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

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <FileDropzone
        id="reques-for-quote-files"
        label={t("upload.label")}
        hint={t("upload.hint")}
        choose={t("upload.choose")}
        error={error ? t(`errors.${error}`) : undefined}
        disabled={disabled}
        onAdd={onAdd}
      />
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
