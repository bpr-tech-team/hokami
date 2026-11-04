type Award = {
  id: string;
  src: string;
  width: number;
  height: number;
  variant: "diploma" | "logos";
};

export const awards = [
  {
    id: "exportersPotential",
    src: "/images/about/awards/exporters-potential-2022.jpg",
    width: 1358,
    height: 1920,
    variant: "diploma",
  },
  {
    id: "czechLeader",
    src: "/images/about/awards/czech-leader-2022.jpg",
    width: 1358,
    height: 1920,
    variant: "diploma",
  },
  {
    id: "leaderCompany",
    src: "/images/about/awards/awards-leader-company.svg",
    width: 493,
    height: 215,
    variant: "logos",
  },
  {
    id: "eyTop100",
    src: "/images/about/awards/awards-ey-top100.svg",
    width: 528,
    height: 216,
    variant: "logos",
  },
] as const satisfies readonly Award[];
