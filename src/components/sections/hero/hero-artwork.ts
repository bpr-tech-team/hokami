// Geometry and filter bounds come from Figma 62:32 / 62:103 exports.
export type HeroImagePlacement = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HeroPulsePlacement = Omit<HeroImagePlacement, "src"> & {
  d: string;
  stroke: string;
  strokeOpacity: number;
  crispEdges: boolean;
  filter: { x: number; y: number; width: number; height: number; blur: number };
  animation: string;
  nodeId: string;
};

export type HeroArtwork = {
  width: number;
  height: number;
  bases: readonly HeroImagePlacement[];
  pulses: readonly HeroPulsePlacement[];
  via: { width: number; height: number; stroke: string };
  vias: readonly { x: number; y: number }[];
};

export const desktopArtwork = {
  width: 1440,
  height: 900,
  bases: [
    {
      src: "/images/hero/desktop-trace1-base.svg",
      x: -20,
      y: 119.5,
      width: 1480.0,
      height: 201.0,
    },
    {
      src: "/images/hero/desktop-trace2-base.svg",
      x: -20,
      y: 495.5,
      width: 1480.0,
      height: 241.0,
    },
    {
      src: "/images/hero/desktop-trace3-base.svg",
      x: 119.5,
      y: -20,
      width: 81.0,
      height: 940.0,
    },
    {
      src: "/images/hero/desktop-trace4-base.svg",
      x: 1219.5,
      y: -20,
      width: 101.0,
      height: 940.0,
    },
  ],
  pulses: [
    {
      x: -26,
      y: 113.3,
      width: 1492.0,
      height: 213.4,
      d: "M6 6.7H346L426 86.7H726L786 146.7H1206L1266 206.7H1486",
      stroke: "#FE4704",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: 0.0,
        y: -1.78814e-7,
        width: 1492.0,
        height: 213.4,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-1",
      nodeId: "144:451",
    },
    {
      x: -26,
      y: 489.3,
      width: 1492.0,
      height: 253.4,
      d: "M6 246.7H206L286 166.7H546L626 86.7H1006L1086 6.7H1486",
      stroke: "#FE4704",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: 0.0,
        y: -1.78814e-7,
        width: 1492.0,
        height: 253.4,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-2",
      nodeId: "144:452",
    },
    {
      x: 113.3,
      y: -26,
      width: 93.4,
      height: 952.0,
      d: "M6.7 6V206L86.7 286V446L6.7 526V946",
      stroke: "#FE4704",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: -1.78814e-7,
        y: 0.0,
        width: 93.4,
        height: 952.0,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-3",
      nodeId: "144:453",
    },
    {
      x: 1213.3,
      y: -26,
      width: 113.4,
      height: 952.0,
      d: "M106.7 6V266L6.7 366V586L86.7 666V946",
      stroke: "#FE4704",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: -1.78814e-7,
        y: 0.0,
        width: 113.4,
        height: 952.0,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-4",
      nodeId: "144:454",
    },
  ],
  vias: [
    {
      x: 395.5,
      y: 195.5,
    },
    {
      x: 755.5,
      y: 255.5,
    },
    {
      x: 975.5,
      y: 571.5,
    },
    {
      x: 256.5,
      y: 651.5,
    },
    {
      x: 115.5,
      y: 176.5,
    },
    {
      x: 1215.5,
      y: 335.5,
    },
  ],
  via: {
    stroke: "var(--color-brand-identity)",
    width: 9.0,
    height: 9.0,
  },
} as const satisfies HeroArtwork;

export const mobileArtwork = {
  width: 390,
  height: 489,
  bases: [],
  pulses: [
    {
      x: -15,
      y: 31.755318450927735,
      width: 420.0,
      height: 36.3702,
      d: "M5 5.7H135L159 30.6702H275L299 5.7H415",
      stroke: "#CC3700",
      strokeOpacity: 1.0,
      crispEdges: false,
      filter: {
        x: 0.0,
        y: -1.78814e-7,
        width: 420.0,
        height: 36.3702,
        blur: 2.5,
      },
      animation: "hokami-hero-mobile-trace-1",
      nodeId: "155:598",
    },
    {
      x: -15,
      y: 433.3595703125,
      width: 420.0,
      height: 36.3702,
      d: "M5 30.6702H85L109 5.7H245L269 30.6702H415",
      stroke: "#CC3700",
      strokeOpacity: 1.0,
      crispEdges: false,
      filter: {
        x: 0.0,
        y: -1.78814e-7,
        width: 420.0,
        height: 36.3702,
        blur: 2.5,
      },
      animation: "hokami-hero-mobile-trace-2",
      nodeId: "155:599",
    },
    {
      x: 346.3,
      y: -15.404254913330078,
      width: 31.4,
      height: 519.808,
      d: "M5.7 5V115.285L25.7 136.094V327.532L5.7 348.34V514.809",
      stroke: "#CC3700",
      strokeOpacity: 1.0,
      crispEdges: false,
      filter: {
        x: -1.78814e-7,
        y: 0.0,
        width: 31.4,
        height: 519.809,
        blur: 2.5,
      },
      animation: "hokami-hero-mobile-trace-3",
      nodeId: "155:600",
    },
  ],
  vias: [
    {
      x: 140.5,
      y: 58.804256439208984,
    },
    {
      x: 280.5,
      y: 33.834041595458984,
    },
    {
      x: 90.5,
      y: 435.43829345703125,
    },
    {
      x: 250.5,
      y: 460.40850830078125,
    },
    {
      x: 368.5,
      y: 117.06808471679688,
    },
    {
      x: 348.5,
      y: 329.31488037109375,
    },
  ],
  via: {
    stroke: "var(--color-action-primary)",
    width: 7.0,
    height: 7.24255,
  },
} as const satisfies HeroArtwork;
