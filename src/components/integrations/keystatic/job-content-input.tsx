"use client";

import { keystaticUiText } from "@/i18n/keystatic-ui";

import type { fields } from "@keystatic/core";
import { useCallback, useId, useState } from "react";
import {
  JobImageError,
  validateContentImages,
} from "@/lib/jobs/image-validation";
import { hasJobContent, REQUIRED_JOB_CONTENT } from "@/lib/jobs/content";
import { Text } from "@/components/typography/text";
import { prepareJobEditorState } from "@/lib/jobs/editor-layout";
import { JobEditorContext } from "./job-editor-context";
import { assertJobLayout, JobLayoutError } from "@/lib/jobs/content-layout";
import { serializeJobClipboard } from "@/lib/jobs/clipboard";
import { cn } from "@/lib/utils";
import {
  attachJobToolbar,
  type JobToolbarAttachment,
} from "@/lib/jobs/editor-toolbar";
import { JobEditorActions, type JobCopyStatus } from "./job-editor-actions";

type ContentField = ReturnType<typeof fields.markdoc.inline>;
type InputProps = Parameters<ContentField["Input"]>[0];

export function JobContentInput({
  field,
  required = false,
  ...props
}: InputProps & { field: ContentField; required?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [rejectedUploads, setRejectedUploads] = useState(0);
  const [copyStatus, setCopyStatus] = useState<JobCopyStatus>("idle");
  const [toolbar, setToolbar] = useState<JobToolbarAttachment | null>(null);
  const attachToolbar = useCallback((root: HTMLDivElement | null) => {
    if (!root) return;
    const attachment = attachJobToolbar(root);
    setToolbar(attachment);
    return () => attachment?.destroy();
  }, []);
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
  let layoutError: string | null = null;
  if (props.forceValidation) {
    try {
      assertJobLayout(
        String(field.serialize(props.value, { slug: undefined }).value ?? ""),
      );
    } catch (cause) {
      layoutError =
        cause instanceof Error
          ? cause.message
          : keystaticUiText("Check the section content.");
    }
  }
  const message = error ?? requiredError ?? layoutError;
  const update: InputProps["onChange"] = (value) => {
    try {
      value = prepareJobEditorState(value, field);
      const serialized = field.serialize(value, { slug: undefined });
      validateContentImages(serialized);
      // Allow unfinished blocks while typing, but keep sections at document level.
      assertJobLayout(String(serialized.value ?? ""), { checkContent: false });
      setError(null);
      setCopyStatus("idle");
      props.onChange(value);
    } catch (cause) {
      setError(
        cause instanceof JobImageError
          ? cause.reason
          : cause instanceof JobLayoutError
            ? cause.message
            : keystaticUiText("The content could not be updated."),
      );
      setRejectedUploads((count) => count + 1);
    }
  };

  async function copyContent() {
    try {
      const content = serializeJobClipboard(props.value, document);
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([content.html], { type: "text/html" }),
          "text/plain": new Blob([content.text], { type: "text/plain" }),
        }),
      ]);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <JobEditorContext.Provider value={{ state: props.value, onChange: update }}>
      <div
        key={rejectedUploads}
        data-job-content-input
        ref={attachToolbar}
        aria-describedby={message ? errorId : undefined}
        className={cn(
          // Keystatic renders the accessible label as the first span in its
          // field wrapper. Keep its ID and match the other HOKAMI field labels.
          "[&>div>span:first-child]:font-mono! [&>div>span:first-child]:text-xs! [&>div>span:first-child]:leading-body! [&>div>span:first-child]:font-normal! [&>div>span:first-child]:tracking-label! [&>div>span:first-child]:text-text-secondary! [&>div>span:first-child]:uppercase",
          "min-w-0 font-sans text-text-primary [&_[data-keystatic-editor=content]]:font-sans! [&_[data-keystatic-editor=content]]:text-base! [&_[data-keystatic-editor=content]]:leading-body! [&_[data-keystatic-editor=content]_h2]:font-display! [&_[data-keystatic-editor=content]_h2]:text-3xl! [&_[data-keystatic-editor=content]_h2]:font-semibold! [&_[data-keystatic-editor=content]_h2]:uppercase! [&_[data-keystatic-editor=content]_h3]:font-display! [&_[data-keystatic-editor=content]_h3]:text-2xl! [&_[data-keystatic-editor=content]_h3]:font-semibold! [&_[data-keystatic-editor=content]_h3]:uppercase! [&_[data-keystatic-editor=content]_h4]:font-display! [&_[data-keystatic-editor=content]_h4]:text-lg! [&_[data-keystatic-editor=content]_h4]:font-semibold! [&_[data-keystatic-editor=content]_h4]:uppercase!",
        )}
      >
        <NativeInput {...props} onChange={update} />
        {toolbar && (
          <JobEditorActions
            toolbar={toolbar}
            onCopy={copyContent}
            copyStatus={copyStatus}
          />
        )}
        {message ? (
          <Text
            variant="small"
            id={errorId}
            role="alert"
            className="mt-2 text-feedback-error-text"
          >
            {message}
          </Text>
        ) : null}
      </div>
    </JobEditorContext.Provider>
  );
}
