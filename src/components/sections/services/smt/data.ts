export const smtStatistics = {
  lines: 4,
  placements: 40_000_000,
  boardWidth: 810,
  boardHeight: 480,
  expressHours: 24,
} as const;

export const smtProductionBlocks = [
  {
    id: "production",
    image: "/images/services/smt/production.png",
    imagePosition: "right",
  },
  {
    id: "reflow",
    image: "/images/services/smt/reflow.png",
    imagePosition: "left",
  },
] as const;

export const smtFeatureCards = [
  { id: "dimensions", icon: "/images/services/layers.svg" },
  { id: "capacity", icon: "/images/services/cpu.svg" },
  { id: "express", icon: "/images/sustainability/activity.svg" },
] as const;

export const smtPlacementEquipment = [
  { id: "ysm20z", text: "2× Yamaha YSM20 Z" },
  { id: "ys24x", text: "1× Yamaha YS24X" },
  { id: "ysm20-2b", text: "1× Yamaha YSM20-2B" },
  { id: "mg1-r", text: "1× Assembleon MG1-R" },
  { id: "topaz-xi", text: "1× Assembleon Topaz Xi" },
] as const;

export const smtReflowEquipment = [
  { id: "power-reflow", text: "1× SEHO PowerReflow" },
  { id: "heller", text: "1× HELLER 1707 MKIII" },
  { id: "flowstar", text: "1× SEHO Flowstar 4036 2.3" },
  { id: "hotflow", text: "2× ERSA HOTFLOW 4/14" },
] as const;
