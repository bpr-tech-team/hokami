"use client";

import { keystaticUiText } from "@/i18n/keystatic-ui";

import { useContext, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getJobSections,
  moveJobSection,
  setJobSectionColumns,
} from "@/lib/jobs/editor-layout";
import { JobEditorContext } from "./job-editor-context";

type SectionValue = {
  readonly id: string;
  readonly tone: "default" | "subtle";
};

export function JobSectionInput({
  value,
  onChange,
  onRemove,
  children,
}: {
  value: SectionValue;
  onChange(value: SectionValue): void;
  onRemove(): void;
  children: ReactNode;
}) {
  const editor = useContext(JobEditorContext);
  if (!editor) return <div>{children}</div>;
  const sections = getJobSections(editor.state);
  const section = sections.find(
    ({ node }) => node.attrs.props.value.id === value.id,
  );
  const columns = section?.node.childCount ?? 1;
  return (
    <div className="my-6 border border-border-subtle text-text-primary">
      <div
        contentEditable={false}
        className="flex flex-wrap items-center gap-2 border-b border-border-subtle bg-surface-default p-3 font-sans text-sm"
      >
        <fieldset className="flex min-w-0 flex-wrap items-center gap-1 border-0 p-0">
          <legend className="sr-only">
            {keystaticUiText("Number of columns")}
          </legend>
          {([1, 2] as const).map((count) => (
            <Button
              key={count}
              type="button"
              variant={columns === count ? "secondary" : "ghost"}
              size="xs"
              showIcon={false}
              aria-pressed={columns === count}
              onClick={() =>
                editor.onChange(
                  setJobSectionColumns(editor.state, value.id, count),
                )
              }
            >
              {count === 1
                ? keystaticUiText("One column")
                : keystaticUiText("Two columns")}
            </Button>
          ))}
        </fieldset>
        <fieldset className="flex min-w-0 flex-wrap items-center gap-1 border-0 p-0">
          <legend className="sr-only">
            {keystaticUiText("Section background")}
          </legend>
          {(["default", "subtle"] as const).map((tone) => (
            <Button
              key={tone}
              type="button"
              variant={value.tone === tone ? "secondary" : "ghost"}
              size="xs"
              showIcon={false}
              aria-pressed={value.tone === tone}
              onClick={() => onChange({ ...value, tone })}
            >
              {tone === "default"
                ? keystaticUiText("White")
                : keystaticUiText("Subtle")}
            </Button>
          ))}
        </fieldset>
        <div className="ml-auto flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={keystaticUiText("Move section up")}
            disabled={!section || section.index === 0}
            onClick={() =>
              editor.onChange(moveJobSection(editor.state, value.id, -1))
            }
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={keystaticUiText("Move section down")}
            disabled={
              !section || section.index === editor.state.doc.childCount - 1
            }
            onClick={() =>
              editor.onChange(moveJobSection(editor.state, value.id, 1))
            }
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={keystaticUiText("Remove section")}
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
      <div data-job-columns={columns} className="@container/job-section">
        <div
          className={
            value.tone === "subtle"
              ? "bg-surface-subtle p-6"
              : "bg-surface-default p-6"
          }
        >
          <div className="grid gap-6 [&_[data-job-column]]:min-w-0 [&_[data-job-column]]:border [&_[data-job-column]]:border-dashed [&_[data-job-column]]:border-border-subtle [&_[data-job-column]]:p-4 [[data-job-columns='2']_&]:@2xl/job-section:grid-cols-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
