import assert from "node:assert/strict";
import { test } from "node:test";
import { getHistoryTrace } from "../src/components/sections/about/history/history-trace";

// Independent reference coordinates from Figma's desktop and mobile exports.
const contactX = [0, 48, 48, 0, 0, 48, 48, 0, 0, 48, 48, 0, 0, 48, 48, 0];

test("desktop history trace reproduces Figma's bends and endpoints", () => {
  const contactY = [
    40, 88, 152, 200, 264, 312, 376, 424, 488, 536, 600, 648, 712, 760, 824,
    872,
  ];
  const contacts = contactY.map((y, index) => ({ x: contactX[index], y }));

  assert.equal(
    getHistoryTrace(contacts, 912),
    "M0 0V40L48 88V152L0 200V264L48 312V376L0 424V488L48 536V600L0 648V712L48 760V824L0 872V912",
  );
});

test("mobile history trace follows the different card heights in Figma", () => {
  const contactY = [
    81, 129, 269, 317, 435, 483, 623, 671, 811, 859, 999, 1047, 1187, 1235,
    1353, 1401,
  ];
  const contacts = contactY.map((y, index) => ({ x: contactX[index], y }));

  assert.equal(
    getHistoryTrace(contacts, 1464),
    "M0 0V81L48 129V269L0 317V435L48 483V623L0 671V811L48 859V999L0 1047V1187L48 1235V1353L0 1401V1464",
  );
});
