import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { compile } from "@tailwindcss/node";
import { Window } from "happy-dom";

test("the shared theme keeps portal surfaces opaque when compiled as a separate stylesheet", async () => {
  // Turbopack also processes imported stylesheets on their own. Do not rely
  // on another CSS entry point having emitted the shared palette first.
  const from = resolve("src/app/theme.css");
  const compiler = await compile(await readFile(from, "utf8"), {
    from,
    base: dirname(from),
    onDependency() {},
  });
  const view = new Window();
  try {
    const style = view.document.createElement("style");
    // Apply emitted root declarations in order, independently of the DOM
    // emulator's support for cascade layers.
    const rootRules = [
      ...compiler.build([]).matchAll(/:root(?:,\s*:host)?\s*\{[^}]*\}/g),
    ]
      .map(([rule]) => rule)
      .join("\n");
    style.textContent = `${rootRules}
      [role="menu"] {
        background-color: var(--popover);
        color: var(--popover-foreground);
      }
      #palette {
        background-color: var(--hokami-color-surface-default);
        color: var(--hokami-color-text-primary);
      }`;
    view.document.head.appendChild(style);
    view.document.body.innerHTML =
      '<div role="menu">Insert</div><div id="palette"></div>';
    const menu = view.getComputedStyle(
      view.document.querySelector('[role="menu"]')!,
    );
    const palette = view.getComputedStyle(
      view.document.getElementById("palette")!,
    );
    assert.ok(palette.backgroundColor);
    assert.equal(menu.backgroundColor, palette.backgroundColor);
    assert.equal(menu.color, palette.color);
  } finally {
    await view.happyDOM.close();
  }
});
