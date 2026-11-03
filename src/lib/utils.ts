import { createCn } from "cn/config";

// Keep semantic typography utilities in the same conflict groups as their
// arbitrary-value counterparts, so component className overrides still win.
export const cn = createCn({
  extend: {
    classGroups: {
      leading: [{ leading: ["body", "small"] }],
      tracking: [{ tracking: ["eyebrow", "label", "meta"] }],
    },
  },
});
