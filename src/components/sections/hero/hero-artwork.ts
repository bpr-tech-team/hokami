// Desktop: Figma 751:11080. Mobile: the unchanged 62:103 exports.
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
  via: { src?: string; width: number; height: number; stroke: string };
  vias: readonly { x: number; y: number }[];
};

export const desktopArtwork = {
  width: 1440,
  height: 2320,
  bases: [
    {
      src: "/images/hero/wide/trace1-base.svg",
      x: -0.351337,
      y: 79.64426,
      width: 1423.35,
      height: 180.856,
    },
    {
      src: "/images/hero/wide/trace2-base.svg",
      x: -0.35884,
      y: 495.5,
      width: 1419.86,
      height: 1824.5,
    },
    {
      src: "/images/hero/wide/trace3-base.svg",
      x: 119.5,
      y: -20,
      width: 81.0,
      height: 2340.0,
    },
    {
      src: "/images/hero/wide/trace4-base.svg",
      x: 1219.5,
      y: -20,
      width: 101.0,
      height: 2340.0,
    },
    {
      src: "/images/hero/wide/trace5-base.svg",
      x: 119.646447,
      y: 1419.646447,
      width: 1100.71,
      height: 160.854,
    },
    {
      src: "/images/hero/wide/trace6-base.svg",
      x: 199.646447,
      y: 1899.646447,
      width: 1020.71,
      height: 320.707,
    },
  ],
  pulses: [
    {
      x: -6.491889,
      y: 73.50196,
      width: 1435.69,
      height: 193.198,
      d: "M1428.99 6.49804V66.498L1393.99 91.498L1344.49 126.498H1259.99L1186.49 186.498H766.492L706.492 126.498H406.492L326.492 46.498H46.9919L6.49189 6.49804",
      stroke: "var(--color-brand-identity)",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: 0.0,
        y: -2.38419e-7,
        width: 1435.69,
        height: 193.198,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-1",
      nodeId: "751:11121",
    },
    {
      x: -6.50274,
      y: 489.3,
      width: 1432.2,
      height: 1836.7,
      d: "M6.50274 331.7L88.4962 247.07H190.988L272.982 166.947H539.461L621.454 86.8233H1010.92L1092.92 6.7H1346.58L1389.12 42.2547L1425.5 71.8002V640.7L1345.5 720.7V1110.7L1425.5 1190.7V1490.7L1345.5 1570.7V1830.7",
      stroke: "var(--color-brand-identity)",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: 2.38419e-7,
        y: -1.78814e-7,
        width: 1432.2,
        height: 1836.7,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-2",
      nodeId: "751:11148",
    },
    {
      x: 113.3,
      y: -26,
      width: 93.4,
      height: 2352.0,
      d: "M6.7 6V206L86.7 286V446L6.7 526V906L86.7 986V1326L6.7 1406V1806L86.7 1886V2076L6.7 2156V2346",
      stroke: "var(--color-brand-identity)",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: -1.78814e-7,
        y: 0.0,
        width: 93.4,
        height: 2352.0,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-3",
      nodeId: "751:11195",
    },
    {
      x: 1213.3,
      y: -26,
      width: 113.4,
      height: 2352.0,
      d: "M106.7 6V266L6.7 366V586L86.7 666V1156L6.7 1236V1626L86.7 1706V2006L6.7 2086V2346",
      stroke: "var(--color-brand-identity)",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: -1.78814e-7,
        y: 0.0,
        width: 113.4,
        height: 2352.0,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-4",
      nodeId: "751:11222",
    },
    {
      x: 113.50503,
      y: 1413.50503,
      width: 1112.99,
      height: 173.195,
      d: "M6.49497 6.49497L86.495 86.495H286.495L366.495 166.495H786.495L866.495 86.495H1026.49L1106.49 166.495",
      stroke: "var(--color-brand-identity)",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: -1.19209e-7,
        y: -1.19209e-7,
        width: 1112.99,
        height: 173.195,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-5",
      nodeId: "757:6137",
    },
    {
      x: 193.50503,
      y: 1893.50503,
      width: 1032.99,
      height: 332.99,
      d: "M6.49497 6.49497L86.495 86.495H366.495L446.495 166.495H786.495L866.495 246.495H946.495L1026.49 326.495",
      stroke: "var(--color-brand-identity)",
      strokeOpacity: 0.5,
      crispEdges: true,
      filter: {
        x: -1.19209e-7,
        y: -1.19209e-7,
        width: 1032.99,
        height: 332.99,
        blur: 3.0,
      },
      animation: "hokami-hero-desktop-trace-6",
      nodeId: "757:6173",
    },
  ],
  via: {
    src: "/images/hero/wide/via.svg",
    width: 9,
    height: 9,
    stroke: "var(--color-brand-identity)",
  },
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
      x: 1000.5,
      y: 571.5,
    },
    {
      x: 1215.5,
      y: 1206.5,
    },
    {
      x: 195.5,
      y: 1295.5,
    },
    {
      x: 261.5,
      y: 652.5,
    },
    {
      x: 1215.5,
      y: 335.5,
    },
    {
      x: 1335.5,
      y: 491.5,
    },
    {
      x: 1418.5,
      y: 135.5,
    },
    {
      x: 36.5,
      y: 115.5,
    },
    {
      x: 115.5,
      y: 1415.5,
    },
    {
      x: 475.5,
      y: 1575.5,
    },
    {
      x: 1215.5,
      y: 1575.5,
    },
    {
      x: 195.5,
      y: 1895.5,
    },
    {
      x: 635.5,
      y: 2055.5,
    },
    {
      x: 1215.5,
      y: 2215.5,
    },
    {
      x: 1414.5,
      y: 1675.5,
    },
  ],
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
      stroke: "var(--color-action-primary)",
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
      stroke: "var(--color-action-primary)",
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
      stroke: "var(--color-action-primary)",
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
