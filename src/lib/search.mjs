/** Keyboard movement for the local command menu. Empty results have no selection. */
export function nextSearchIndex(current, count, direction) {
  if (count <= 0) return -1;
  const valid = Number.isInteger(current) && current >= 0 && current < count;
  if (!valid) return direction < 0 ? count - 1 : 0;
  return (current + direction + count) % count;
}
