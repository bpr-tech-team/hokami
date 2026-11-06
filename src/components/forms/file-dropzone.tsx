"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MonoText } from "@/components/typography/mono-text";
import { Text } from "@/components/typography/text";

type FileDropzoneProps = {
  id: string;
  label: string;
  hint: string;
  choose: string;
  accept?: string;
  error?: string;
  disabled: boolean;
  onAdd: (files: File[]) => void;
};

export function FileDropzone({
  id,
  label,
  hint,
  choose,
  accept,
  error,
  disabled,
  onAdd,
}: FileDropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  return (
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
      <div className="flex min-w-0 grow basis-[180px] flex-col gap-1">
        <MonoText
          id={`${id}-label`}
          tone="secondary"
          className="text-text-primary"
        >
          {label}
        </MonoText>
        <Text
          id={`${id}-hint`}
          variant="small"
          className={cn(
            "text-text-tertiary",
            error && "text-feedback-error-text",
          )}
          role={error ? "alert" : undefined}
        >
          {error ?? hint}
        </Text>
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        multiple
        accept={accept}
        disabled={disabled}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        aria-invalid={Boolean(error)}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          onAdd(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      <Button
        id={`${id}-trigger`}
        data-upload-button
        type="button"
        variant="outline"
        showTraceDots={false}
        disabled={disabled}
        className="h-auto min-h-12 max-w-full py-3 whitespace-normal"
        aria-describedby={`${id}-hint`}
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
        {choose}
      </Button>
    </div>
  );
}
