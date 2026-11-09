import { DOMSerializer } from "prosemirror-model";
import type { JobEditorState } from "./editor-layout";

export function serializeJobClipboard(
  state: JobEditorState,
  document: Document,
) {
  const wrapper = document.createElement("div");
  wrapper.appendChild(
    DOMSerializer.fromSchema(state.schema).serializeFragment(
      state.doc.content,
      { document },
    ),
  );
  // The same closed slice marker used by ProseMirror's native clipboard path.
  wrapper.firstElementChild?.setAttribute("data-pm-slice", "0 0 []");
  return {
    html: wrapper.innerHTML,
    text: state.doc.textBetween(0, state.doc.content.size, "\n\n"),
  };
}
