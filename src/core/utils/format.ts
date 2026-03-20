export function formatNumber(value: number | string): string {
  const number = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(number)) return '0';
  return new Intl.NumberFormat('ar-SA').format(number || 0);
}

export function formatMultilineText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('<br/>');
}

export function nl2br(value: string | null | undefined): string {
  return formatMultilineText(value);
}

export function stripHtml(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

export function truncateText(value: string, maxLength = 120): string {
  if (!value) return '';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}
