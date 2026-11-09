import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { Window } from "happy-dom";
import messages from "../src/i18n/keystatic-ui-messages.json";
import { translateSource } from "../scripts/keystatic-ui-loader.cjs";
import {
  changeKeystaticUiLocale,
  KEYSTATIC_UI_LOCALE_KEY,
  readKeystaticUiLocale,
  type KeystaticUiLocale,
} from "../src/i18n/keystatic-ui";
import { observeKeystaticHeader } from "../src/lib/jobs/admin-header";

const locales = ["cs", "en", "de", "fi", "pl"] as const;

test("all five interface catalogs have complete messages and valid interpolation slots", () => {
  const keys = Object.keys(messages.en).sort();
  for (const locale of locales) {
    assert.deepEqual(Object.keys(messages[locale]).sort(), keys);
    for (const [key, value] of Object.entries(messages[locale])) {
      assert.ok(value.trim(), `${locale}: ${key}`);
      const slots = new Set(key.match(/\{\d+\}/g));
      for (const slot of value.match(/\{\d+\}/g) ?? [])
        assert.ok(slots.has(slot), `${locale}: unknown slot ${slot} in ${key}`);
    }
  }
});

test("the build transform translates dynamic messages while keeping values, identifiers and native dictionaries intact", () => {
  const source = `
    const dictionary = { "Edit": \`Edit\` };
    const content = { title: "User's Paragraph Edit Unsaved", src: "https://example.com/Edit" };
    let calls = 0;
    const heading = { label: \`Heading \${++calls}\` }.label;
    const error = { errorMessage: \`\${"Název"} is required\` }.errorMessage;
    const action = { children: "Edit" };
    globalThis.result = { dictionary, content, calls, heading, error, action };
  `;
  const context = runInNewContext(`${translateSource(source, "cs")}\nresult`);
  assert.equal(context.heading, "Nadpis 1");
  assert.equal(context.calls, 1);
  assert.equal(context.error, "Pole Název je povinné");
  assert.equal(context.action.children, "Upravit");
  assert.equal(context.dictionary.Edit, "Edit");
  assert.equal(context.content.title, "User's Paragraph Edit Unsaved");
  assert.equal(context.content.src, "https://example.com/Edit");
  assert.equal(translateSource(source, "en"), source);
});

test("the production transform reads the chosen language at runtime and marks the native dirty indicator", () => {
  const source = `"use client";
    const dictionary = { "Edit": \`Edit\` };
    const content = { title: "Paragraph Edit Unsaved" };
    globalThis.render = () => ({
      dictionary, content,
      action: { children: "Edit" },
      dirty: { children: "Unsaved" },
      heading: { label: \`Heading \${2}\` }.label
    });`;
  const transformed = translateSource(source, "cs", true);
  assert.ok(transformed.startsWith('"use client";'));
  let locale: KeystaticUiLocale = "cs";
  const output = ts.transpileModule(transformed, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const sandbox = {
    exports: {},
    require(specifier: string) {
      assert.equal(specifier, "@/i18n/keystatic-ui");
      return {
        keystaticUiText: (key: keyof typeof messages.en) =>
          messages[locale][key],
        formatKeystaticUiText: (key: keyof typeof messages.en, value: number) =>
          messages[locale][key].replace("{0}", String(value)),
      };
    },
  };
  const render = runInNewContext(`${output}\nrender`, sandbox);
  for (locale of locales) {
    const view = render();
    assert.equal(view.action.children, messages[locale].Edit);
    assert.equal(view.dirty.children, messages[locale].Unsaved);
    assert.equal(view.dirty["data-keystatic-unsaved"], true);
    assert.equal(
      view.heading,
      messages[locale]["Heading {0}"].replace("{0}", "2"),
    );
    assert.equal(view.dictionary.Edit, "Edit");
    assert.equal(view.content.title, "Paragraph Edit Unsaved");
  }
});

test("localization preserves parser discriminants and stored values that match interface messages", () => {
  const source = `
    const data = { type: "Identifier", name: "Identifier", value: "Edit", status: "Changed" };
    function parseKey(key) {
      if (key.type === "Identifier") return key.name;
      throw new Error("Unexpected key");
    }
    const storedHeading = { value: \`Heading \${2}\` };
    const label = { label: "Identifier" };
    globalThis.result = { data, parsed: parseKey(globalThis.key), storedHeading, label };
  `;
  for (const locale of locales) {
    for (const runtime of [false, true]) {
      const transformed = translateSource(source, locale, runtime);
      const output = ts.transpileModule(transformed, {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      }).outputText;
      const result = runInNewContext(`${output}\nresult`, {
        exports: {},
        key: { type: "Identifier", name: "id" },
        require() {
          return {
            keystaticUiText: (key: keyof typeof messages.en) =>
              messages[locale][key],
          };
        },
      });
      assert.equal(result.parsed, "id", `${locale}, runtime=${runtime}`);
      assert.equal(
        JSON.stringify(result.data),
        JSON.stringify({
          type: "Identifier",
          name: "Identifier",
          value: "Edit",
          status: "Changed",
        }),
      );
      assert.equal(result.storedHeading.value, "Heading 2");
      assert.equal(result.label.label, messages[locale].Identifier);
    }
  }
});

test("the interface preference accepts all five languages and recovers from invalid or unavailable storage", () => {
  for (const locale of locales)
    assert.equal(readKeystaticUiLocale({ getItem: () => locale }), locale);
  for (const invalid of [null, "fr", "__proto__", "de-DE", ""])
    assert.equal(readKeystaticUiLocale({ getItem: () => invalid }), "cs");
  assert.equal(
    readKeystaticUiLocale({
      getItem() {
        throw new Error("blocked");
      },
    }),
    "cs",
  );
});

test("switching the interface persists the preference and reloads only after native unsaved changes are resolved", async () => {
  const view = new Window();
  try {
    const page = view.document as unknown as Document;
    let reloads = 0;
    const reload = () => {
      reloads++;
    };
    const storage = new Map<string, string>();
    const store = {
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    };
    view.document.body.innerHTML =
      "<span data-keystatic-unsaved>Ungespeicherte Änderungen</span>";
    assert.equal(changeKeystaticUiLocale("fi", page, store, reload), "unsaved");
    assert.equal(storage.size, 0);
    assert.equal(reloads, 0);
    view.document.body.innerHTML = "";
    assert.equal(changeKeystaticUiLocale("fi", page, store, reload), undefined);
    assert.equal(storage.get(KEYSTATIC_UI_LOCALE_KEY), "fi");
    assert.equal(reloads, 1);
    assert.equal(
      changeKeystaticUiLocale(
        "pl",
        page,
        {
          setItem() {
            throw new Error("blocked");
          },
        },
        reload,
      ),
      "storage-error",
    );
    assert.equal(reloads, 1);
  } finally {
    await view.happyDOM.close();
  }
});

test("the language picker attaches to late page headers, survives navigation and cleans up", async () => {
  const view = new Window();
  try {
    let attachments = 0;
    const cleanup = observeKeystaticHeader(
      view.document as unknown as Document,
      () => {
        attachments++;
      },
    );
    view.document.body.innerHTML =
      '<main id="keystatic-main-panel"><header><div><h1>Jobs</h1></div></header></main>';
    await view.happyDOM.whenAsyncComplete();
    const host = view.document.querySelector(
      "[data-keystatic-language-picker]",
    );
    assert.ok(host);
    view.document.querySelector("main")!.innerHTML =
      "<header><div><h1>production</h1><button>Save</button></div></header>";
    await view.happyDOM.whenAsyncComplete();
    assert.equal(
      view.document.querySelector("header > div")!.lastElementChild,
      host,
    );
    assert.equal(attachments, 2);
    assert.equal(
      view.document.querySelectorAll("[data-keystatic-language-picker]").length,
      1,
    );
    cleanup();
    assert.equal(host.isConnected, false);
  } finally {
    await view.happyDOM.close();
  }
});

test("installed Keystatic UI literals are covered and translated in all five locales", async () => {
  const require = createRequire(import.meta.url);
  const directory = join(
    dirname(require.resolve("@keystatic/core/package.json")),
    "dist",
  );
  const properties = new Set([
    "children",
    "label",
    "title",
    "aria-label",
    "placeholder",
    "errorMessage",
    "description",
    "name",
    "message",
    "textValue",
    "alt",
  ]);
  // Programming languages, configuration keys and DOM attribute names are identifiers.
  const identifiers = new Set([
    ".env",
    "@keystatic/core",
    "Arduino",
    "aria-label",
    "Bash",
    "CSS",
    "INI",
    "Java",
    "JavaScript",
    "JSON",
    "JSX",
    "KEYSTATIC_GITHUB_CLIENT_ID",
    "KEYSTATIC_GITHUB_CLIENT_SECRET",
    "KEYSTATIC_SECRET",
    "Kotlin",
    "label",
    "Less",
    "Lua",
    "Makefile",
    "manifest",
    "Markdown",
    "name",
    "Objective-C",
    "Perl",
    "PHP",
    "placeholder",
    "ProseMirror-placeholder",
    "Python",
    "repo-name",
    "Ruby",
    "Rust",
    "Sass",
    "SCSS",
    "SQL",
    "Swift",
    "textAlign",
    "theme",
    "title",
    "TSX",
    "TypeScript",
    "URL",
    "VB.NET",
    "viewport",
    "YAML",
  ]);
  function labels(source: string) {
    const values: string[] = [];
    const file = ts.createSourceFile(
      "keystatic.js",
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.JS,
    );
    function visit(node: ts.Node) {
      if (ts.isStringLiteral(node) && /[A-Za-z]{2}/.test(node.text)) {
        const parent = ts.isArrayLiteralExpression(node.parent)
          ? node.parent.parent
          : node.parent;
        if (!ts.isPropertyAssignment(parent)) return;
        const name = parent.name;
        if (
          (ts.isIdentifier(name) || ts.isStringLiteral(name)) &&
          properties.has(name.text)
        )
          values.push(node.text);
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
    return values;
  }
  for (const filename of await readdir(directory)) {
    if (!(
      /^index-[^.]+\.js$/.test(filename) ||
      /^keystatic-core(?:-ui)?\.js$/.test(filename)
    ))
      continue;
    const source = await readFile(join(directory, filename), "utf8");
    for (const label of labels(source))
      assert.ok(
        Object.hasOwn(messages.en, label) || identifiers.has(label),
        `${filename}: missing translation for ${label}`,
      );
    for (const locale of locales) {
      for (const label of labels(translateSource(source, locale))) {
        if (Object.hasOwn(messages.en, label)) {
          const key = label as keyof typeof messages.en;
          assert.equal(
            messages[locale][key],
            label,
            `${locale}: untranslated ${label} in ${filename}`,
          );
        }
      }
    }
  }
});

for (const locale of locales) {
  test(`the real editor renders paragraph and heading choices in ${locale} without translating content`, () => {
    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", "tests/fixtures/keystatic-localization.mts"],
      {
        encoding: "utf8",
        env: { ...process.env, KEYSTATIC_TEST_UI_LOCALE: locale },
      },
    );
    assert.equal(result.status, 0, result.stderr || result.stdout);
  });
}
