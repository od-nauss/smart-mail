export function formatNumber(value: number | string): string {
  const number = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(number)) return '0';

  return new Intl.NumberFormat('ar-SA').format(number);
}

export function formatDate(
  value: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(
    'ar-SA',
    options || {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
  ).format(date);
}

export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;

  return `${start} - ${end}`;
}

export function formatDuration(value: string | number): string {
  if (typeof value === 'number') {
    if (value === 1) return 'يوم واحد';
    if (value === 2) return 'يومان';
    if (value >= 3 && value <= 10) return `${formatNumber(value)} أيام`;
    return `${formatNumber(value)} يومًا`;
  }

  return value || '';
}

export function getCurrentWeekString(): string {
  const today = new Date();
  const day = today.getDay();
  const diffToSaturday = (day + 1) % 7;

  const start = new Date(today);
  start.setDate(today.getDate() - diffToSaturday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function formatMultilineText(value?: string | null): string {
  if (!value) return '';

  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('<br/>');
}

export function nl2br(value?: string | null): string {
  return formatMultilineText(value);
}

export function stripHtml(value?: string | null): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

export function truncateText(value: string, maxLength = 120): string {
  if (!value) return '';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}