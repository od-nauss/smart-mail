import { format } from 'date-fns';

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatArabicDate(date: string | Date): string {
  if (!date) return '';
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return typeof date === 'string' ? date : '';

  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
}

export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = formatArabicDate(startDate);
  const end = formatArabicDate(endDate);
  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;
  if (start === end) return start;
  return `${start} - ${end}`;
}

export function getTodayIso(): string {
  return toISODateString(new Date());
}
