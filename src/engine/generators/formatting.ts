export function formatBooleanText(value: boolean, whenTrue: string, whenFalse = '') {
  return value ? whenTrue : whenFalse;
}
