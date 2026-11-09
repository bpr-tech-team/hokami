import "./keystatic-browser.mts";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Window } from "happy-dom";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import type { JobCopyStatus } from "../../src/components/integrations/keystatic/job-editor-actions";

const window = new Window();
const savedGlobals = new Map<string, PropertyDescriptor | undefined>();
const values: Record<string, unknown> = {
  window,
  document: window.document,
  navigator: window.navigator,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  SVGElement: window.SVGElement,
  Document: window.Document,
  DocumentFragment: window.DocumentFragment,
  Event: window.Event,
  MouseEvent: window.MouseEvent,
  KeyboardEvent: window.KeyboardEvent,
  PointerEvent: window.PointerEvent,
  FocusEvent: window.FocusEvent,
  Range: window.Range,
  Text: window.Text,
  HTMLInputElement: window.HTMLInputElement,
  HTMLTextAreaElement: window.HTMLTextAreaElement,
  FileReader: window.FileReader,
  URL: window.URL,
  Blob: window.Blob,
  ClipboardItem: window.ClipboardItem,
  Node: window.Node,
  NodeFilter: window.NodeFilter,
  ShadowRoot: window.ShadowRoot,
  MutationObserver: window.MutationObserver,
  ResizeObserver: window.ResizeObserver,
  getComputedStyle: window.getComputedStyle.bind(window),
  requestAnimationFrame: window.requestAnimationFrame.bind(window),
  cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
  IS_REACT_ACT_ENVIRONMENT: true,
};
for (const [key, value] of Object.entries(values)) {
  savedGlobals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value,
  });
}

const { jobContentField } = await import("../../src/lib/jobs/content-field");
const { jobsReaderConfig } = await import("../../src/lib/jobs/collection");
// Test-only app context: Keystatic does not export a standalone editor harness.
const { a6: ConfigContext } = createRequire(import.meta.url)(
  fileURLToPath(
    new URL(
      "../../node_modules/@keystatic/core/dist/index-5d64e651.js",
      import.meta.url,
    ),
  ),
);
const field = jobContentField();
const { KeystarProvider } = createRequire(import.meta.url)("@keystar/ui/core");
const markup = renderToStaticMarkup(
  createElement(
    KeystarProvider,
    null,
    createElement(
      ConfigContext.Provider,
      {
        value: jobsReaderConfig,
      },
      createElement(field.Input, {
        value: field.defaultValue(),
        onChange: () => {},
        autoFocus: false,
        forceValidation: false,
      }),
    ),
  ),
);
window.document.body.innerHTML = markup;
const toolbar = window.document.querySelector(
  '[aria-label="Možnosti formátování"]',
);
assert.ok(toolbar);
const { attachJobToolbar, getJobInsertItems } =
  await import("../../src/lib/jobs/editor-toolbar");
const input = window.document.querySelector("[data-job-content-input]");
assert.ok(input);
const attachment = attachJobToolbar(input as unknown as HTMLElement);
assert.ok(attachment, "attaches to the real Keystatic toolbar row");
for (const label of [
  "Citace",
  "Kód",
  "Blok kódu",
  "Vymazat formátování",
  "Obrázek",
  "Tabulka",
  "Oddělovací čára",
]) {
  const button: import("happy-dom").HTMLButtonElement | null =
    toolbar.querySelector(`[aria-label="${label}"]`);
  assert.ok(button, label);
  assert.equal(
    button.getAttribute("aria-hidden"),
    "true",
    `${label} is removed from the visible toolbar`,
  );
  assert.equal(button.style.getPropertyValue("display"), "none");
  assert.equal(
    button.style.getPropertyPriority("display"),
    "important",
    "vendor's unlayered display rules cannot override hiding",
  );
}
assert.ok(toolbar.querySelector('[aria-label="Odkaz"]'));
assert.equal(
  toolbar.querySelector('[aria-label="Odkaz"]')?.getAttribute("aria-hidden"),
  null,
);
assert.equal(
  toolbar.querySelector('[aria-label="Tučné"]')?.getAttribute("aria-hidden"),
  null,
);
let tables = 0;
toolbar
  .querySelector('[aria-label="Tabulka"]')
  ?.addEventListener("click", () => {
    tables++;
  });
attachment.table();
assert.equal(tables, 1);
const items = getJobInsertItems(field.defaultValue());
assert.equal(items.filter((item) => item.label === "Obrázek").length, 1);
assert.ok(items.some((item) => item.id === "JobPhoto"));
for (const id of ["image", "JobDuties", "JobRequirements"])
  assert.ok(!items.some((item) => item.id === id), `${id} is not offered in +`);
assert.deepEqual(
  items.slice(0, 2).map(({ label }) => label),
  ["Jeden sloupec", "Dva sloupce"],
);
assert.deepEqual(
  items.slice(2).map(({ label }) => label),
  items
    .slice(2)
    .map(({ label }) => label)
    .sort(new Intl.Collator("cs").compare),
);

// Mount the real replacement controls against the native toolbar markup.
const { act, StrictMode } = await import("react");
const { createRoot } = await import("react-dom/client");
const { JobEditorActions } =
  await import("../../src/components/integrations/keystatic/job-editor-actions");
// The TSX components use the CommonJS JSON instance in this fixture.
const messages: typeof import("../../src/i18n/keystatic-ui-messages.json") =
  createRequire(import.meta.url)("../../src/i18n/keystatic-ui-messages.json");
const { JobEditorContext } =
  await import("../../src/components/integrations/keystatic/job-editor-context");
const { prepareJobEditorState } =
  await import("../../src/lib/jobs/editor-layout");
const host = window.document.createElement("div");
window.document.body.appendChild(host);
const reactRoot = createRoot(host as unknown as HTMLElement);
let state = field.defaultValue();
let copied = 0;
let copyStatus: JobCopyStatus = "idle";
const view = () =>
  createElement(
    JobEditorContext.Provider,
    {
      value: {
        state,
        onChange(next) {
          state = prepareJobEditorState(next, field);
          reactRoot.render(view());
        },
      },
    },
    createElement(JobEditorActions, {
      toolbar: attachment,
      copyStatus,
      onCopy() {
        copied++;
      },
    }),
  );
await act(async () => reactRoot.render(view()));
const copy = input.querySelector<import("happy-dom").HTMLButtonElement>(
  '[aria-label="Kopírovat obsah"]',
);
const plus = input.querySelector<import("happy-dom").HTMLButtonElement>(
  '[aria-label="Vložit obsah"]',
);
assert.ok(copy && plus);
assert.equal(
  copy.closest("[data-job-editor-actions]"),
  plus.closest("[data-job-editor-actions]"),
);
assert.ok(
  copy.closest('[data-keystatic-editor="toolbar"]'),
  "copy is inside the editor toolbar beside +",
);
const initialBodyOverflow = window.getComputedStyle(
  window.document.body,
).overflow;
await act(async () => plus.click());
const menu = window.document.querySelector('[role="menu"]');
assert.ok(menu, "+ opens an accessible menu");
assert.equal(
  window.document.querySelector('[role="presentation"][data-base-ui-inert]'),
  null,
  "the insert menu does not intercept interactions with the rest of the form",
);
assert.equal(
  window.getComputedStyle(window.document.body).overflow,
  initialBodyOverflow,
  "the insert menu does not add a page scroll lock",
);
assert.deepEqual(
  [...menu.querySelectorAll('[role="menuitem"]')].map(
    (item) => item.textContent,
  ),
  items.map((item) => item.label),
  "only names, with columns first and remaining items alphabetized",
);
for (const item of menu.querySelectorAll('[role="menuitem"]')) {
  assert.ok(
    item.querySelector("svg"),
    `the ${item.textContent} item keeps its icon`,
  );
}
await act(async () =>
  [
    ...menu.querySelectorAll<import("happy-dom").HTMLElement>(
      '[role="menuitem"]',
    ),
  ]
    .find((item) => item.textContent === "Oddělovací čára")!
    .click(),
);
assert.ok(state.doc.firstChild?.type.name === "divider");
await act(async () => copy.click());
assert.equal(copied, 1);
const copiedMessageKey = "Copied. Paste into another language's description.";
const originalCopiedMessage = messages.cs[copiedMessageKey];
try {
  // A translation can describe success without starting with the button label.
  messages.cs[copiedMessageKey] = "Obsah je nyní ve schránce.";
  copyStatus = "success";
  await act(async () => reactRoot.render(view()));
  assert.equal(copy.textContent, messages.cs.Copied);
  assert.ok(copy.querySelector(".lucide-check"));
  assert.equal(copy.title, messages.cs[copiedMessageKey]);
  assert.equal(input.querySelector('[role="status"]')?.textContent, copy.title);
} finally {
  messages.cs[copiedMessageKey] = originalCopiedMessage;
}
copyStatus = "error";
await act(async () => reactRoot.render(view()));
assert.equal(copy.textContent, "Kopírovat obsah");
assert.ok(copy.querySelector(".lucide-copy"));
assert.equal(
  copy.title,
  messages.cs["Copy failed. Check the browser's clipboard permissions."],
);
copyStatus = "idle";
await act(async () => reactRoot.render(view()));
assert.equal(input.querySelector('[role="status"]')?.textContent, "");
await act(async () => reactRoot.unmount());
attachment.destroy();
assert.equal(
  toolbar
    .querySelector<import("happy-dom").HTMLButtonElement>(
      '[aria-label="Citace"]',
    )
    ?.style.getPropertyValue("display"),
  "",
);
assert.equal(input.querySelector("[data-job-editor-actions]"), null);

// Exercise the automatic ref attachment and the actual ProseMirror table command.
const editorHost = window.document.createElement("div");
window.document.body.appendChild(editorHost);
const editorRoot = createRoot(editorHost as unknown as HTMLElement);
let editorState = field.defaultValue();
function editorView() {
  return createElement(
    StrictMode,
    null,
    createElement(
      KeystarProvider,
      null,
      createElement(
        ConfigContext.Provider,
        {
          value: jobsReaderConfig,
        },
        createElement(field.Input, {
          value: editorState,
          autoFocus: false,
          forceValidation: false,
          onChange(next) {
            editorState = next;
            editorRoot.render(editorView());
          },
        }),
      ),
    ),
  );
}
await act(async () => editorRoot.render(editorView()));
const editorPlus = editorHost.querySelector<
  import("happy-dom").HTMLButtonElement
>('[aria-label="Vložit obsah"]');
assert.ok(editorPlus, "the live editor attaches its own toolbar actions");
await act(async () => editorPlus.click());
const tableItem = [
  ...window.document.querySelectorAll<import("happy-dom").HTMLElement>(
    '[role="menuitem"]',
  ),
].find((item) => item.textContent === "Tabulka");
assert.ok(tableItem);
await act(async () => tableItem.click());
let tableCount = 0;
editorState.doc.descendants((node) => {
  if (node.type.name === "table") tableCount++;
});
assert.equal(
  tableCount,
  1,
  "table menu item dispatches the actual native editor command",
);
assert.ok(
  editorHost
    .querySelector('[aria-label="Kopírovat obsah"]')
    ?.closest('[data-keystatic-editor="toolbar"]'),
);
const nativeCopy = editorHost.querySelector<
  import("happy-dom").HTMLButtonElement
>('[aria-label="Kopírovat obsah"]');
assert.ok(nativeCopy);
await act(async () => nativeCopy.click());
const clipboardItems = await window.navigator.clipboard.read();
assert.deepEqual(clipboardItems[0]?.types.sort(), ["text/html", "text/plain"]);
assert.match(
  await (await clipboardItems[0].getType("text/html")).text(),
  /<table/,
);

// A selected block must not make its own insert item a silent no-op.
const { NodeSelection } = createRequire(import.meta.url)(
  "prosemirror-state",
) as typeof import("prosemirror-state");
editorState = field.parse(
  '{% JobPhoto alt="Keep original photo" /%}\n\nKeep surrounding text.',
  { other: new Map(), external: new Map(), slug: undefined },
);
const originalPhoto = editorState.doc.firstChild!.toJSON();
editorState = editorState.apply(
  editorState.tr.setSelection(NodeSelection.create(editorState.doc, 0)),
);
await act(async () => editorRoot.render(editorView()));
await act(async () =>
  editorHost
    .querySelector<import("happy-dom").HTMLButtonElement>(
      '[aria-label="Vložit obsah"]',
    )!
    .click(),
);
const photoItem = [
  ...window.document.querySelectorAll<import("happy-dom").HTMLElement>(
    '[role="menuitem"]',
  ),
].find((item) => item.textContent === "Obrázek");
assert.ok(photoItem);
await act(async () => photoItem.click());
let photoCount = 0;
editorState.doc.descendants((node) => {
  if (node.type.name === "JobPhoto") photoCount++;
});
assert.equal(
  photoCount,
  2,
  "clicking Photo after selecting a photo inserts another photo",
);
assert.deepEqual(editorState.doc.firstChild!.toJSON(), originalPhoto);
assert.match(editorState.doc.textContent, /Keep surrounding text/);

async function pointerClick(target: import("happy-dom").HTMLElement) {
  const down = { bubbles: true, cancelable: true, button: 0, buttons: 1 };
  await act(async () =>
    target.dispatchEvent(
      new window.PointerEvent("pointerdown", {
        ...down,
        pointerType: "mouse",
        pointerId: 1,
        isPrimary: true,
      }),
    ),
  );
  await act(async () => {
    const event = new window.MouseEvent("mousedown", { ...down, detail: 1 });
    if (target.dispatchEvent(event)) {
      const focusable = target.closest('[role="menuitem"],button') ?? target;
      if (focusable instanceof window.HTMLElement) focusable.focus();
    }
  });
  await act(async () =>
    target.dispatchEvent(
      new window.PointerEvent("pointerup", {
        ...down,
        buttons: 0,
        pointerType: "mouse",
        pointerId: 1,
        isPrimary: true,
      }),
    ),
  );
  await act(async () =>
    target.dispatchEvent(
      new window.MouseEvent("mouseup", { ...down, buttons: 0, detail: 1 }),
    ),
  );
  await act(async () =>
    target.dispatchEvent(
      new window.MouseEvent("click", { ...down, buttons: 0, detail: 1 }),
    ),
  );
}

// Every custom insert item must work from a selected block, including clicks
// on its decorative icon rather than only programmatic clicks on its label.
for (const selected of [
  '{% JobPhoto alt="Keep original photo" /%}',
  '{% JobEmbed src="https://video.example/embed" title="Keep original embed" /%}',
  '{% JobSection id="original" %}\n{% JobColumn %}\nKeep original column text.\n{% /JobColumn %}\n{% /JobSection %}',
]) {
  for (const item of getJobInsertItems(field.defaultValue()).filter(
    (item) => !["image", "table"].includes(item.id),
  )) {
    editorState = field.parse(`${selected}\n\nKeep surrounding text.`, {
      other: new Map(),
      external: new Map(),
      slug: undefined,
    });
    const original = editorState.doc.firstChild!.toJSON();
    const size = editorState.doc.content.size;
    editorState = editorState.apply(
      editorState.tr.setSelection(NodeSelection.create(editorState.doc, 0)),
    );
    await act(async () => editorRoot.render(editorView()));
    await pointerClick(
      editorHost.querySelector<import("happy-dom").HTMLButtonElement>(
        '[aria-label="Vložit obsah"]',
      )!,
    );
    const entry = [
      ...window.document.querySelectorAll<import("happy-dom").HTMLElement>(
        '[role="menuitem"]',
      ),
    ].find((node) => node.textContent === item.label);
    assert.ok(entry, `${item.label} opens in the menu`);
    assert.equal(entry.getAttribute("aria-disabled"), null);
    const icon = entry.querySelector<import("happy-dom").HTMLElement>(
      'span[aria-hidden="true"]',
    );
    assert.ok(icon, `${item.label} has a clickable icon`);
    await pointerClick(icon);
    assert.ok(
      editorState.doc.content.size > size,
      `${item.label} inserts a new block`,
    );
    assert.deepEqual(
      editorState.doc.firstChild!.toJSON(),
      original,
      `${item.label} preserves the selected block`,
    );
    assert.match(editorState.doc.textContent, /Keep surrounding text/);
    assert.equal(
      window.document.querySelector('[role="menu"]'),
      null,
      "a successful insertion closes the menu",
    );
  }
}

// Keyboard selection keeps icons decorative and returns focus to the editor.
editorState = field.parse("Keyboard insertion target.", {
  other: new Map(),
  external: new Map(),
  slug: undefined,
});
await act(async () => editorRoot.render(editorView()));
const keyboardPlus = editorHost.querySelector<
  import("happy-dom").HTMLButtonElement
>('[aria-label="Vložit obsah"]')!;
await act(async () => {
  keyboardPlus.focus();
  keyboardPlus.dispatchEvent(
    new window.KeyboardEvent("keydown", {
      key: "ArrowDown",
      code: "ArrowDown",
      bubbles: true,
      cancelable: true,
    }),
  );
});
const keyboardMenu = window.document.querySelector('[role="menu"]');
assert.ok(keyboardMenu);
const firstItem =
  keyboardMenu.querySelector<import("happy-dom").HTMLElement>(
    '[role="menuitem"]',
  )!;
await act(async () => {
  firstItem.focus();
  firstItem.dispatchEvent(
    new window.KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
      cancelable: true,
    }),
  );
  firstItem.dispatchEvent(
    new window.KeyboardEvent("keyup", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
      cancelable: true,
    }),
  );
});
assert.equal(
  editorState.doc.firstChild?.type.name,
  "JobSection",
  "keyboard selection inserts the first menu entry",
);
assert.equal(window.document.querySelector('[role="menu"]'), null);
assert.equal(
  window.document.activeElement,
  editorHost.querySelector('[data-keystatic-editor="content"]'),
);
await act(async () => editorRoot.unmount());

// Labels are part of the interface even when the document is a translation.
const contentFields = [
  jobsReaderConfig.collections.jobs.schema.content,
  ...Object.values(
    jobsReaderConfig.collections.jobs.schema.translations.fields,
  ).map((translation) => translation.fields.content),
];
for (const contentField of contentFields) {
  const container = window.document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    createElement(
      KeystarProvider,
      null,
      createElement(
        ConfigContext.Provider,
        { value: jobsReaderConfig },
        createElement(contentField.Input, {
          value: contentField.defaultValue(),
          onChange: () => {},
          autoFocus: false,
          forceValidation: false,
        }),
      ),
    ),
  );
  const content = container.querySelector('[data-keystatic-editor="content"]');
  assert.ok(content);
  const labelId = content.getAttribute("aria-labelledby");
  const label = container.querySelector(`[id="${labelId}"]`);
  assert.ok(label, "the editor retains its accessible label association");
  assert.equal(label.textContent.replace(/\s*\*$/, ""), "Hlavní popis");
}
await window.happyDOM.close();
for (const [key, descriptor] of savedGlobals) {
  if (descriptor) Object.defineProperty(globalThis, key, descriptor);
  else Reflect.deleteProperty(globalThis, key);
}
