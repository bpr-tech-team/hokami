import type { JobEditorState } from "./editor-layout";
import { jobContentComponents } from "./content-components";
import { createElement } from "react";
import { Table2 } from "lucide-react";
import { getKeystaticUiLocale, keystaticUiText } from "@/i18n/keystatic-ui";

const insertCollator = new Intl.Collator(getKeystaticUiLocale());
const hiddenInsertItems = new Set(["JobDuties", "JobRequirements"]);

export function getJobInsertItems(state: JobEditorState) {
  const components = Object.entries(jobContentComponents)
    .filter(
      ([name, component]) =>
        !component.forSpecificLocations &&
        !hiddenInsertItems.has(name) &&
        state.schema.nodes[name]?.spec.insertMenu,
    )
    .map(([id, component]) => ({
      id,
      label: component.label,
      icon: component.icon,
    }));
  const items = [
    ...components,
    {
      id: "table",
      label: keystaticUiText("Table"),
      icon: createElement(Table2),
    },
  ];
  const order = ["JobSection", "JobTwoColumns"];
  return items.sort((a, b) => {
    const aPriority = order.indexOf(a.id);
    const bPriority = order.indexOf(b.id);
    return (
      (aPriority < 0 ? order.length : aPriority) -
        (bPriority < 0 ? order.length : bPriority) ||
      insertCollator.compare(a.label, b.label)
    );
  });
}

// Keystatic 0.6 exposes no toolbar slot. Attach to the semantic toolbar, keep
// its native event handlers and use a portal
// for our insert menu. Never depend on generated vendor class names.
export function attachJobToolbar(root: HTMLElement) {
  const formatting = root.querySelector<HTMLElement>(
    `[role="toolbar"][aria-label="${keystaticUiText("Formatting options")}"]`,
  );
  const container = formatting?.parentElement?.parentElement;
  const insert =
    container &&
    Array.from(container.children).find((element) =>
      ["menu", "true"].includes(element.getAttribute("aria-haspopup") ?? ""),
    );
  if (
    !formatting ||
    !container ||
    !(insert instanceof root.ownerDocument.defaultView!.HTMLElement)
  )
    return null;

  const blocks = formatting.querySelector(
    `[aria-label="${keystaticUiText("Blocks")}"]`,
  );
  const image = blocks?.querySelector<HTMLElement>(
    `[aria-label="${keystaticUiText("Image")}"]`,
  );
  const table = blocks?.querySelector<HTMLElement>(
    `[aria-label="${keystaticUiText("Table")}"]`,
  );
  const dividers = blocks?.querySelectorAll<HTMLElement>(
    `[aria-label="${keystaticUiText("Divider")}"]`,
  );
  const hidden = [
    insert,
    formatting.querySelector<HTMLElement>(
      `[aria-label="${keystaticUiText("Clear formatting")}"]`,
    ),
    formatting.querySelector<HTMLElement>(
      `[aria-label="${keystaticUiText("Code")}"]`,
    ),
    blocks?.querySelector<HTMLElement>(
      `[aria-label="${keystaticUiText("Code block")}"]`,
    ),
    blocks?.querySelector<HTMLElement>(
      `[aria-label="${keystaticUiText("Quote")}"]`,
    ),
    dividers?.[0],
    image,
    table,
  ].filter((element): element is HTMLElement => !!element);
  const previous = hidden.map((element) => ({
    element,
    display: element.style.getPropertyValue("display"),
    priority: element.style.getPropertyPriority("display"),
    ariaHidden: element.getAttribute("aria-hidden"),
  }));
  for (const element of hidden) {
    // Vendor styles are unlayered and override ordinary Tailwind hidden rules.
    element.style.setProperty("display", "none", "important");
    element.setAttribute("aria-hidden", "true");
  }
  // The second Divider in this vendor release is actually the link command.
  const link = dividers?.[1];
  link?.setAttribute("aria-label", keystaticUiText("Link"));
  const element = root.ownerDocument.createElement("div");
  element.dataset.jobEditorActions = "";
  element.className = "flex shrink-0 items-center gap-1 pr-2";
  const containerClasses = ["h-auto!", "min-h-12!"];
  const addedClasses = containerClasses.filter(
    (name) => !container.classList.contains(name),
  );
  container.classList.add(...addedClasses);
  container.appendChild(element);
  return {
    element,
    table: () => table?.click(),
    get focusTarget() {
      return root.querySelector<HTMLElement>(
        '[data-keystatic-editor="content"]',
      );
    },
    destroy() {
      element.remove();
      container.classList.remove(...addedClasses);
      for (const { element, display, priority, ariaHidden } of previous) {
        if (display) element.style.setProperty("display", display, priority);
        else element.style.removeProperty("display");
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      }
      link?.setAttribute("aria-label", keystaticUiText("Divider"));
    },
  };
}

export type JobToolbarAttachment = NonNullable<
  ReturnType<typeof attachJobToolbar>
>;
