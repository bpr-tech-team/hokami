import { keystaticUiText } from "@/i18n/keystatic-ui";
import Markdoc, { type Node } from "@markdoc/markdoc";
import { jobEmbedSource } from "./embed";

export function isJobImagePath(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\/images\/jobs\/[a-z0-9/_-]+\.(png|jpe?g|webp)$/i.test(value)
  );
}

export class JobLayoutError extends Error {}

export function assertJobLayout(value: string, { checkContent = true } = {}) {
  const root = Markdoc.parse(value);
  function visit(node: Node, parent: Node) {
    const tag = node.tag;
    if (checkContent && tag === "JobEmbed") {
      if (typeof node.attributes.src !== "string")
        throw new JobLayoutError(
          keystaticUiText("Enter the embedded content source."),
        );
      jobEmbedSource(node.attributes.src);
      if (
        typeof node.attributes.title !== "string" ||
        !node.attributes.title.trim()
      )
        throw new JobLayoutError(keystaticUiText("Name the embedded content."));
    }
    if (tag === "JobSection") {
      if (parent.type !== "document")
        throw new JobLayoutError(
          keystaticUiText(
            "A section can only be inserted outside columns and other blocks.",
          ),
        );
      if (
        node.children.length < 1 ||
        node.children.length > 2 ||
        node.children.some((child) => child.tag !== "JobColumn")
      ) {
        throw new JobLayoutError(
          keystaticUiText("A section must contain one or two columns."),
        );
      }
      if (![undefined, "default", "subtle"].includes(node.attributes.tone))
        throw new JobLayoutError(
          keystaticUiText("Choose a supported section background."),
        );
    }
    if (tag === "JobColumn" && parent.tag !== "JobSection")
      throw new JobLayoutError(
        keystaticUiText("A column must be inside a section."),
      );
    if (
      checkContent &&
      tag === "JobChecklist" &&
      node.children.some(
        (child) => child.type !== "list" || child.attributes.ordered,
      )
    ) {
      throw new JobLayoutError(
        keystaticUiText("Insert a bulleted list into the checklist."),
      );
    }
    if (checkContent && tag === "JobPhoto") {
      if (!isJobImagePath(node.attributes.src))
        throw new JobLayoutError(
          keystaticUiText("Select a PNG, JPG or WEBP photograph."),
        );
      if (
        typeof node.attributes.alt !== "string" ||
        !node.attributes.alt.trim()
      )
        throw new JobLayoutError(
          keystaticUiText("Enter alternative text for the photograph."),
        );
    }
    for (const child of node.children) visit(child, node);
  }
  for (const child of root.children) visit(child, root);
}
