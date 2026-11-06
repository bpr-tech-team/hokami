"use client";

import type { fields } from "@keystatic/core";
import { useId, useState } from "react";
import {
  JobImageError,
  validateContentImages,
} from "@/lib/jobs/image-validation";

type ContentField = ReturnType<typeof fields.markdoc.inline>;
type InputProps = Parameters<ContentField["Input"]>[0];

export function JobContentInput({
  field,
  ...props
}: InputProps & { field: ContentField }) {
  const [error, setError] = useState<string | null>(null);
  const [rejectedUploads, setRejectedUploads] = useState(0);
  const errorId = useId();
  const NativeInput = field.Input;

  return (
    <div aria-describedby={error ? errorId : undefined}>
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
      {error ? (
        <p id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
