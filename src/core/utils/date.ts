import { format } from 'date-fns';

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatArabicDate(date: string): string {
  if (!date) return '';
  return date;
}

export function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return '';
  if (startDate === endDate) return startDate;
  return `${startDate} - ${endDate}`;
}
