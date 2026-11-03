type Contact = { x: number; y: number };

/** Keep each bend at its actual contact as translated cards grow or reflow. */
export function getHistoryTrace(contacts: readonly Contact[], height: number) {
  if (contacts.length === 0) return "";

  const first = contacts[0];
  const segments = contacts.map(({ x, y }, index) =>
    index === 0 || x === contacts[index - 1].x ? `V${y}` : `L${x} ${y}`,
  );

  return `M${first.x} 0${segments.join("")}V${height}`;
}
