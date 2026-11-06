"use client";

import type { fields } from "@keystatic/core";
import { useId, useState } from "react";
import {
  JobImageError,
  validateContentImages,
} from "@/lib/jobs/image-validation";
import { hasJobContent, REQUIRED_JOB_CONTENT } from "@/lib/jobs/content";

type ContentField = ReturnType<typeof fields.markdoc.inline>;
type InputProps = Parameters<ContentField["Input"]>[0];

export function JobContentInput({
  field,
  required = false,
  ...props
}: InputProps & { field: ContentField; required?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [rejectedUploads, setRejectedUploads] = useState(0);
  const errorId = useId();
  const NativeInput = field.Input;
  const requiredError =
    required &&
    props.forceValidation &&
    !hasJobContent(
      field.reader.parse(
        field.serialize(props.value, { slug: undefined }).value,
      ).node,
    )
      ? REQUIRED_JOB_CONTENT
      : null;
  const message = error ?? requiredError;

  return (
    <div aria-describedby={message ? errorId : undefined}>
      <NativeInput
        key={rejectedUploads}
        {...props}
        onChange={(value) => {
          try {
            validateContentImages(field.serialize(value, { slug: undefined }));
            setError(null);
            props.onChange(value);
          } catch (cause) {
            setError(
              cause instanceof JobImageError
                ? cause.reason
                : "Obrázek nelze vložit.",
            );
            // The native editor updates its view before calling onChange.
            // Restore the last accepted value after a rejected upload.
            setRejectedUploads((count) => count + 1);
          }
        }}
      />
      {message ? (
        <p id={errorId} role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
