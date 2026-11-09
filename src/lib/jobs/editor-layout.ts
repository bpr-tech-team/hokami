import type { fields } from "@keystatic/core";
import { Selection } from "prosemirror-state";
import { jobEmbedSource, readIframeEmbed } from "./embed";

type ContentField = ReturnType<typeof fields.markdoc.inline>;
export type JobEditorState = ReturnType<ContentField["defaultValue"]>;
type EditorNode = JobEditorState["doc"];

export type JobTemplate = "one" | "two" | "duties" | "requirements";

const insertionTemplates: Partial<Record<string, JobTemplate>> = {
  JobTwoColumns: "two",
  JobDuties: "duties",
  JobRequirements: "requirements",
};

// Menu entries are insertion commands, not a second stored content format.
// Expand them using the field's own parser so assets and schema identities stay intact.
export function prepareJobEditorState(
  state: JobEditorState,
  field: Pick<ContentField, "parse">,
): JobEditorState {
  state = prepareJobEmbeds(state, field);
  state = prepareJobBlockCommands(state);
  for (;;) {
    let insertion:
      | { node: EditorNode; position: number; template?: JobTemplate }
      | undefined;
    state.doc.descendants((node, position) => {
      const template = insertionTemplates[node.type.name];
      if (
        !insertion &&
        (template ||
          (node.type.name === "JobSection" &&
            state.doc.resolve(position).depth > 0))
      )
        insertion = { node, position, template };
    });
    if (!insertion) break;
    const { node, position, template } = insertion;
    const content = template
      ? field.parse(jobTemplateContent(template), {
          other: new Map(),
          external: new Map(),
          slug: undefined,
        }).doc.content
      : node;
    const resolved = state.doc.resolve(position);
    const transaction = state.tr;
    if (resolved.depth > 0) {
      // A section requested from inside a column becomes its next sibling.
      const afterParent = resolved.after(1);
      transaction.delete(position, position + node.nodeSize);
      transaction.insert(transaction.mapping.map(afterParent), content);
    } else {
      transaction.replaceWith(position, position + node.nodeSize, content);
    }
    state = state.apply(transaction);
  }
  return identifyJobSections(prepareJobChecklists(state));
}

function prepareJobEmbeds(
  state: JobEditorState,
  field: Pick<ContentField, "parse">,
) {
  const transaction = state.tr;
  const replacements: {
    position: number;
    node: EditorNode;
    replacement: EditorNode;
  }[] = [];
  state.doc.descendants((node, position) => {
    if (node.type.name === "paragraph") {
      let plain = true;
      node.forEach((child) => {
        if (!child.isText || child.marks.length) plain = false;
      });
      if (!plain) return;
      const embed = readIframeEmbed(node.textContent);
      if (!embed) return;
      const parsed = field.parse(
        `{% JobEmbed src=${JSON.stringify(embed.src)} title=${JSON.stringify(embed.title)} /%}`,
        { other: new Map(), external: new Map(), slug: undefined },
      );
      if (parsed.doc.firstChild)
        replacements.push({
          position,
          node,
          replacement: parsed.doc.firstChild,
        });
    }
    if (node.type.name === "JobEmbed") {
      const props = node.attrs.props;
      try {
        const source = jobEmbedSource(props.value.src);
        const frame = readIframeEmbed(props.value.src);
        const title =
          frame &&
          (!props.value.title.trim() || props.value.title === "Vložený obsah")
            ? frame.title
            : props.value.title;
        if (source !== props.value.src || title !== props.value.title)
          transaction.setNodeAttribute(position, "props", {
            ...props,
            value: { ...props.value, src: source, title },
          });
      } catch {
        /* Keep unfinished input editable; saving validates the source. */
      }
    }
  });
  for (const { position, node, replacement } of replacements.reverse())
    transaction.replaceWith(position, position + node.nodeSize, replacement);
  return transaction.docChanged ? state.apply(transaction) : state;
}

function prepareJobBlockCommands(state: JobEditorState): JobEditorState {
  const transaction = state.tr;
  let quotePosition: number | undefined;
  state.doc.descendants((node, position) => {
    const nativeType =
      node.type.name === "JobDivider"
        ? state.schema.nodes.divider
        : node.type.name === "JobQuote"
          ? state.schema.nodes.blockquote
          : undefined;
    // Both commands have the native block's shape, so changing the node type
    // retains inline marks, children, assets and the caret's mapped position.
    if (nativeType) transaction.setNodeMarkup(position, nativeType);
    if (node.type.name === "JobQuote") quotePosition ??= position;
  });
  if (quotePosition !== undefined)
    transaction.setSelection(
      Selection.near(transaction.doc.resolve(quotePosition + 1)),
    );
  return transaction.docChanged ? state.apply(transaction) : state;
}

function prepareJobChecklists(state: JobEditorState): JobEditorState {
  const paragraphs: { position: number; size: number }[] = [];
  state.doc.descendants((node, position) => {
    if (node.type.name !== "JobChecklist") return;
    node.forEach((child, offset) => {
      if (child.type.name === "paragraph")
        paragraphs.push({
          position: position + 1 + offset,
          size: child.nodeSize,
        });
    });
  });
  if (!paragraphs.length) return state;
  const transaction = state.tr;
  // Wrap rather than replace: ProseMirror maps the caret and selection through
  // the added list/item boundaries, preserving immediate typing and undo.
  for (const { position, size } of paragraphs.sort(
    (a, b) => b.position - a.position,
  )) {
    const range = transaction.doc
      .resolve(position)
      .blockRange(transaction.doc.resolve(position + size));
    if (range)
      transaction.wrap(range, [
        { type: state.schema.nodes.unordered_list },
        { type: state.schema.nodes.list_item },
      ]);
  }
  const joins: number[] = [];
  transaction.doc.descendants((node, position) => {
    if (node.type.name !== "JobChecklist") return;
    let previousWasList = false;
    node.forEach((child, offset) => {
      const isList = child.type.name === "unordered_list";
      if (previousWasList && isList) joins.push(position + 1 + offset);
      previousWasList = isList;
    });
  });
  for (const position of joins.sort((a, b) => b - a))
    transaction.join(position);
  return state.apply(transaction);
}

// Section IDs identify editor operations; they never become public anchor URLs.
export function identifyJobSections(state: JobEditorState): JobEditorState {
  const ids = new Set<string>();
  const transaction = state.tr;
  state.doc.descendants((node, position) => {
    if (node.type.name !== "JobSection") return;
    const props = node.attrs.props;
    const id = props.value.id;
    if (typeof id === "string" && id && !ids.has(id)) {
      ids.add(id);
      return;
    }
    const nextId = crypto.randomUUID();
    ids.add(nextId);
    transaction.setNodeAttribute(position, "props", {
      ...props,
      value: { ...props.value, id: nextId },
    });
  });
  return transaction.docChanged ? state.apply(transaction) : state;
}

export function getJobSections(state: JobEditorState) {
  const sections: { node: EditorNode; position: number; index: number }[] = [];
  state.doc.forEach((node, position, index) => {
    if (node.type.name === "JobSection")
      sections.push({ node, position, index });
  });
  return sections;
}

export function setJobSectionColumns(
  state: JobEditorState,
  id: string,
  count: 1 | 2,
): JobEditorState {
  const section = getJobSections(state).find(
    ({ node }) => node.attrs.props.value.id === id,
  );
  if (!section || section.node.childCount === count) return state;
  const columns: EditorNode[] = [];
  section.node.forEach((column) => columns.push(column));
  if (count === 1) {
    const content: EditorNode[] = [];
    for (const column of columns)
      column.forEach((child) => content.push(child));
    columns.splice(0, columns.length, columns[0].type.create(null, content));
  } else {
    const column = state.schema.nodes.JobColumn.createAndFill();
    if (!column) return state;
    columns.push(column);
  }
  return state.apply(
    state.tr.replaceWith(
      section.position,
      section.position + section.node.nodeSize,
      section.node.type.create(section.node.attrs, columns, section.node.marks),
    ),
  );
}

export function moveJobSection(
  state: JobEditorState,
  id: string,
  direction: -1 | 1,
): JobEditorState {
  const section = getJobSections(state).find(
    ({ node }) => node.attrs.props.value.id === id,
  );
  if (!section) return state;
  const otherIndex = section.index + direction;
  if (otherIndex < 0 || otherIndex >= state.doc.childCount) return state;
  const other = state.doc.child(otherIndex);
  const start =
    direction === -1 ? section.position - other.nodeSize : section.position;
  return state.apply(
    state.tr.replaceWith(
      start,
      start + section.node.nodeSize + other.nodeSize,
      direction === -1 ? [section.node, other] : [other, section.node],
    ),
  );
}

export function jobTemplateContent(template: JobTemplate) {
  const checklist = "{% JobChecklist %}\n\n- \n\n{% /JobChecklist %}";
  const first =
    template === "duties"
      ? `## Responsibilities\n\n${checklist}`
      : template === "requirements"
        ? `## Requirements\n\n${checklist}`
        : "";
  const second =
    template === "duties"
      ? "{% JobPhoto /%}"
      : template === "requirements"
        ? `## What we offer\n\n${checklist}`
        : "";
  const columns = [first, ...(template === "one" ? [] : [second])]
    .map((content) => `{% JobColumn %}\n\n${content}\n\n{% /JobColumn %}`)
    .join("\n\n");
  return `{% JobSection id="${crypto.randomUUID()}" tone="${template === "requirements" ? "subtle" : "default"}" %}\n\n${columns}\n\n{% /JobSection %}`;
}
