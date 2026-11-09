import assert from "node:assert/strict";
import { createRequire, registerHooks } from "node:module";
import type {
  ComponentSchema,
  ParsedValueForComponentSchema,
} from "@keystatic/core";
import "./keystatic-browser.mts";

// Expose the installed save implementation only in this child process. Testing
// the actual serializer catches the library bug, unlike testing each field alone.
const uiUrl = new URL(
  "../../node_modules/@keystatic/core/dist/keystatic-core-ui.js",
  import.meta.url,
).href;
registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (url !== uiUrl || result.source == null) return result;
    return {
      ...result,
      source:
        String(result.source) +
        "\nexport { serializeEntryToFiles, getInitialPropsValue, getCollectionFormat };",
    };
  },
});

const { fields } = await import("@keystatic/core");
const { jobsCollection, jobsReaderConfig } =
  await import("../../src/lib/jobs/collection");
const { serializeJobClipboard } = await import("../../src/lib/jobs/clipboard");
const { Window } = await import("happy-dom");
// Use the same ProseMirror instance as the application's TSX imports.
const { DOMParser } = createRequire(import.meta.url)(
  "prosemirror-model",
) as typeof import("prosemirror-model");

const rootSchema = fields.object(jobsCollection.schema);
type JobState = ParsedValueForComponentSchema<typeof rootSchema>;
type FileAddition = { path: string; contents: Uint8Array };
type SaveInternals = {
  getInitialPropsValue<Schema extends ComponentSchema>(
    schema: Schema,
  ): ParsedValueForComponentSchema<Schema>;
  getCollectionFormat(config: typeof jobsReaderConfig, key: "jobs"): unknown;
  serializeEntryToFiles(args: {
    basePath: string;
    schema: typeof jobsCollection.schema;
    state: JobState;
    format: unknown;
    slug: { field: string; value: string };
  }): FileAddition[];
};
const {
  serializeEntryToFiles,
  getInitialPropsValue,
  getCollectionFormat,
}: SaveInternals = await import(uiUrl);

const format = getCollectionFormat(jobsReaderConfig, "jobs");
const schema = jobsCollection.schema;
const translatedLocales = ["cs", "de", "fi", "pl"] as const;
const withTranslation = (
  state: JobState,
  locale: (typeof translatedLocales)[number],
  content: ReturnType<typeof schema.content.defaultValue>,
): JobState => ({
  ...state,
  translations: {
    ...state.translations,
    [locale]: { ...state.translations[locale], content },
  },
});
const image = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhYQAAAAASUVORK5CYII=",
    "base64",
  ),
);
const external = new Map([
  ["public/images/jobs", new Map([["shared.png", image]])],
]);
const imagePath = "public/images/jobs/buyer/shared.png";
const imageUrl = "/images/jobs/buyer/shared.png";
const initial = () => getInitialPropsValue(rootSchema);
const parse = (text: string, bytes = image) =>
  schema.content.parse(text, {
    other: new Map(),
    external: new Map([
      ["public/images/jobs", new Map([["shared.png", bytes]])],
    ]),
    slug: "buyer",
  });
const serialize = (state: JobState, slug = "buyer") =>
  serializeEntryToFiles({
    basePath: `src/content/jobs/${slug}`,
    schema,
    state,
    format,
    slug: { field: "title", value: slug },
  });
const assertUnique = (files: FileAddition[]) => {
  assert.equal(
    new Set(files.map(({ path }) => path)).size,
    files.length,
    "Paths must be unique across additions and deletions. At least one path was included more than once.",
  );
};

const window = new Window();
const previousDocument = Object.getOwnPropertyDescriptor(
  globalThis,
  "document",
);
Object.defineProperty(globalThis, "document", {
  configurable: true,
  value: window.document,
});
try {
  for (const markup of [
    `## Responsibilities\n\n![Production](${imageUrl})`,
    `{% JobSection id="duties" %}\n{% JobColumn %}\n{% JobPhoto src="${imageUrl}" alt="Production" /%}\n{% /JobColumn %}\n{% /JobSection %}`,
  ]) {
    let state: JobState = { ...initial(), content: parse(markup) };
    const original = state.content.doc.toJSON();
    const clipboard = serializeJobClipboard(
      state.content,
      window.document as unknown as Document,
    );
    const container = window.document.createElement("div");
    container.innerHTML = clipboard.html;
    for (const locale of translatedLocales) {
      const target = schema.translations.fields[locale].fields.content;
      const editor = target.defaultValue();
      const transferred = DOMParser.fromSchema(editor.schema).parse(
        container as unknown as HTMLElement,
      );
      state = withTranslation(
        state,
        locale,
        editor.apply(
          editor.tr.replaceWith(
            0,
            editor.doc.content.size,
            transferred.content,
          ),
        ),
      );
    }

    const files = serialize(state);
    assertUnique(files);
    assert.equal(files.length, 2, "one JSON record and one shared image");
    assert.deepEqual(
      files.find(({ path }) => path === imagePath)?.contents,
      image,
    );
    assert.deepEqual(
      state.content.doc.toJSON(),
      original,
      "saving never mutates the source editor",
    );

    const json = files.find(({ path }) => path.endsWith("/index.json"));
    assert.ok(json);
    const saved = JSON.parse(new TextDecoder().decode(json.contents));
    for (const locale of translatedLocales) {
      assert.equal(saved.translations[locale].content, saved.content);
      // Reopening a saved translation retains its asset bytes.
      const field = schema.translations.fields[locale].fields.content;
      const reopened = field.parse(saved.translations[locale].content, {
        other: new Map(),
        external,
        slug: "buyer",
      });
      assert.deepEqual(
        field
          .serialize(reopened, { slug: "buyer" })
          .external.get("public/images/jobs")
          ?.get("shared.png"),
        image,
      );
    }
    assert.match(saved.content, /\/images\/jobs\/buyer\/shared\.png/);

    // Removing the original reference must not delete an image still used by translations.
    state = { ...state, content: parse("English text without an image.") };
    const remaining = serialize(state);
    assertUnique(remaining);
    assert.deepEqual(
      remaining.find(({ path }) => path === imagePath)?.contents,
      image,
    );

    // All references removed: the image is no longer part of the desired files.
    for (const locale of translatedLocales)
      state = withTranslation(
        state,
        locale,
        schema.translations.fields[locale].fields.content.defaultValue(),
      );
    assert.deepEqual(
      serialize(state).map(({ path }) => path),
      ["src/content/jobs/buyer/index.json"],
    );
  }

  let repeated: JobState = {
    ...initial(),
    content: parse(`![First](${imageUrl})\n\n![Second](${imageUrl})`),
  };
  assertUnique(serialize(repeated));
  assert.equal(serialize(repeated).length, 2);

  // Equal byte arrays need not be the same object to represent the same file.
  repeated = withTranslation(
    repeated,
    "cs",
    parse(`![Copy](${imageUrl})`, image.slice()),
  );
  assertUnique(serialize(repeated));

  const changed = image.slice();
  changed[changed.length - 1] ^= 1;
  for (const bytes of [new Uint8Array([1, 2, 3]), changed]) {
    const conflicting = withTranslation(
      { ...initial(), content: parse(`![First](${imageUrl})`) },
      "cs",
      parse(`![Conflicting](${imageUrl})`, bytes),
    );
    assert.throws(
      () => serialize(conflicting),
      /Conflicting contents for file: public\/images\/jobs\/buyer\/shared\.png/,
    );
  }

  console.log(
    "PASS: native images and JobPhoto copied to all languages, reopen, removal, repeated references, equal bytes and conflicting files",
  );
} finally {
  await window.happyDOM.close();
  if (previousDocument)
    Object.defineProperty(globalThis, "document", previousDocument);
  else Reflect.deleteProperty(globalThis, "document");
}
