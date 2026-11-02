export type StatLayout = {
  span: number;
  rowEnd: boolean;
  lastRow: boolean;
};

/** Balance rows without leaving an orphan when the available columns allow it. */
export function getStatLayout(
  count: number,
  columns: 1 | 2 | 3 | 4,
): StatLayout[] {
  if (count === 0) return [];

  const rowCount = Math.ceil(count / columns);
  const shortRow = Math.floor(count / rowCount);
  const longerRows = count % rowCount;

  return Array.from({ length: rowCount }, (_, row) => {
    const size = shortRow + (row < longerRows ? 1 : 0);

    return Array.from({ length: size }, (_, column) => ({
      span: 12 / size,
      rowEnd: column === size - 1,
      lastRow: row === rowCount - 1,
    }));
  }).flat();
}
