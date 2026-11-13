/* eslint-disable @typescript-eslint/no-require-imports */
const ts = require("typescript");
const { readFileSync } = require("node:fs");
const messagesPath = require.resolve("../src/i18n/keystatic-ui-messages.json");

// Bridge Keystatic 0.6.9's native keys to the same reviewed copy as our UI.
// These dictionaries stay locale-specific; Keystar selects one via its provider.
const nativeMessages = {
  add: "Add",
  basedOn: "Based on",
  branches: "Branches",
  branchName: "Branch name",
  cancel: "Cancel",
  clear: "Clear",
  collection: "Collection",
  collections: "Collections",
  create: "Create",
  createPullRequest: "Create pull request",
  currentBranch: "Current branch",
  dashboard: "Dashboard",
  defaultBranch: "Default branch",
  delete: "Delete",
  deleteBranch: "Delete branch",
  edit: "Edit",
  loading: "Loading",
  newBranch: "New branch…",
  otherBranches: "Other branches",
  pullRequests: "Pull requests",
  save: "Save",
  search: "Search",
  singleton: "Singleton",
  singletons: "Singletons",
  theCurrentlyCheckedOutBranch:
    "The currently checked out branch. Choose this if you need to build on existing work from the current branch.",
  theDefaultBranchInYourRepository:
    "The default branch in your repository. Choose this to start something new that's not dependent on your current branch.",
  viewPullRequests: "View pull requests",
};

const uiProperties = new Set([
  "children",
  "label",
  "title",
  "aria-label",
  "placeholder",
  "errorMessage",
  "description",
  "message",
  "textValue",
  "alt",
  "actionLabel",
  "cancelLabel",
  "nodeLabel",
]);
const uiNames = new Set([
  "Paragraph",
  "Code Block",
  "Heading",
  "Heading {0}",
  "Status",
  "Slug",
  "Name",
]);
// These Keystatic 0.6.9 helpers return validation messages or stage UI text in
// local variables before rendering. New callers need an explicit audit here.
const uiMessageFunctions = new Set([
  "formatFormDataError",
  "validateText",
  "validateInteger",
  "validateNumber",
  "validateDate",
  "validateDatetime",
  "validateUrl",
  "validateMultiRelationshipLength",
  "prettyErrorForCreateBranchMutation",
  "useArrayFieldValidationMessage",
  "ArrayFieldListView",
  "LinkDialog",
  "LinkDialog$1",
  "ImageDialog",
  "ImageField",
  "ImageDimensionsInput",
  "PathReferenceInput",
  "RelationshipInput",
  "SlugFieldInput",
  "BranchNotFound",
  "SingletonPageWrapper",
  "CodeElement",
  "GitMenu",
  "slug",
]);

function nativeDictionary(node) {
  if (
    !ts.isVariableDeclaration(node) ||
    !ts.isIdentifier(node.name) ||
    node.name.text !== "strings" ||
    !node.initializer ||
    !ts.isObjectLiteralExpression(node.initializer)
  )
    return;
  const english = node.initializer.properties.find(
    (property) => property.name?.text === "en-US",
  );
  if (!english || !ts.isPropertyAssignment(english)) return;
  if (!ts.isObjectLiteralExpression(english.initializer)) return;
  const branch = english.initializer.properties.find(
    (property) => property.name?.text === "currentBranch",
  );
  if (
    branch &&
    ts.isPropertyAssignment(branch) &&
    branch.initializer.text === "Current branch"
  )
    return node.initializer;
}

function counterOptions(node) {
  if (
    !ts.isCallExpression(node) ||
    !ts.isIdentifier(node.expression) ||
    node.expression.text !== "pluralize" ||
    node.arguments.length !== 2 ||
    !ts.isObjectLiteralExpression(node.arguments[1]) ||
    !node.arguments[1].properties.every(
      (property) =>
        ts.isPropertyAssignment(property) &&
        (property.name.text === "inclusive"
          ? property.initializer.kind === ts.SyntaxKind.TrueKeyword ||
            property.initializer.kind === ts.SyntaxKind.FalseKeyword
          : ["singular", "plural"].includes(property.name.text) &&
            ts.isStringLiteral(property.initializer)),
    ) ||
    !isUiMessage(node)
  )
    return;
  const options = Object.fromEntries(
    node.arguments[1].properties.map((property) => [
      property.name.text,
      ts.isStringLiteral(property.initializer)
        ? property.initializer.text
        : property.initializer.kind === ts.SyntaxKind.TrueKeyword,
    ]),
  );
  if (
    (options.singular === "entry" && options.plural === "entries") ||
    (options.singular === "change" && options.plural === "changes")
  )
    return {
      message: options.singular === "entry" ? "Entries: {0}" : "Changes: {0}",
      inclusive: options.inclusive ?? true,
    };
}

function isInUiMessageFunction(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (
      ts.isFunctionDeclaration(parent) &&
      uiMessageFunctions.has(parent.name?.text)
    )
      return true;
  }
  return false;
}

function isUiMessage(node, message = node.text) {
  let expression = node;
  for (;;) {
    const parent = expression.parent;
    if (!parent) return false;
    if (ts.isPropertyAssignment(parent)) {
      if (parent.initializer !== expression) return false;
      const name = parent.name;
      if (!ts.isIdentifier(name) && !ts.isStringLiteral(name)) return false;
      return (
        uiProperties.has(name.text) ||
        (name.text === "name" && uiNames.has(message))
      );
    }
    if (ts.isNewExpression(parent))
      return (
        parent.arguments?.includes(expression) &&
        ts.isIdentifier(parent.expression) &&
        ["Error", "FieldDataError"].includes(parent.expression.text)
      );
    if (ts.isCallExpression(parent)) {
      if (!parent.arguments.includes(expression)) return false;
      if (ts.isIdentifier(parent.expression))
        return (
          parent.expression.text === "placeholderPlugin" ||
          (parent.expression.text === "validateText" &&
            parent.arguments[0] === expression &&
            isInUiMessageFunction(parent)) ||
          (["useState", "setInputValue"].includes(parent.expression.text) &&
            isInUiMessageFunction(parent))
        );
      if (parent.expression.kind !== ts.SyntaxKind.SuperKeyword) return false;
      for (let scope = parent.parent; scope; scope = scope.parent)
        if (ts.isClassDeclaration(scope))
          return scope.name?.text === "NotFoundError";
      return false;
    }
    if (
      ts.isArrayLiteralExpression(parent) ||
      ts.isParenthesizedExpression(parent) ||
      (ts.isConditionalExpression(parent) && parent.condition !== expression)
    ) {
      expression = parent;
      continue;
    }
    if (ts.isTemplateSpan(parent) && parent.expression === expression) {
      expression = parent.parent;
      continue;
    }
    if (ts.isBinaryExpression(parent)) {
      const operator = parent.operatorToken.kind;
      if (
        operator === ts.SyntaxKind.PlusToken ||
        operator === ts.SyntaxKind.BarBarToken ||
        operator === ts.SyntaxKind.QuestionQuestionToken ||
        (operator === ts.SyntaxKind.AmpersandAmpersandToken &&
          parent.right === expression)
      ) {
        expression = parent;
        continue;
      }
      if (operator !== ts.SyntaxKind.EqualsToken || parent.right !== expression)
        return false;
    } else if (
      !ts.isVariableDeclaration(parent) &&
      !ts.isReturnStatement(parent)
    )
      return false;
    return isInUiMessageFunction(parent);
  }
}

/**
 * Keystatic 0.6.9 hardcodes some UI strings instead of using its locale
 * dictionaries. Connect those literals to the selected UI locale, without changing the
 * installed package or touching editor DOM, user content, or storage formats.
 * @param {string} source
 * @param {string} locale
 */
function translateSource(source, locale, runtime = false) {
  const catalogs = JSON.parse(readFileSync(messagesPath, "utf8"));
  const catalog = catalogs[locale];
  if (!catalog) throw new Error(`Unsupported Keystatic UI locale: ${locale}`);
  // Apply English copy corrections too, leaving unchanged source messages intact.
  const dictionary =
    locale === "en" && !runtime
      ? Object.fromEntries(
          Object.entries(catalog).filter(([key, value]) => key !== value),
        )
      : catalog;
  const file = ts.createSourceFile(
    "keystatic.js",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const edits = [];
  const unsavedObjects = new Set();
  function formatMessage(message, args) {
    if (runtime)
      return `__hokamiUiFormat(${JSON.stringify(message)}, ${args.join(", ")})`;
    const parts = catalog[message]
      .split(/(\{\d+\})/)
      .map((part) =>
        /^\{\d+\}$/.test(part)
          ? `__keystaticValues[${part.slice(1, -1)}]`
          : JSON.stringify(part),
      );
    return `((...__keystaticValues) => "" + ${parts.join(" + ")})(${args.join(", ")})`;
  }
  function visit(node) {
    const native = nativeDictionary(node);
    if (native) {
      for (const language of native.properties) {
        if (!ts.isPropertyAssignment(language)) continue;
        const translations = catalogs[language.name.text?.split("-")[0]];
        if (
          !translations ||
          !ts.isObjectLiteralExpression(language.initializer)
        )
          continue;
        for (const property of language.initializer.properties) {
          if (!ts.isPropertyAssignment(property)) continue;
          const message = nativeMessages[property.name.text];
          if (!message) continue;
          if (!Object.hasOwn(translations, message))
            throw new Error(`Missing native Keystatic UI message: ${message}`);
          edits.push({
            start: property.initializer.getStart(file),
            end: property.initializer.end,
            text: JSON.stringify(translations[message]),
          });
        }
      }
      return;
    }
    const counter = counterOptions(node);
    if (counter) {
      let target = node;
      // The navigation badge splits its number and hidden noun into two spans.
      // Replace that pair with one label so the number appears only once.
      if (!counter.inclusive) {
        const siblings = node.parent.parent.parent.parent;
        if (ts.isArrayLiteralExpression(siblings) && isUiMessage(siblings))
          target = siblings;
      }
      edits.push({
        start: target.getStart(file),
        end: target.end,
        text: formatMessage(counter.message, [node.arguments[0].getText(file)]),
      });
      return;
    }
    if (
      ts.isStringLiteral(node) &&
      Object.hasOwn(dictionary, node.text) &&
      isUiMessage(node)
    ) {
      edits.push({
        start: node.getStart(file),
        end: node.end,
        text: runtime
          ? `__hokamiUiText(${JSON.stringify(node.text)})`
          : JSON.stringify(dictionary[node.text]),
      });
      if (
        node.text === "Unsaved" &&
        ts.isPropertyAssignment(node.parent) &&
        node.parent.name.getText(file) === "children" &&
        ts.isObjectLiteralExpression(node.parent.parent)
      ) {
        const object = node.parent.parent;
        if (!unsavedObjects.has(object.pos)) {
          unsavedObjects.add(object.pos);
          edits.push({
            start: object.getStart(file) + 1,
            end: object.getStart(file) + 1,
            text: '"data-keystatic-unsaved": true,',
          });
        }
      }
      return;
    }
    if (ts.isTemplateExpression(node)) {
      const message =
        node.head.text +
        node.templateSpans
          .map((span, index) => `{${index}}${span.literal.text}`)
          .join("");
      if (Object.hasOwn(dictionary, message) && isUiMessage(node, message)) {
        const args = node.templateSpans.map((span) =>
          span.expression.getText(file),
        );
        edits.push({
          start: node.getStart(file),
          end: node.end,
          text: formatMessage(message, args),
        });
        return;
      }
    }
    // Only the native dictionary above is rewritten; other template literals
    // may contain stored content or identifiers and must remain intact.
    ts.forEachChild(node, visit);
  }
  visit(file);
  let result = source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  }
  if (runtime && edits.length) {
    // Preserve directive prologues such as "use client".
    let start = 0;
    for (const statement of file.statements) {
      if (
        ts.isExpressionStatement(statement) &&
        ts.isStringLiteral(statement.expression)
      )
        start = statement.end;
      else break;
    }
    const imports =
      '\nimport { keystaticUiText as __hokamiUiText, formatKeystaticUiText as __hokamiUiFormat } from "@/i18n/keystatic-ui";\n';
    result = result.slice(0, start) + imports + result.slice(start);
  }
  return result;
}

module.exports = function keystaticUiLoader(source) {
  this.addDependency(messagesPath);
  this.addDependency(__filename);
  const options = this.getOptions();
  return translateSource(source, options.locale, options.runtime ?? false);
};
module.exports.translateSource = translateSource;
