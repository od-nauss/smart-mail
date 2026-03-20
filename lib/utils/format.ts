export function multiline(value: string) {
  return value.split('\n').filter(Boolean).join('\n');
}
