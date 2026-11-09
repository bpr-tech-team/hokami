"use client";

import { keystaticUiText } from "@/i18n/keystatic-ui";

import { useEffect, useState } from "react";
import { JobPhoto } from "@/components/sections/jobs/detail/job-photo";
import { Text } from "@/components/typography/text";

export function JobPhotoPreview({
  value,
}: {
  value: {
    readonly src: { data: Uint8Array; extension: string } | null;
    readonly alt: string;
  };
}) {
  const [source, setSource] = useState("");
  useEffect(() => {
    if (!value.src) return;
    const reader = new FileReader();
    reader.onload = () =>
      setSource(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(
      new Blob([new Uint8Array(value.src.data)], {
        type: `image/${value.src.extension === "jpg" ? "jpeg" : value.src.extension}`,
      }),
    );
    return () => reader.abort();
  }, [value.src]);
  return source && value.src ? (
    <JobPhoto src={source} alt={value.alt} />
  ) : (
    <Text
      variant="small"
      tone="secondary"
      className="m-0 border border-border-subtle bg-surface-subtle p-4"
    >
      {keystaticUiText(
        "Select a photograph and enter alternative text using Edit.",
      )}
    </Text>
  );
}
