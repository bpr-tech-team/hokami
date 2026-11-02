// Points in the original 732 × 556.32 Figma artwork coordinate system.
export const mapSites = [
  { id: "helsinki", x: 499.956, y: 172.752 },
  { id: "zawidow", x: 369.66, y: 300.12 },
  { id: "liberec", x: 365.268, y: 316.224 },
] as const;

// Mobile applies the Figma 620 × 471.2 crop at (-165, -77) in a 350 × 260 box.
// Labels, leaders and hit areas share these point anchors instead of separate offsets.
export const pointPositions = {
  liberec:
    "left-[41.2514%] top-[73.4%] desktop:left-[49.9%] desktop:top-[56.8421%]",
  zawidow:
    "left-[42.3143%] top-[68.1538%] desktop:left-[50.5%] desktop:top-[53.9474%]",
  helsinki:
    "left-[73.8457%] top-[26.6615%] desktop:left-[68.3%] desktop:top-[31.0526%]",
} as const;

export const calloutLayouts = {
  liberec: {
    leader: "right-0 w-8 origin-right -rotate-[35deg]",
    label: "right-8 top-[18px]",
    hit: "top-[6px] h-7",
  },
  zawidow: {
    leader: "right-0 w-[26px] origin-right rotate-[35deg]",
    label: "right-7 -top-[15px]",
    hit: "-top-[6px] h-7",
  },
  helsinki: {
    leader:
      "right-0 w-6 origin-right rotate-[40deg] desktop:right-auto desktop:left-0 desktop:w-5 desktop:origin-left desktop:rotate-0",
    label:
      "right-[25px] -top-4 desktop:top-0 desktop:right-auto desktop:left-7",
    hit: "top-0 h-10",
  },
} as const;
