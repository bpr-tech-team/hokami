import assert from "node:assert/strict";
import { createRequire } from "node:module";
import "./keystatic-browser.mts";

const { jobContentField } = await import("../../src/lib/jobs/content-field");
const { jobsCollection, jobTranslationsField } =
  await import("../../src/lib/jobs/collection");
const {
  getJobSections,
  identifyJobSections,
  jobTemplateContent,
  setJobSectionColumns,
  moveJobSection,
  prepareJobEditorState,
} = await import("../../src/lib/jobs/editor-layout");
const field = jobContentField();
const parse = (
  text: string,
  external = new Map<string, Map<string, Uint8Array>>(),
) => field.parse(text, { other: new Map(), external, slug: undefined });
const serialize = (value: ReturnType<typeof parse>) =>
  field.serialize(value, { slug: undefined });

const oldIframe =
  '<iframe src="https://www.youtube.com/embed/example" title="Company video"></iframe>';
const oldEmbedded = parse(oldIframe);
assert.equal(oldEmbedded.doc.firstChild?.type.name, "JobEmbed");
assert.match(String(serialize(oldEmbedded).value), /JobEmbed/);
field.validate(oldEmbedded);

function insertFromMenu(state: ReturnType<typeof parse>, name: string) {
  const type = state.schema.nodes[name];
  assert.ok(
    type.spec.insertMenu?.forToolbar,
    `${name} is available in the + menu`,
  );
  const command = type.spec.insertMenu.command(type);
  assert.equal(
    command(state, (transaction: Parameters<typeof state.apply>[0]) => {
      state = state.apply(transaction);
    }),
    true,
  );
  return state;
}

for (const [name, nativeType] of [
  ["JobDivider", "divider"],
  ["JobQuote", "blockquote"],
] as const) {
  const inserted = prepareJobEditorState(
    insertFromMenu(parse("Original text"), name),
    field,
  );
  let nativeBlocks = 0;
  inserted.doc.descendants((node) => {
    if (node.type.name === nativeType) nativeBlocks++;
    assert.notEqual(
      node.type.name,
      name,
      "menu commands never become stored component tags",
    );
  });
  assert.equal(nativeBlocks, 1, `${name} inserts the native block`);
  assert.match(inserted.doc.textContent, /Original text/);
  if (nativeType === "blockquote") {
    assert.equal(inserted.selection.$from.parent.type.name, "paragraph");
    const typed = inserted.apply(inserted.tr.insertText("A quotation"));
    assert.match(String(serialize(typed).value), /> A quotation/);
    assert.ok(parse(String(serialize(typed).value)).doc.eq(typed.doc));
  }
}

for (const name of [
  "JobSection",
  "JobTwoColumns",
  "JobDuties",
  "JobRequirements",
]) {
  const initial = parse("Before\n\nAfter");
  const inserted = prepareJobEditorState(insertFromMenu(initial, name), field);
  assert.equal(getJobSections(inserted).length, 1);
  assert.equal(
    getJobSections(inserted)[0].node.childCount,
    name === "JobSection" ? 1 : 2,
  );
  const encoded = String(serialize(inserted).value);
  assert.doesNotMatch(encoded, /JobTwoColumns|JobDuties|JobRequirements/);
  assert.ok(
    encoded.indexOf("JobSection") < encoded.indexOf("After"),
    "insert at cursor, not at document end",
  );
  if (name === "JobDuties")
    assert.match(encoded, /Responsibilities[\s\S]*JobPhoto/);
  if (name === "JobRequirements")
    assert.match(encoded, /Requirements[\s\S]*What we offer/);
}

for (const template of ["one", "two", "duties", "requirements"] as const) {
  const value = parse(jobTemplateContent(template));
  const encoded = serialize(value);
  const restored = parse(String(encoded.value));
  assert.ok(value.doc.eq(restored.doc));
  assert.equal(
    getJobSections(value)[0].node.childCount,
    template === "one" ? 1 : 2,
  );
}

const image = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
let state = parse(
  `{% JobSection id="a" tone="subtle" %}
{% JobColumn %}
## Left heading
Left **bold** text and [link](https://hokami.cz).
{% JobChecklist %}
- A fact
{% /JobChecklist %}
{% /JobColumn %}
{% JobColumn %}
## Right heading
{% JobPhoto src="/images/jobs/test.png" alt="Test photo" /%}
{% /JobColumn %}
{% /JobSection %}

{% JobSection id="b" %}
{% JobColumn %}
Second section.
{% /JobColumn %}
{% /JobSection %}`,
  new Map([["public/images/jobs", new Map([["test.png", image]])]]),
);

const before = serialize(state);
assert.deepEqual(
  before.external.get("public/images/jobs")?.get("test.png"),
  image,
);
field.validate(state);
const { prepareJobInsertSelection } =
  await import("../../src/lib/jobs/editor-insertion");
const { NodeSelection } = createRequire(import.meta.url)(
  "prosemirror-state",
) as typeof import("prosemirror-state");
let photoPosition: number | undefined;
state.doc.descendants((node, position) => {
  if (node.type.name === "JobPhoto") photoPosition = position;
});
assert.notEqual(photoPosition, undefined);
const selectedPhoto = state.apply(
  state.tr.setSelection(NodeSelection.create(state.doc, photoPosition!)),
);
const insertionPoint = prepareJobInsertSelection(selectedPhoto);
const addedPhoto = prepareJobEditorState(
  insertFromMenu(insertionPoint, "JobPhoto"),
  field,
);
assert.deepEqual(
  serialize(addedPhoto).external.get("public/images/jobs")?.get("test.png"),
  image,
  "inserting beside a selected photo retains its uploaded bytes",
);
assert.ok(addedPhoto.doc.textContent.includes("Left heading"));
const originalNodes: unknown[] = [];
getJobSections(state)[0].node.forEach((column) =>
  column.forEach((node) => originalNodes.push(node.toJSON())),
);
state = setJobSectionColumns(state, "a", 1);
assert.equal(getJobSections(state)[0].node.childCount, 1);
assert.deepEqual(
  getJobSections(state)[0].node.firstChild?.content.toJSON(),
  originalNodes,
);
state = setJobSectionColumns(state, "a", 2);
assert.equal(getJobSections(state)[0].node.childCount, 2);
assert.deepEqual(
  getJobSections(state)[0].node.firstChild?.content.toJSON(),
  originalNodes,
);
assert.equal(getJobSections(state)[0].node.lastChild?.textContent, "");
assert.deepEqual(
  serialize(state).external.get("public/images/jobs")?.get("test.png"),
  image,
);

state = moveJobSection(state, "a", 1);
assert.equal(getJobSections(state)[0].node.attrs.props.value.id, "b");
state = moveJobSection(state, "a", -1);
assert.equal(getJobSections(state)[0].node.attrs.props.value.id, "a");
const output = serialize(state);
const restored = parse(
  String(output.value),
  new Map([...output.external].map(([key, files]) => [key, new Map(files)])),
);
assert.ok(state.doc.eq(restored.doc));
field.validate(restored);

const duplicated = parse(
  '{% JobSection id="same" %}\n{% JobColumn /%}\n{% /JobSection %}\n{% JobSection id="same" %}\n{% JobColumn /%}\n{% /JobSection %}',
);
assert.equal(
  new Set(
    getJobSections(duplicated).map(({ node }) => node.attrs.props.value.id),
  ).size,
  2,
);
assert.equal(identifyJobSections(duplicated), duplicated);
assert.equal(setJobSectionColumns(state, "missing", 1), state);
assert.equal(moveJobSection(state, "a", -1), state);

const legacy = parse(
  "## Existing\n\nParagraph with **bold** text.\n\n- One\n- Two",
);
assert.ok(legacy.doc.eq(parse(String(serialize(legacy).value)).doc));

const insertedChecklist = prepareJobEditorState(
  insertFromMenu(parse(""), "JobChecklist"),
  field,
);
const checklist = insertedChecklist.doc.firstChild;
assert.equal(checklist?.type.name, "JobChecklist");
assert.equal(
  checklist.firstChild?.type.name,
  "unordered_list",
  "the + command must create an editable check-list row immediately",
);
assert.equal(checklist.firstChild.firstChild?.type.name, "list_item");
assert.doesNotThrow(() => field.validate(insertedChecklist));
assert.equal(insertedChecklist.selection.$from.parent.type.name, "paragraph");
assert.equal(
  insertedChecklist.selection.$from.node(-1).type.name,
  "list_item",
  "caret stays inside the new item",
);
const typedChecklist = insertedChecklist.apply(
  insertedChecklist.tr.insertText("A new fact"),
);
assert.equal(
  prepareJobEditorState(typedChecklist, field),
  typedChecklist,
  "ordinary typing is not rewritten",
);
const typedMarkup = String(serialize(typedChecklist).value);
assert.match(typedMarkup, /- A new fact/);
assert.ok(typedChecklist.doc.eq(parse(typedMarkup).doc));

const paragraphsAsItems = parse(
  "{% JobChecklist %}\nFirst **bold** fact\n\nSecond [linked](https://hokami.cz) fact\n{% /JobChecklist %}",
);
assert.equal(paragraphsAsItems.doc.firstChild?.firstChild?.childCount, 2);
assert.match(
  String(serialize(paragraphsAsItems).value),
  /- First \*\*bold\*\* fact[\s\S]*- Second \[linked\]/,
);
field.validate(paragraphsAsItems);

for (const name of [
  "JobSection",
  "JobTwoColumns",
  "JobDuties",
  "JobRequirements",
]) {
  const insideColumn = parse(
    '{% JobSection id="parent" %}\n{% JobColumn %}\nOriginal content\n{% /JobColumn %}\n{% /JobSection %}',
  );
  // Place the caret inside the first column using the editor's existing text selection type.
  const position = insideColumn.selection.$from.pos;
  assert.ok(position > 1);
  const inserted = prepareJobEditorState(
    insertFromMenu(insideColumn, name),
    field,
  );
  assert.equal(getJobSections(inserted).length, 2);
  assert.equal(
    getJobSections(inserted)[0].node.textContent.includes("Original content"),
    true,
  );
  assert.equal(
    getJobSections(inserted)[1].node.childCount,
    name === "JobSection" ? 1 : 2,
  );
}

// Copy through the native HTML schema into a different locale's editor.
const { Window } = await import("happy-dom");
// Match the CJS model instance used by tsx for application imports.
const { DOMParser } = createRequire(import.meta.url)(
  "prosemirror-model",
) as typeof import("prosemirror-model");
const { serializeJobClipboard } = await import("../../src/lib/jobs/clipboard");
const window = new Window();
const document = window.document as unknown as Document;
const previousDocument = Object.getOwnPropertyDescriptor(
  globalThis,
  "document",
);
Object.defineProperty(globalThis, "document", {
  configurable: true,
  value: document,
});
const clipboard = serializeJobClipboard(state, document);
assert.match(clipboard.html, /data-component="JobSection"/);
assert.match(clipboard.html, /data-props=/);
assert.match(clipboard.html, /data-pm-slice="0 0 \[\]"/);
assert.match(clipboard.text, /Left heading/);
const clipboardContainer = document.createElement("div");
clipboardContainer.innerHTML = clipboard.html;
const targetField = jobTranslationsField.fields.de.fields.content;
const target = targetField.defaultValue();
const transferred = DOMParser.fromSchema(target.schema).parse(
  clipboardContainer,
);
const pasted = target.apply(
  target.tr.replaceWith(0, target.doc.content.size, transferred.content),
);
const copiedOutput = targetField.serialize(pasted, { slug: undefined });
assert.deepEqual(pasted.doc.toJSON(), state.doc.toJSON());
assert.deepEqual(
  copiedOutput.external.get("public/images/jobs")?.get("test.png"),
  image,
);
targetField.validate(pasted);

clipboardContainer.innerHTML = serializeJobClipboard(
  oldEmbedded,
  document,
).html;
const embeddedClipboard = DOMParser.fromSchema(target.schema).parse(
  clipboardContainer,
);
assert.deepEqual(
  embeddedClipboard.toJSON(),
  oldEmbedded.doc.toJSON(),
  "iframe metadata survives cross-locale copy",
);

const imageSource = parse(
  "![A native image](/images/jobs/test.png)\n\n| A | B |\n| --- | --- |\n| One | Two |",
  new Map([["public/images/jobs", new Map([["test.png", image]])]]),
);
clipboardContainer.innerHTML = serializeJobClipboard(
  imageSource,
  document,
).html;
const imageDocument = DOMParser.fromSchema(target.schema).parse(
  clipboardContainer,
);
const imagePasted = target.apply(
  target.tr.replaceWith(0, target.doc.content.size, imageDocument.content),
);
assert.deepEqual(imagePasted.doc.toJSON(), imageSource.doc.toJSON());
assert.deepEqual(
  targetField
    .serialize(imagePasted, { slug: undefined })
    .external.get("public/images/jobs")
    ?.get("test.png"),
  image,
);

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { JobTranslationsInput } =
  await import("../../src/components/integrations/keystatic/job-translations-input");
const { JobLocaleProvider } =
  await import("../../src/components/integrations/keystatic/job-locale-provider");
let edits = 0;
type TranslationPreview =
  import("../../src/components/integrations/keystatic/job-translations-input").JobTranslationsInputProps["fields"]["cs"];
function translationPreview(
  schema: typeof jobTranslationsField.fields.cs,
  locale: string,
): TranslationPreview {
  return {
    schema,
    onChange: () => {
      edits++;
    },
    fields: {
      title: {
        schema: schema.fields.title,
        value: `Keep ${locale} title`,
        onChange: () => {
          edits++;
        },
      },
      department: {
        schema: schema.fields.department,
        value: "Department",
        onChange: () => {
          edits++;
        },
      },
      description: {
        schema: schema.fields.description,
        value: "Description",
        onChange: () => {
          edits++;
        },
      },
      content: {
        // The native editor needs Keystatic's private app context. Its real
        // document and clipboard paths are exercised above; this view test
        // checks the translation wrapper with a controlled input instead.
        schema: {
          ...schema.fields.content,
          Input: ({ value }) =>
            createElement("textarea", {
              readOnly: true,
              value: value.doc.textContent,
            }),
        },
        value: schema.fields.content.defaultValue(),
        onChange: () => {
          edits++;
        },
      },
    },
  };
}
const translationPreviews = {
  cs: translationPreview(jobTranslationsField.fields.cs, "cs"),
  de: translationPreview(jobTranslationsField.fields.de, "de"),
  fi: translationPreview(jobTranslationsField.fields.fi, "fi"),
  pl: translationPreview(jobTranslationsField.fields.pl, "pl"),
};
const translationView = (locales: import("next-intl").Locale[]) =>
  renderToStaticMarkup(
    createElement(JobLocaleProvider, {
      initialLocales: locales,
      children: createElement(
        "div",
        null,
        createElement(jobsCollection.schema.visibleLocales.Input, {
          value: locales,
          onChange: () => {
            edits++;
          },
          autoFocus: false,
          forceValidation: false,
        }),
        createElement(JobTranslationsInput, {
          fields: translationPreviews,
          schema: jobTranslationsField,
          onChange: () => {
            edits++;
          },
          autoFocus: false,
          forceValidation: false,
        }),
      ),
    }),
  );
clipboardContainer.innerHTML = translationView(["en", "cs"]);
assert.equal(
  clipboardContainer.querySelector("#job-language-cs")?.hasAttribute("hidden"),
  false,
);
assert.equal(
  clipboardContainer.querySelector("#job-language-de")?.hasAttribute("hidden"),
  true,
);
assert.ok(
  clipboardContainer.querySelector(
    '#job-language-de input[value="Keep de title"]',
  ),
);
assert.ok(clipboardContainer.querySelector('a[href="#job-language-cs"]'));
assert.equal(
  clipboardContainer.querySelector('a[href="#job-language-de"]'),
  null,
);
// The required source remains reachable even when English publication is off.
clipboardContainer.innerHTML = translationView(["de"]);
assert.ok(clipboardContainer.querySelector('a[href="#job-language-en"]'));
assert.ok(clipboardContainer.querySelector('a[href="#job-language-de"]'));
assert.equal(
  clipboardContainer.querySelector('a[href="#job-language-cs"]'),
  null,
);
assert.equal(
  clipboardContainer.querySelector("#job-language-cs")?.hasAttribute("hidden"),
  true,
);
assert.equal(
  clipboardContainer.querySelector("#job-language-de")?.hasAttribute("hidden"),
  false,
);
assert.ok(
  clipboardContainer.querySelector(
    '#job-language-cs input[value="Keep cs title"]',
  ),
);
assert.equal(
  edits,
  0,
  "hiding translations never clears or changes their values",
);
await window.happyDOM.close();
if (previousDocument)
  Object.defineProperty(globalThis, "document", previousDocument);
else Reflect.deleteProperty(globalThis, "document");
