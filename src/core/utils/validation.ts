export function isRequiredFilled(value: unknown): boolean {
  return !(value === undefined || value === null || value === '');
}
