export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ar-SA').format(value || 0);
}

export function formatMultilineText(value: string): string {
  return value.split('
').filter(Boolean).join('<br/>');
}
