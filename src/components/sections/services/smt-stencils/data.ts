export const smtStencilCapabilities = {
  expressHours: 24,
  width: 600,
  heights: [610, 720],
  thickness: {
    minimum: 0.05,
    standard: [0.1, 0.12, 0.13, 0.15, 0.18, 0.2, 0.25],
    maximum: 0.5,
  },
} as const;
