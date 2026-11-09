export const pcbCapabilities = {
  thickness: { minimum: 0.2, maximum: 3.2 },
  copper: { minimum: 17, maximum: 105 },
  track: 0.08,
  gap: 0.08,
  drilling: { minimum: 0.1, maximum: 6.5, laserMinimum: 0.1 },
} as const;

export const pcbSpecificationFields = [
  { id: "layers", parameters: {} },
  { id: "material", parameters: {} },
  { id: "thickness", parameters: pcbCapabilities.thickness },
  { id: "copper", parameters: pcbCapabilities.copper },
  { id: "track", parameters: { value: pcbCapabilities.track } },
  { id: "gap", parameters: { value: pcbCapabilities.gap } },
  { id: "drilling", parameters: pcbCapabilities.drilling },
  { id: "mask", parameters: {} },
  { id: "printing", parameters: {} },
  { id: "finish", parameters: {} },
  { id: "outline", parameters: {} },
  { id: "inspection", parameters: {} },
  { id: "quality", parameters: {} },
  { id: "stencils", parameters: {} },
] as const;
