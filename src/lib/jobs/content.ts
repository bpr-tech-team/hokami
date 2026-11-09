import { keystaticUiText } from "@/i18n/keystatic-ui";
import Markdoc from "@markdoc/markdoc";

// Keystatic ships its own Markdoc version. Only share data across that boundary.
type ContentNode = {
  type: string;
  tag?: string;
  attributes: Record<string, unknown>;
  children: readonly ContentNode[];
};

export const REQUIRED_JOB_CONTENT = keystaticUiText(
  "Please enter the main description in English.",
);

export function hasJobContent(node: ContentNode): boolean {
  return (
    (["text", "code", "fence"].includes(node.type) &&
      typeof node.attributes.content === "string" &&
      node.attributes.content.trim().length > 0) ||
    ((node.type === "image" ||
      (node.type === "tag" &&
        ["JobPhoto", "JobEmbed"].includes(node.tag ?? ""))) &&
      Boolean(node.attributes.src)) ||
    node.children.some(hasJobContent)
  );
}

export function serializeJobContent(node: ContentNode) {
  return JSON.stringify(node);
}

export function deserializeJobContent(value: string) {
  const node = Markdoc.Ast.fromJSON(value);
  if (Array.isArray(node))
    throw new Error("Expected one job content document.");
  return node;
}

export function assertJobContent(value: string) {
  if (!hasJobContent(Markdoc.parse(value))) {
    throw new Error(REQUIRED_JOB_CONTENT);
  }
}
