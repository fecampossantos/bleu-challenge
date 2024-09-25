export function isValidHex(str: string) {
  return /^0x[0-9a-fA-F]{64}$/.test(str);
}
