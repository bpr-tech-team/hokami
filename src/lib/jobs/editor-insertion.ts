import { NodeSelection, TextSelection } from "prosemirror-state";
import type { JobEditorState } from "./editor-layout";

// Insert commands replace the current selection. Give selected blocks a new
// text insertion point after them, preserving the block and its uploaded files.
export function prepareJobInsertSelection(
  state: JobEditorState,
): JobEditorState {
  if (!(state.selection instanceof NodeSelection)) return state;
  const end = state.selection.$to;
  const paragraph = state.schema.nodes.paragraph;
  for (let depth = end.depth; depth >= 0; depth--) {
    const index = end.indexAfter(depth);
    if (!end.node(depth).canReplaceWith(index, index, paragraph)) continue;
    // A selected column/table cell may only accept specific sibling types.
    // In that case, step out to the nearest container that accepts text blocks.
    const position = depth === end.depth ? end.pos : end.after(depth + 1);
    const transaction = state.tr.insert(position, paragraph.create());
    transaction.setSelection(
      TextSelection.create(transaction.doc, position + 1),
    );
    return state.apply(transaction);
  }
  return state;
}
