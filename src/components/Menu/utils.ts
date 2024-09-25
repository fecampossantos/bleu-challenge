export function shortenId(id: string) {
  return id.slice(0, 4) + "..." + id.slice(-3);
}
