import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FormData } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string) {
  return value || '—';
}

export function sanitizeValue(value: unknown): string {
  if (Array.isArray(value)) return '';
  if (typeof value === 'undefined' || value === null) return '';
  return String(value).trim();
}

export function buildTableMarkdown(rows: Record<string, string>[]) {
  if (!rows?.length) return 'لا توجد بيانات.';
  return rows
    .map((row, index) => {
      const values = Object.entries(row)
        .map(([key, val]) => `${key}: ${val || '-'}`)
        .join(' | ');
      return `${index + 1}) ${values}`;
    })
    .join('\n');
}

export function replaceTableTokens(text: string, data: FormData) {
  const courses = Array.isArray(data.courses) ? (data.courses as Record<string, string>[]) : [];
  const list = buildTableMarkdown(courses);
  return text.replace(/\{coursesTable\}/g, list);
}
