export const services = [
  {
    id: "smt",
    code: "01 / SMT",
    slug: "smt",
    crop: { x: -150, y: 0, width: 1397, height: 786 },
  },
  {
    id: "tht",
    code: "02 / THT",
    slug: "tht",
    crop: { x: -465, y: -19, width: 1343, height: 756 },
  },
  {
    id: "cleaning",
    code: "03 / ČIŠT",
    slug: "cleaning",
    crop: { x: -314, y: -42, width: 1385, height: 779 },
  },
  {
    id: "testing",
    code: "04 / TEST",
    slug: "testing",
    crop: { x: -61, y: -38, width: 1365, height: 768 },
  },
  {
    id: "coating",
    code: "05 / LAK",
    slug: "coating",
    crop: { x: -353, y: -73, width: 1501, height: 847 },
  },
  {
    id: "assembly",
    code: "06 / MONT",
    slug: "mechanical-assembly",
    crop: { x: -192, y: 0, width: 1269, height: 714 },
  },
  {
    id: "pcb",
    code: "07 / DPS",
    slug: "pcb",
    crop: { x: -587, y: 0, width: 1296, height: 729 },
  },
  {
    id: "stencils",
    code: "08 / ŠAB",
    slug: "smt-stencils",
    crop: { x: -57, y: 0, width: 1279, height: 720 },
  },
] as const;
