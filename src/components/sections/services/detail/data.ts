import type { TrustStatistic } from "@/components/sections/trust-strip/types";
import { pcbCapabilities } from "../pcb/data";
import { smtStencilCapabilities } from "../smt-stencils/data";

export const equipmentModels = {
  tht: {
    wave: [
      { id: "power-wave", text: "1× SEHO Power Wave N2" },
      { id: "seho-8140", text: "3× SEHO 8140-PCS" },
    ],
    selective: [{ id: "versaflow", text: "3× ERSA VERSAFLOW 3/45" }],
    manual: [
      { id: "weller", model: "Weller" },
      { id: "quick", model: "Quick" },
    ],
  },
  cleaning: { moduleClean: "1× PBT ModuleClean", mdx: "3× MDX01" },
  coating: "2× Nordson ASYMTEK SL-940",
  testing: {
    aoi: [
      { id: "comet", text: "1× SAKI BF-Comet-E" },
      { id: "sirius", text: "4× SAKI BF-Sirius" },
      { id: "3di", text: "1× SAKI 3Di-LS2-L" },
    ],
    ict: [
      {
        id: "reinhardt-470",
        model: "3× Reinhardt ATS-KMFT 470",
        fixture: "Type 147 Manual Test Fixture",
      },
      {
        id: "reinhardt-670",
        model: "1× Reinhardt ATS-KMFT 670M-5",
        fixture: "Type 42A-3 Manual Test Fixture",
      },
    ],
    oversized: "Type 52L Manual Test Fixture",
  },
} as const;

export const serviceStatistics = {
  pcb: [
    {
      id: "thickness",
      value: pcbCapabilities.thickness.minimum,
      additionalValues: [
        {
          id: "maximum",
          value: pcbCapabilities.thickness.maximum,
          prefix: "–",
        },
      ],
      suffix: " mm",
      format: { maximumFractionDigits: 1 },
    },
    {
      id: "copper",
      value: pcbCapabilities.copper.minimum,
      additionalValues: [
        { id: "maximum", value: pcbCapabilities.copper.maximum, prefix: "–" },
      ],
      suffix: " µm",
    },
    {
      id: "track",
      value: pcbCapabilities.track,
      suffix: " mm",
      format: { maximumFractionDigits: 2 },
    },
    {
      id: "gap",
      value: pcbCapabilities.gap,
      suffix: " mm",
      format: { maximumFractionDigits: 2 },
    },
  ],
  stencils: [
    { id: "hours", value: smtStencilCapabilities.expressHours },
    {
      id: "size",
      value: smtStencilCapabilities.width,
      additionalValues: [
        {
          id: "height",
          value: smtStencilCapabilities.heights[1],
          prefix: " × ",
        },
      ],
    },
    {
      id: "minimum",
      value: smtStencilCapabilities.thickness.minimum,
      suffix: " mm",
      format: { maximumFractionDigits: 2 },
    },
    {
      id: "maximum",
      value: smtStencilCapabilities.thickness.maximum,
      suffix: " mm",
      format: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    },
  ],
} as const satisfies Record<string, readonly Omit<TrustStatistic, "label">[]>;
