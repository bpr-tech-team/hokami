import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "next-intl";
import { ProcessSection } from "../src/components/sections/process/process-section";
import {
  getProcessNode,
  getProcessTimeline,
} from "../src/components/sections/process/process-timeline";
import cs from "../messages/cs.json";
import en from "../messages/en.json";
import de from "../messages/de.json";
import fi from "../messages/fi.json";
import pl from "../messages/pl.json";

const stepIds = [
  "documentation",
  "assessment",
  "prototype",
  "production",
] as const;

function getContent(locale: keyof typeof catalogs = "cs") {
  const t = createTranslator({
    locale,
    messages: catalogs[locale],
    namespace: "Process",
    onError(error) {
      throw error;
    },
  });
  return {
    id: "process",
    eyebrow: t("eyebrow"),
    title: t("title"),
    steps: stepIds.map((id, index) => ({
      id,
      label: t("step", { number: String(index + 1).padStart(2, "0") }),
      title: t(`steps.${id}.title`),
      description: t(`steps.${id}.description`),
    })),
  };
}

const catalogs = { cs, en, de, fi, pl };

test("every step has four seconds and the animation finishes on the last step", () => {
  for (let count = 2; count <= 6; count++) {
    const timeline = getProcessTimeline(count);
    assert.equal(timeline.duration, count * 4000);
    assert.equal(timeline.steps.length, count);
    assert.equal(timeline.nodes.length, count);
    assert.equal(timeline.orbit[0].transform, "rotate(0deg)");
    assert.equal(timeline.orbit.at(-1)?.transform, "rotate(360deg)");
    assert.equal(timeline.progress[0]["--process-angle"], "0deg");
    assert.equal(timeline.progress.at(-1)?.["--process-angle"], "360deg");
    timeline.progress.forEach((frame, index) => {
      assert.equal(
        timeline.orbit[index].transform,
        `rotate(${frame["--process-angle"]})`,
      );
      assert.equal(frame.offset, timeline.orbit[index].offset);
      assert.equal(frame.easing, timeline.orbit[index].easing);
    });

    for (const frames of [
      timeline.orbit,
      timeline.progress,
      ...timeline.steps,
      ...timeline.nodes,
    ]) {
      assert.equal(frames[0].offset, 0);
      assert.equal(frames.at(-1)?.offset, 1);
      frames.forEach((frame, index) => {
        assert.ok(Number.isFinite(frame.offset));
        assert.ok(frame.offset! >= 0 && frame.offset! <= 1);
        if (index) assert.ok(frame.offset! >= frames[index - 1].offset!);
      });
    }

    timeline.steps.forEach((frames, index) => {
      assert.equal(frames.at(-1)?.opacity, index === count - 1 ? 1 : 0);
    });
    timeline.nodes.forEach((frames) => {
      assert.equal(frames.at(-1)?.opacity, 1);
    });

    // A second into each step, exactly its text is fully visible.
    for (let active = 0; active < count; active++) {
      const offset = (active * 4000 + 1000) / timeline.duration;
      timeline.steps.forEach((frames, index) => {
        const before = frames.findLast((frame) => frame.offset! <= offset)!;
        const after = frames.find((frame) => frame.offset! > offset)!;
        assert.equal(before.opacity, index === active ? 1 : 0);
        assert.equal(after.opacity, index === active ? 1 : 0);
      });
    }
  }
});

test("nodes stay on the same circle, start at twelve o'clock and advance clockwise", () => {
  for (const count of [2, 3, 4, 5, 6]) {
    for (let index = 0; index < count; index++) {
      const node = getProcessNode(index, count);
      assert.ok(
        Math.abs(Math.hypot(node.x - 310, node.y - 310) - 268.667) < 0.0001,
      );
    }
    const top = getProcessNode(0, count);
    assert.equal(top.x, 310);
    assert.ok(Math.abs(top.y - 41.333) < 0.0001);
  }
  assert.ok(getProcessNode(1, 4).x > 578);
  assert.ok(getProcessNode(2, 4).y > 578);
  assert.ok(getProcessNode(3, 4).x < 42);
});

test("all five locales render every step in the server HTML without requiring JavaScript", () => {
  for (const locale of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    const props = getContent(locale);
    const markup = renderToStaticMarkup(createElement(ProcessSection, props));
    assert.match(
      markup,
      /<section[^>]*id="process"[^>]*aria-labelledby="process-heading"/,
    );
    assert.equal((markup.match(/<li>/g) ?? []).length, 4);
    assert.equal((markup.match(/<ol /g) ?? []).length, 1);
    assert.ok(!markup.includes('data-enhanced="true"'));
    for (const step of props.steps) {
      assert.ok(step.title.length > 0);
      assert.ok(step.description.length > 0);
      assert.ok(markup.includes(step.description));
      assert.ok(step.label.includes("0"));
      assert.ok(!step.title.startsWith("Process."));
    }
  }
});

test("empty, single-step and multiple independent process sections render safely", () => {
  const props = getContent();
  assert.equal(
    renderToStaticMarkup(
      createElement(ProcessSection, { ...props, steps: [] }),
    ),
    "",
  );
  const single = renderToStaticMarkup(
    createElement(ProcessSection, { ...props, steps: props.steps.slice(0, 1) }),
  );
  assert.equal((single.match(/data-process-node=/g) ?? []).length, 1);
  assert.ok(!single.includes('data-slot="button"'));

  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(ProcessSection, {
        ...props,
        id: "first",
        steps: props.steps.slice(0, 3),
      }),
      createElement(ProcessSection, {
        ...props,
        id: "second",
        steps: [...props.steps, { ...props.steps[0], id: "fifth" }],
      }),
    ),
  );
  const ids = Array.from(
    markup.matchAll(/\sid="([^"]+)"/g),
    (match) => match[1],
  );
  assert.equal(new Set(ids).size, ids.length);
  assert.equal((markup.match(/data-process-node=/g) ?? []).length, 8);
});
