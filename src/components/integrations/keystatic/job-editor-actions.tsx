"use client";

import { keystaticUiText } from "@/i18n/keystatic-ui";

import { createPortal } from "react-dom";
import { useRef } from "react";
import { Check, Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography/text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getJobInsertItems,
  type JobToolbarAttachment,
} from "@/lib/jobs/editor-toolbar";
import { useJobEditor } from "./job-editor-context";
import { prepareJobInsertSelection } from "@/lib/jobs/editor-insertion";

export type JobCopyStatus = "idle" | "success" | "error";

export function JobEditorActions({
  toolbar,
  onCopy,
  copyStatus = "idle",
}: {
  toolbar: JobToolbarAttachment;
  onCopy(): void;
  copyStatus?: JobCopyStatus;
}) {
  const { state, onChange } = useJobEditor();
  const returnToEditor = useRef(false);
  const copyMessage =
    copyStatus === "success"
      ? keystaticUiText("Copied. Paste into another language's description.")
      : copyStatus === "error"
        ? keystaticUiText(
            "Copy failed. Check the browser's clipboard permissions.",
          )
        : "";
  function insert(id: string) {
    returnToEditor.current = true;
    if (id === "table") return toolbar.table();
    const insertionState = prepareJobInsertSelection(state);
    const type = insertionState.schema.nodes[id];
    const command = type?.spec.insertMenu?.command(type);
    command?.(
      insertionState,
      (transaction: Parameters<typeof state.apply>[0]) =>
        onChange(insertionState.apply(transaction)),
    );
  }
  return createPortal(
    <>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="border-0"
        showIcon={false}
        showTraceDots={false}
        aria-label={keystaticUiText("Copy content")}
        title={
          copyMessage || keystaticUiText("Copy content for another language")
        }
        onClick={onCopy}
      >
        {copyStatus === "success" ? (
          <Check className="size-4" />
        ) : (
          <Copy className="size-4" />
        )}
        <span className="sr-only tablet:not-sr-only">
          {copyStatus === "success"
            ? keystaticUiText("Copied")
            : keystaticUiText("Copy content")}
        </span>
      </Button>
      <Text variant="small" tone="secondary" role="status" className="sr-only">
        {copyMessage}
      </Text>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="border-0"
              showTraceDots={false}
              aria-label={keystaticUiText("Insert content")}
              title={keystaticUiText("Insert content")}
            />
          }
        >
          <Plus className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-max min-w-56"
          finalFocus={() => {
            if (!returnToEditor.current) return true;
            returnToEditor.current = false;
            return toolbar.focusTarget ?? true;
          }}
        >
          {getJobInsertItems(state).map(({ id, label, icon }) => (
            <DropdownMenuItem
              key={id}
              label={label}
              className="cursor-pointer gap-2 data-highlighted:bg-surface-accent-subtle data-highlighted:text-text-accent"
              onClick={() => insert(id)}
            >
              <span
                aria-hidden="true"
                className="flex size-4 shrink-0 items-center justify-center"
              >
                {icon}
              </span>
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>,
    toolbar.element,
  );
}
