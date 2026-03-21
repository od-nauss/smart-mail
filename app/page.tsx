'use client';

import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type HomeModuleKey = 'weekly' | 'operational' | 'leadership' | 'general';
type DepartmentKey = 'hospitality' | 'security' | 'medical' | 'support';
type WeeklyView = 'home' | 'form';
type InputMode = 'excel' | 'manual' | 'paste';
type HospitalityItemKey =
  | 'breakfast'
  | 'saudiCoffee'
  | 'americanCoffee'
  | 'juices'
  | 'hotDrinks'
  | 'water'
  | 'healthy'
  | 'vip';
type BreakPeriodKey = 'morning' | 'evening';

type CourseRecord = {
  title: string;
  period: string;
  participants: string;
  startDate: string;
  endDate: string;
  location: string;
};

type HospitalityRequest = {
  id: string;
  place: string;
  items: HospitalityItemKey[];
  vipCount: string;
};

type ArchiveRecord = {
  id: string;
  department: DepartmentKey;
  subject: string;
  html: string;
  plainText: string;
  createdAt: string;
  weekLabel: string;
  startDate: string;
};

const ARCHIVE_KEY = 'smart-mail-weekly-archive-v1';

const homeModules: Array<{
  key: HomeModuleKey;
  title: string;
  description: string;
  icon: string;
  accent: string;
}> = [
  {
    key: 'weekly',
    title: 'المراسلات الأسبوعية',
    description: 'المراسلات الدورية المرتبطة بتنفيذ الدورات التدريبية',
    icon: '🗓️',
    accent: '#016564',
  },
  {
    key: 'operational',
    title: 'المراسلات التشغيلية',
    description: 'طلبات الدعم والتنسيق والتشغيل',
    icon: '⚙️',
    accent: '#498983',
  },
  {
    key: 'leadership',
    title: 'مراسلات الإدارة العليا',
    description: 'الاعتمادات والموافقات والرفع للإدارة العليا',
    icon: '📌',
    accent: '#7c1e3e',
  },
  {
    key: 'general',
    title: 'المراسلات العامة',
    description: 'تذكير ومتابعة وشكر وتصعيد',
    icon: '✉️',
    accent: '#8c6968',
  },
];

const departments = [
  { key: 'hospitality' as DepartmentKey, title: 'المراسم والضيافة والإسكان', emailTo: 'PRM@nauss.edu.sa; Hospitality@nauss.edu.sa', icon: '🍽️' },
  { key: 'security' as DepartmentKey, title: 'الأمن والسلامة', emailTo: 'SSN@nauss.edu.sa', icon: '🛡️' },
  { key: 'medical' as DepartmentKey, title: 'العيادة الطبية', emailTo: 'Medical@nauss.edu.sa', icon: '🩺' },
  { key: 'support' as DepartmentKey, title: 'الخدمات المساندة', emailTo: 'ssd@nauss.edu.sa', icon: '🧹' },
];

const locations = [
  'CLASS 1',
  'CLASS 2',
  'CLASS 3',
  'CLASS 4',
  'CLASS 5',
  'CLASS 6',
  'CLASS 7',
  'CLASS 8',
  'LAB 1',
  'LAB 2',
  'LAB 3',
  'LAB 4',
  'LAB 5',
  'LAB 6',
  'مركز السلامة المرورية',
  'مركز الأمن السيبراني',
  'مركز الذكاء الاصطناعي',
  'النادي الرياضي',
  'قاعة VR',
  'معمل خبير',
  'خارجي',
];

const hospitalityPlaces = [
  'صالة الاستقبال (مبنى التدريب)',
  'اللاونج الطابق الرابع',
  'داخل قاعة التدريب',
  'النادي الرياضي',
];

const hospitalityItems: Array<{ key: HospitalityItemKey; label: string }> = [
  { key: 'breakfast', label: 'وجبات إفطار فاخرة' },
  { key: 'saudiCoffee', label: 'القهوة السعودية' },
  { key: 'americanCoffee', label: 'القهوة الأمريكية' },
  { key: 'juices', label: 'العصائر' },
  { key: 'hotDrinks', label: 'المشروبات الساخنة' },
  { key: 'water', label: 'المياه المعدنية' },
  { key: 'healthy', label: 'ضيافة صحية لمرضى الضغط والسكر' },
  { key: 'vip', label: 'ضيافة VIP' },
];

const securityOptions = [
  'تنظيم دخول المشاركين والزوار وفق القوائم المعتمدة.',
  'تسهيل الوصول إلى مبنى التدريب والقاعات المحددة.',
  'دعم نقاط الدخول خلال أوقات الذروة والانصراف.',
  'متابعة الحركة في الممرات والمواقع المرتبطة بالتنفيذ.',
  'التنسيق الفوري مع مشرفي العمليات عند أي ملاحظة تشغيلية.',
  'متابعة السلامة العامة ورفع الجاهزية خلال فترة التنفيذ.',
  'أخرى',
];

const supportOptions = [
  'نظافة قاعات التدريب.',
  'نظافة الممرات المحيطة.',
  'نظافة مداخل المبنى.',
  'نظافة النوافير.',
  'تفقد دورات المياه.',
  'متابعة النفايات وإزالتها أولًا بأول.',
  'تجهيز المستهلكات الأساسية.',
  'أخرى',
];

const excelTemplateHeaders = ['عنوان الدورة', 'نوع الفترة', 'عدد المشاركين', 'تاريخ البداية', 'تاريخ النهاية', 'الموقع'];
const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const arabicWeekdays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const HEADER_CANDIDATES = {
  title: ['اسم الدورة باللغة العربية', 'اسم الدورة', 'اسم البرنامج باللغة العربية', 'اسم البرنامج', 'عنوان الدورة', 'الدورة', 'البرنامج التدريبي'],
  period: ['الفترة', 'نوع الفترة', 'الفترة التدريبية'],
  participants: ['عدد المتدربين', 'عدد المشاركين', 'المشاركون', 'العدد المعتمد', 'العدد'],
  startDate: ['تاريخ البداية', 'تاريخ بدء التنفيذ', 'بداية التنفيذ', 'بداية الدورة', 'من', 'تاريخ البدء'],
  endDate: ['تاريخ النهاية', 'تاريخ الانتهاء', 'نهاية التنفيذ', 'نهاية الدورة', 'إلى', 'تاريخ الختام'],
  location: ['مكان التنفيذ', 'مقر التنفيذ', 'الموقع', 'موقع التنفيذ', 'القاعة', 'مكان الانعقاد'],
};

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function normalizeHeader(value: string) {
  return String(value || '')
    .replace(/[\u200f\u200e]/g, '')
    .replace(/[()\-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function normalizeArabicDigits(value: string) {
  return String(value || '')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}

function findHeader(row: Record<string, unknown>, candidates: string[]) {
  const entries = Object.keys(row);
  const map = new Map(entries.map((key) => [normalizeHeader(key), key]));
  for (const candidate of candidates) {
    const found = map.get(normalizeHeader(candidate));
    if (found) return found;
  }
  return '';
}

function parseExcelDateValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '';

  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return '';
    return `${parsed.y}-${pad2(parsed.m)}-${pad2(parsed.d)}`;
  }

  const raw = normalizeArabicDigits(String(value).trim());
  if (!raw) return '';

  const isoMatch = raw.match(/(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${pad2(Number(m))}-${pad2(Number(d))}`;
  }

  const localMatch = raw.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
  if (localMatch) {
    const [, d, m, y] = localMatch;
    return `${y}-${pad2(Number(m))}-${pad2(Number(d))}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
  }

  return '';
}

function countWorkingDays(start: string, end: string) {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate > endDate) return 0;

  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 5 && day !== 6) count += 1;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function buildDurationText(start: string, end: string) {
  const days = countWorkingDays(start, end);
  if (!days) return '';
  if (days === 1) return 'يوم واحد';
  if (days === 2) return 'يومان';
  return `${days} أيام`;
}

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return `${pad2(date.getDate())} / ${pad2(date.getMonth() + 1)} / ${date.getFullYear()}م`;
}

function formatCourseDateRange(start: string, end: string) {
  if (!start && !end) return '';
  if (start && !end) return formatDisplayDate(start);
  if (!start && end) return formatDisplayDate(end);
  if (start === end) return formatDisplayDate(start);
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`;
}

function getWeekLabelFromDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const weekNumber = Math.ceil(date.getDate() / 7);
  const weekText = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس'][weekNumber - 1] || String(weekNumber);
  return `الأسبوع ${weekText} - ${arabicMonths[date.getMonth()]}`;
}

function getFormattedStartDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return `${arabicWeekdays[date.getDay()]} ${pad2(date.getDate())} / ${pad2(date.getMonth() + 1)} / ${date.getFullYear()}م`;
}

function getAutoSubject(dateStr: string) {
  const weekLabel = getWeekLabelFromDate(dateStr);
  return weekLabel ? `تنفيذ دورات تدريبية - ${weekLabel}` : 'تنفيذ دورات تدريبية';
}

function formatTimeArabic(value: string) {
  if (!value) return '';
  const [hoursText, minutesText] = value.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText || 0);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  const suffix = hours >= 12 ? 'م' : 'ص';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${pad2(hour12)}:${pad2(minutes)} ${suffix}`;
}

function buildBreakSentence(first: string, second: string) {
  if (!first && !second) return 'يتم التنسيق لاحقًا.';
  if (first && second) return `الاستراحة الأولى: ${formatTimeArabic(first)}، والاستراحة الثانية: ${formatTimeArabic(second)}.`;
  if (first) return `الاستراحة الأولى: ${formatTimeArabic(first)}.`;
  return `الاستراحة الثانية: ${formatTimeArabic(second)}.`;
}

function smartComposeRequest(raw: string, context: 'hospitality' | 'security' | 'medical' | 'support') {
  const value = String(raw || '').trim().replace(/[.،\s]+$/g, '');
  if (!value) return '';

  if (context === 'medical') {
    return `كما نأمل من سعادتكم التكرم بـ${value}، واتخاذ ما يلزم من ترتيبات وقائية واستعدادية بما يضمن الجاهزية الطبية الملائمة طوال فترة التنفيذ.`;
  }

  if (context === 'security') {
    return `ونأمل من سعادتكم التكرم بـ${value}، والتنسيق بما يكفل انسيابية الدخول والتنظيم الميداني ورفع الجاهزية الأمنية طوال فترة التنفيذ.`;
  }

  if (context === 'support') {
    return `ونأمل من سعادتكم التكرم بـ${value}، واستكمال ما يلزم من أعمال دعم وتجهيز ومتابعة بما يحافظ على جاهزية البيئة التدريبية وجودة مظهرها التشغيلي.`;
  }

  return `كما نأمل من سعادتكم التكرم بـ${value}، واستكمال الترتيبات المناسبة وفق متطلبات التنفيذ المعتمدة خلال الفترة المحددة.`;
}

function toPlainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/(td|th)>/gi, '\t')
    .replace(/<[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t{2,}/g, '\t')
    .trim();
}

function buildCoursesTable(courses: CourseRecord[]) {
  const totalParticipants = courses.reduce((sum, item) => sum + Number(item.participants || 0), 0);

  return `
    <table dir="rtl" cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:collapse; margin-top:14px; font-family:Cairo, Arial, sans-serif; font-size:14px; border:1px solid #d6d7d4;">
      <thead>
        <tr style="background:#016564; color:#ffffff;">
          <th style="border:1px solid #d6d7d4; padding:10px;">عنوان الدورة</th>
          <th style="border:1px solid #d6d7d4; padding:10px;">نوع الفترة</th>
          <th style="border:1px solid #d6d7d4; padding:10px;">عدد المشاركين</th>
          <th style="border:1px solid #d6d7d4; padding:10px;">مدة البرنامج</th>
          <th style="border:1px solid #d6d7d4; padding:10px;">التاريخ</th>
          <th style="border:1px solid #d6d7d4; padding:10px;">الموقع</th>
        </tr>
      </thead>
      <tbody>
        ${courses
          .map(
            (item) => `
              <tr>
                <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${escapeHtml(item.title)}</td>
                <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${escapeHtml(item.period)}</td>
                <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${escapeHtml(item.participants)}</td>
                <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${escapeHtml(buildDurationText(item.startDate, item.endDate))}</td>
                <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${escapeHtml(formatCourseDateRange(item.startDate, item.endDate))}</td>
                <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${escapeHtml(item.location)}</td>
              </tr>
            `,
          )
          .join('')}
        <tr style="background:#f6f8f8; font-weight:700;">
          <td style="border:1px solid #d6d7d4; padding:10px;">المجموع</td>
          <td style="border:1px solid #d6d7d4; padding:10px;">${courses.length}</td>
          <td style="border:1px solid #d6d7d4; padding:10px;">${totalParticipants}</td>
          <td style="border:1px solid #d6d7d4; padding:10px;"></td>
          <td style="border:1px solid #d6d7d4; padding:10px;"></td>
          <td style="border:1px solid #d6d7d4; padding:10px;"></td>
        </tr>
      </tbody>
    </table>
  `;
}

function buildSimpleTable(title: string, headers: [string, string], rows: Array<[string, string]>) {
  if (!rows.length) return '';
  return `
    <div style="margin-top:16px;">
      <div style="font-weight:700; color:#016564; margin-bottom:8px;">${escapeHtml(title)}</div>
      <table dir="rtl" cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:collapse; font-family:Cairo, Arial, sans-serif; font-size:14px; border:1px solid #d6d7d4;">
        <thead>
          <tr style="background:#016564; color:#ffffff;">
            <th style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(headers[0])}</th>
            <th style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(headers[1])}</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([a, b]) => `
                <tr>
                  <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${nl2br(a)}</td>
                  <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${nl2br(b)}</td>
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function createEmptyHospitalityRequest(): HospitalityRequest {
  return {
    id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    place: hospitalityPlaces[0],
    items: [],
    vipCount: '',
  };
}

function normalizePeriod(value: string) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/مسائي|مسائية/i.test(raw)) return 'مسائية';
  if (/صباحي|صباحية/i.test(raw)) return 'صباحية';
  return raw;
}

function normalizeLocation(value: string) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const found = locations.find((item) => normalizeHeader(item) === normalizeHeader(raw));
  return found || raw;
}

function buildCourseRecord(input: Partial<CourseRecord>): CourseRecord | null {
  const title = String(input.title || '').trim();
  const period = normalizePeriod(String(input.period || '').trim());
  const participants = normalizeArabicDigits(String(input.participants || '').trim()).replace(/[^\d]/g, '');
  const startDate = parseExcelDateValue(input.startDate);
  const endDate = parseExcelDateValue(input.endDate);
  const location = normalizeLocation(String(input.location || '').trim());

  if (!title || !period || !participants || !startDate || !endDate || !location) return null;

  return { title, period, participants, startDate, endDate, location };
}

function parseSheetRows(rows: Record<string, unknown>[]) {
  const parsed: CourseRecord[] = [];

  for (const row of rows) {
    const titleKey = findHeader(row, HEADER_CANDIDATES.title);
    const periodKey = findHeader(row, HEADER_CANDIDATES.period);
    const participantsKey = findHeader(row, HEADER_CANDIDATES.participants);
    const startKey = findHeader(row, HEADER_CANDIDATES.startDate);
    const endKey = findHeader(row, HEADER_CANDIDATES.endDate);
    const locationKey = findHeader(row, HEADER_CANDIDATES.location);

    const record = buildCourseRecord({
      title: row[titleKey],
      period: row[periodKey],
      participants: row[participantsKey],
      startDate: row[startKey],
      endDate: row[endKey],
      location: row[locationKey],
    });

    if (record) parsed.push(record);
  }

  return parsed;
}

function parseCourseLine(line: string): CourseRecord | null {
  const normalized = normalizeArabicDigits(line.replace(/\u00a0/g, ' ').trim());
  if (!normalized) return null;

  if (normalized.includes('\t')) {
    const parts = normalized.split('\t').map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 6) {
      const dates = parts.filter((part) => /(\d{4}[\/-]\d{1,2}[\/-]\d{1,2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/.test(part));
      const period = parts.find((part) => /صباحي|صباحية|مسائي|مسائية/i.test(part)) || '';
      const participants = parts.find((part) => /^\d+$/.test(part)) || '';
      const location = [...parts].reverse().find((part) => locations.some((loc) => normalizeHeader(loc) === normalizeHeader(part))) || parts[parts.length - 1] || '';
      const title = parts[0] || '';
      const record = buildCourseRecord({
        title,
        period,
        participants,
        startDate: dates[0] || '',
        endDate: dates[1] || '',
        location,
      });
      if (record) return record;
    }
  }

  const dateMatches = [...normalized.matchAll(/(\d{4}[\/-]\d{1,2}[\/-]\d{1,2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/g)].map((match) => match[0]);
  const periodMatch = normalized.match(/صباحية|صباحي|مسائية|مسائي/);
  const locationMatch = locations
    .map((loc) => ({ loc, index: normalized.lastIndexOf(loc) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => b.index - a.index)[0];
  const durationMatch = normalized.match(/\d+\s*(?:أيام|ايام|يوم|يومان)/);

  if (!periodMatch || dateMatches.length < 2 || !locationMatch) return null;

  const period = periodMatch[0];
  const startDate = dateMatches[0];
  const endDate = dateMatches[1];
  const beforePeriod = normalized.slice(0, periodMatch.index).trim();
  const afterPeriod = normalized.slice((periodMatch.index || 0) + periodMatch[0].length).trim();
  const participantMatch = afterPeriod.match(/\b\d+\b/);
  const participants = participantMatch ? participantMatch[0] : '';

  let title = beforePeriod;
  if (!title) {
    title = normalized
      .replace(periodMatch[0], '')
      .replace(startDate, '')
      .replace(endDate, '')
      .replace(locationMatch.loc, '')
      .replace(durationMatch?.[0] || '', '')
      .replace(participants, '')
      .trim();
  }

  return buildCourseRecord({ title, period, participants, startDate, endDate, location: locationMatch.loc });
}

function parseRowsFromPastedText(text: string) {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const records: CourseRecord[] = [];

  for (const line of lines) {
    const normalizedLine = normalizeHeader(line);
    if (
      normalizedLine.includes(normalizeHeader('عنوان الدورة')) ||
      normalizedLine.includes(normalizeHeader('اسم الدورة')) ||
      normalizedLine.includes(normalizeHeader('تاريخ البداية'))
    ) {
      continue;
    }

    const record = parseCourseLine(line);
    if (record) records.push(record);
  }

  return records;
}

export default function HomePage() {
  const [weeklyView, setWeeklyView] = useState<WeeklyView>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('excel');
  const [systemNotice, setSystemNotice] = useState('');
  const [archiveRecords, setArchiveRecords] = useState<ArchiveRecord[]>([]);

  const [cc, setCc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [fileName, setFileName] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [courseForm, setCourseForm] = useState<CourseRecord>({
    title: '',
    period: 'صباحية',
    participants: '',
    startDate: '',
    endDate: '',
    location: locations[0],
  });

  const [enableMorningBreaks, setEnableMorningBreaks] = useState(true);
  const [enableEveningBreaks, setEnableEveningBreaks] = useState(false);
  const [morningBreak1, setMorningBreak1] = useState('09:45');
  const [morningBreak2, setMorningBreak2] = useState('11:45');
  const [eveningBreak1, setEveningBreak1] = useState('17:00');
  const [eveningBreak2, setEveningBreak2] = useState('18:10');
  const [hospitalityRequests, setHospitalityRequests] = useState<HospitalityRequest[]>([createEmptyHospitalityRequest()]);
  const [hospitalityExtra, setHospitalityExtra] = useState('');

  const [securitySelections, setSecuritySelections] = useState<string[]>([]);
  const [securityOther, setSecurityOther] = useState('');
  const [securityGate, setSecurityGate] = useState('4');
  const [attachmentsRequired, setAttachmentsRequired] = useState(true);

  const [medicalExtra, setMedicalExtra] = useState('');
  const [supportSelections, setSupportSelections] = useState<string[]>([]);
  const [supportOther, setSupportOther] = useState('');

  const selectedDeptData = useMemo(() => departments.find((item) => item.key === selectedDepartment) || null, [selectedDepartment]);
  const autoSubject = useMemo(() => getAutoSubject(startDate), [startDate]);
  const weekLabel = useMemo(() => getWeekLabelFromDate(startDate), [startDate]);
  const formattedStartDate = useMemo(() => getFormattedStartDate(startDate), [startDate]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ARCHIVE_KEY);
      if (saved) {
        setArchiveRecords(JSON.parse(saved));
      }
    } catch {
      setArchiveRecords([]);
    }
  }, []);

  useEffect(() => {
    if (!systemNotice) return;
    const timer = window.setTimeout(() => setSystemNotice(''), 3500);
    return () => window.clearTimeout(timer);
  }, [systemNotice]);

  function persistArchive(records: ArchiveRecord[]) {
    setArchiveRecords(records);
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(records));
  }

  function resetCourseForm() {
    setCourseForm({
      title: '',
      period: 'صباحية',
      participants: '',
      startDate: '',
      endDate: '',
      location: locations[0],
    });
    setEditingIndex(null);
  }

  function saveManualCourse() {
    const record = buildCourseRecord(courseForm);
    if (!record) {
      setSystemNotice('أكمل بيانات الدورة بشكل صحيح.');
      return;
    }

    if (editingIndex === null) {
      setCourses((prev) => [...prev, record]);
    } else {
      setCourses((prev) => prev.map((item, index) => (index === editingIndex ? record : item)));
    }

    resetCourseForm();
    setSystemNotice('تم حفظ بيانات الدورة.');
  }

  function editCourse(index: number) {
    setCourseForm(courses[index]);
    setEditingIndex(index);
    setInputMode('manual');
  }

  function deleteCourse(index: number) {
    setCourses((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) resetCourseForm();
    setSystemNotice('تم حذف الدورة.');
  }

  async function handleExcelUpload(file: File) {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '', raw: true });
      const validRows = parseSheetRows(rows);

      if (!validRows.length) {
        setSystemNotice('لم يتم التقاط الأعمدة المطلوبة من ملف LMS. تأكد من أن الملف يحتوي على: اسم الدورة، الفترة، عدد المتدربين، تاريخ البداية، تاريخ النهاية، مكان التنفيذ.');
        return;
      }

      setCourses(validRows);
      setFileName(file.name);
      if (!startDate && validRows[0]?.startDate) setStartDate(validRows[0].startDate);
      setSystemNotice(`تم استيراد ${validRows.length} دورة بنجاح.`);
    } catch {
      setSystemNotice('تعذر قراءة ملف Excel.');
    }
  }

  function handlePasteConvert() {
    const rows = parseRowsFromPastedText(pastedText);
    if (!rows.length) {
      setSystemNotice('تعذر فهم النص الملصوق. الصق السطور كما هي من الجدول أو من Excel.');
      return;
    }
    setCourses(rows);
    if (!startDate && rows[0]?.startDate) setStartDate(rows[0].startDate);
    setSystemNotice(`تم تحويل النص إلى ${rows.length} دورة.`);
  }

  function downloadExcelTemplate() {
    const worksheet = XLSX.utils.aoa_to_sheet([
      excelTemplateHeaders,
      ['أساليب الاستجواب المتقدمة لاكتشاف الجريمة', 'صباحية', '20', '2026-04-05', '2026-04-08', 'CLASS 1'],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses Template');
    XLSX.writeFile(workbook, 'weekly-courses-template.xlsx');
  }

  function toggleSelection(value: string, current: string[], setCurrent: (items: string[]) => void) {
    if (current.includes(value)) setCurrent(current.filter((item) => item !== value));
    else setCurrent([...current, value]);
  }

  function updateHospitalityRequest(id: string, patch: Partial<HospitalityRequest>) {
    setHospitalityRequests((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function toggleHospitalityItem(requestId: string, itemKey: HospitalityItemKey) {
    setHospitalityRequests((prev) =>
      prev.map((item) => {
        if (item.id !== requestId) return item;
        const items = item.items.includes(itemKey) ? item.items.filter((key) => key !== itemKey) : [...item.items, itemKey];
        return {
          ...item,
          items,
          vipCount: itemKey === 'vip' && item.items.includes('vip') ? '' : item.vipCount,
        };
      }),
    );
  }

  function toggleAllHospitalityItems(requestId: string) {
    setHospitalityRequests((prev) =>
      prev.map((item) => {
        if (item.id !== requestId) return item;
        const allKeys = hospitalityItems.map((entry) => entry.key);
        const allSelected = allKeys.every((key) => item.items.includes(key));
        return { ...item, items: allSelected ? [] : allKeys };
      }),
    );
  }

  function addHospitalityRequest() {
    setHospitalityRequests((prev) => [...prev, createEmptyHospitalityRequest()]);
  }

  function removeHospitalityRequest(id: string) {
    setHospitalityRequests((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  }

  function buildHospitalityRows() {
    return hospitalityRequests
      .filter((request) => request.place && request.items.length)
      .map((request) => {
        const lines = request.items.map((key) => {
          const label = hospitalityItems.find((item) => item.key === key)?.label || key;
          if (key === 'vip') {
            return request.vipCount ? `ضيافة VIP لعدد ${request.vipCount} مشارك` : 'ضيافة VIP';
          }
          return label;
        });
        return [request.place, lines.join('\n')] as [string, string];
      });
  }

  function buildSecurityText() {
    const chosen = securitySelections
      .filter((item) => item !== 'أخرى')
      .map((item) => item.replace('المعتمدة.', `المعتمدة عبر البوابة رقم (${securityGate}).`));

    if (securitySelections.includes('أخرى') && securityOther.trim()) {
      chosen.push(smartComposeRequest(securityOther, 'security'));
    }

    return chosen.join('\n');
  }

  function buildSupportText() {
    const chosen = supportSelections.filter((item) => item !== 'أخرى');
    if (supportSelections.includes('أخرى') && supportOther.trim()) {
      chosen.push(smartComposeRequest(supportOther, 'support'));
    }
    return chosen.join('\n');
  }

  function buildPreviewHtml() {
    if (!selectedDepartment || !courses.length) return '';

    const coursesTable = buildCoursesTable(courses);
    let salutation = '';
    let intro = '';
    let extra = '';
    let closing = 'وتفضلوا بقبول خالص التحية والتقدير،،،';

    if (selectedDepartment === 'hospitality') {
      salutation = `
        <p style="margin:0 0 6px 0;">سعادة مدير إدارة المراسم بالجامعة سلّمه الله</p>
        <p style="margin:0 0 16px 0;">سعادة مدير إدارة الضيافة والإسكان سلّمه الله</p>
      `;
      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، وتود الإحاطة بأنه تقرر تنفيذ عدد (${courses.length}) دورات تدريبية خلال ${escapeHtml(weekLabel || 'الأسبوع القادم')} ${formattedStartDate ? `ابتداءً من ${escapeHtml(formattedStartDate)}` : ''}، وذلك وفق البيانات التالية:
        </p>
      `;

      const breakRows: Array<[string, string]> = [];
      if (enableMorningBreaks) breakRows.push(['الدورات الصباحية', buildBreakSentence(morningBreak1, morningBreak2)]);
      if (enableEveningBreaks) breakRows.push(['الدورات المسائية', buildBreakSentence(eveningBreak1, eveningBreak2)]);

      const hospitalityRows = buildHospitalityRows();
      if (hospitalityExtra.trim()) {
        hospitalityRows.push(['متطلبات تشغيلية إضافية', smartComposeRequest(hospitalityExtra, 'hospitality')]);
      }

      extra = `
        ${buildSimpleTable('أوقات الاستراحة المعتمدة', ['الفترة', 'التوقيت'], breakRows)}
        ${buildSimpleTable('الطلبات المطلوب تأمينها خلال فترات الاستراحة', ['المكان', 'العناصر المطلوبة'], hospitalityRows)}
      `;
    }

    if (selectedDepartment === 'security') {
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير إدارة الأمن والسلامة سلّمه الله</p>`;
      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، وتفيدكم بأنه سيجري تنفيذ عدد (${courses.length}) دورات تدريبية داخل مقر الجامعة ${formattedStartDate ? `ابتداءً من ${escapeHtml(formattedStartDate)}` : ''}، ونأمل دعم الجاهزية الأمنية والتنظيمية وفق الآتي:
        </p>
      `;
      extra = `
        ${attachmentsRequired ? '<p style="margin:14px 0 12px 0; font-weight:700; color:#7c1e3e;">كما نحيطكم بأن القوائم والمرفقات التعريفية بالمشاركين ستكون مرفقة مع البريد لتمكين فرق الأمن من التحقق والسماح بالدخول والوصول إلى مبنى التدريب.</p>' : ''}
        <div style="margin-top:16px; white-space:pre-line; border:1px solid #d6d7d4; padding:12px; background:#fff;">${escapeHtml(buildSecurityText())}</div>
      `;
    }

    if (selectedDepartment === 'medical') {
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير العيادة الطبية بالجامعة سلّمه الله</p>`;
      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، وتفيدكم بأنه سيجري تنفيذ عدد من الدورات التدريبية داخل مقر الجامعة ${formattedStartDate ? `ابتداءً من ${escapeHtml(formattedStartDate)}` : ''}، وفق الجدول الآتي:
        </p>
      `;
      extra = `
        <div style="margin-top:16px; white-space:pre-line; border:1px solid #d6d7d4; padding:12px; background:#fff;">
          ${escapeHtml(
            medicalExtra.trim()
              ? smartComposeRequest(medicalExtra, 'medical')
              : 'نأمل من سعادتكم الإحاطة والاستعداد لأي حالة صحية طارئة – لا قدّر الله – خلال فترة التنفيذ، واتخاذ ما يلزم من جاهزية طبية وقائية وفق ما تقتضيه الحاجة.'
          )}
        </div>
      `;
    }

    if (selectedDepartment === 'support') {
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير إدارة الخدمات المساندة سلّمه الله</p>`;
      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، وتفيدكم بأنه سيتم تنفيذ عدد من الدورات التدريبية خلال ${escapeHtml(weekLabel || 'الأسبوع القادم')}، ونأمل التكرم باستكمال أعمال الدعم المساندة وفق الجدول التالي:
        </p>
      `;
      extra = `
        <div style="margin-top:16px; border:1px solid #d6d7d4; padding:12px; background:#fff; white-space:pre-line;">${escapeHtml(buildSupportText())}</div>
      `;
      closing = 'شاكرين لكم تعاونكم الدائم، وتفضلوا بقبول أطيب التحايا والتقدير،،،';
    }

    return `
      <div dir="rtl" style="font-family:Cairo, Arial, sans-serif; color:#1f2937; line-height:1.95; font-size:15px; background:#ffffff;">
        <table dir="rtl" cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:collapse; font-family:Cairo, Arial, sans-serif;">
          <tr>
            <td style="padding:0 0 14px 0; font-weight:700; color:#016564;">الموضوع: ${escapeHtml(autoSubject)}</td>
          </tr>
          <tr>
            <td>
              ${salutation}
              ${intro}
              ${coursesTable}
              ${extra}
              <p style="margin:18px 0 0 0;">${closing}</p>
              <br />
              <p style="margin:0;">فريق عمل إدارة عمليات التدريب</p>
              <p style="margin:0;">وكالة الجامعة للتدريب</p>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  const previewHtml = useMemo(
    () => buildPreviewHtml(),
    [
      selectedDepartment,
      courses,
      autoSubject,
      weekLabel,
      formattedStartDate,
      enableMorningBreaks,
      enableEveningBreaks,
      morningBreak1,
      morningBreak2,
      eveningBreak1,
      eveningBreak2,
      hospitalityRequests,
      hospitalityExtra,
      securitySelections,
      securityOther,
      securityGate,
      attachmentsRequired,
      medicalExtra,
      supportSelections,
      supportOther,
    ],
  );

  async function copyEmail() {
    if (!previewHtml) {
      setSystemNotice('لا توجد معاينة قابلة للنسخ.');
      return;
    }
    try {
      if (navigator.clipboard && 'write' in navigator && 'ClipboardItem' in window) {
        const item = new ClipboardItem({
          'text/html': new Blob([previewHtml], { type: 'text/html' }),
          'text/plain': new Blob([toPlainText(previewHtml)], { type: 'text/plain' }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(toPlainText(previewHtml));
      }
      setSystemNotice('تم نسخ الرسالة.');
    } catch {
      setSystemNotice('تعذر نسخ الرسالة.');
    }
  }

  function openDraft() {
    if (!selectedDeptData || !previewHtml) {
      setSystemNotice('أكمل المعاينة أولًا.');
      return;
    }
    const url = `mailto:${encodeURIComponent(selectedDeptData.emailTo)}?subject=${encodeURIComponent(autoSubject)}&cc=${encodeURIComponent(cc)}&body=${encodeURIComponent(toPlainText(previewHtml))}`;
    window.location.href = url;
  }

  function saveToArchive() {
    if (!selectedDepartment || !previewHtml) {
      setSystemNotice('أكمل البيانات أولًا ثم احفظ النسخة.');
      return;
    }
    const record: ArchiveRecord = {
      id: `a-${Date.now()}`,
      department: selectedDepartment,
      subject: autoSubject,
      html: previewHtml,
      plainText: toPlainText(previewHtml),
      createdAt: new Date().toISOString(),
      weekLabel: weekLabel || 'غير محدد',
      startDate,
    };
    const next = [record, ...archiveRecords].slice(0, 25);
    persistArchive(next);
    setSystemNotice('تم حفظ الرسالة في الأرشيف.');
  }

  function loadFromArchive(record: ArchiveRecord) {
    setSelectedDepartment(record.department);
    if (record.startDate) setStartDate(record.startDate);
    setSystemNotice(`تم استدعاء نسخة ${record.weekLabel}.`);
  }

  function deleteArchiveRecord(id: string) {
    persistArchive(archiveRecords.filter((record) => record.id !== id));
    setSystemNotice('تم حذف النسخة من الأرشيف.');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f9]">
      <Header />

      <main className="flex-1 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {weeklyView === 'home' && (
            <>
              <section className="mb-6">
                <div className="rounded-[28px] border border-[#e2e7e7] bg-white px-6 py-7 shadow-sm">
                  <h2 className="text-2xl font-semibold text-[#016564] sm:text-3xl">اختر نوع المراسلة</h2>
                  <p className="mt-2 text-sm text-[#8c6968] sm:text-base">واجهة رئيسية منظمة للوصول السريع إلى القوالب والمراسلات.</p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {homeModules.map((module) => (
                  <div key={module.key} className="rounded-[22px] border border-[#e1e5e5] bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl" style={{ backgroundColor: `${module.accent}12` }}>
                          {module.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-[#016564]">{module.title}</h3>
                          <p className="mt-0.5 text-xs text-[#8c6968]">{module.description}</p>
                        </div>
                      </div>
                    </div>

                    {module.key === 'weekly' ? (
                      <div className="rounded-2xl border border-[#e7dcc7] bg-[#fbfaf7] p-2.5">
                        <button
                          type="button"
                          onClick={() => setWeeklyView('form')}
                          className="group flex w-full items-center justify-between rounded-2xl border border-[#d0b284] bg-white px-4 py-4 text-right transition hover:border-[#016564] hover:shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#016564]/10 text-xl">📅</div>
                            <div>
                              <div className="text-sm font-semibold text-[#016564]">تنفيذ الدورات التدريبية</div>
                              <div className="mt-0.5 text-xs text-[#8c6968]">نموذج موحد لتبليغ الإدارات ذات العلاقة بالدورات القادمة</div>
                            </div>
                          </div>
                          <div className="text-[#d0b284] transition group-hover:translate-x-[-4px]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M9 6l6 6-6 6" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#d6d7d4] bg-[#fcfdfd] px-4 py-4 text-right">
                        <div className="text-sm font-semibold text-[#8c6968]">قريبًا</div>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            </>
          )}

          {weeklyView === 'form' && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-[#016564]">المراسلات الأسبوعية</h2>
                  <p className="mt-1 text-sm text-[#8c6968]">تنفيذ الدورات التدريبية</p>
                </div>
                <button type="button" onClick={() => setWeeklyView('home')} className="rounded-xl border border-[#d6d7d4] bg-white px-4 py-2 text-sm font-semibold text-[#016564]">
                  العودة للرئيسية
                </button>
              </div>

              {systemNotice ? (
                <div className="mb-4 rounded-2xl border border-[#d0b284] bg-[#fbfaf7] px-4 py-3 text-sm font-medium text-[#6b5b35]">{systemNotice}</div>
              ) : null}

              <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {departments.map((dept) => {
                  const active = selectedDepartment === dept.key;
                  return (
                    <button
                      key={dept.key}
                      type="button"
                      onClick={() => setSelectedDepartment(dept.key)}
                      className={`rounded-2xl border p-4 text-right transition ${active ? 'border-[#016564] bg-white shadow-sm' : 'border-[#e1e5e5] bg-white/80 hover:border-[#d0b284]'}`}
                    >
                      <div className="mb-2 text-2xl">{dept.icon}</div>
                      <div className="text-sm font-semibold text-[#016564]">{dept.title}</div>
                    </button>
                  );
                })}
              </section>

              <section className="grid gap-5 lg:grid-cols-[1.12fr_1fr]">
                <div className="rounded-3xl border border-[#e1e5e5] bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-[#016564]">النموذج الأسبوعي</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">الموضوع</label>
                      <input value={autoSubject} readOnly className="w-full rounded-xl border border-[#d6d7d4] bg-[#f8f9f9] px-3 py-2 text-[#016564]" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">النسخة CC</label>
                      <input value={cc} onChange={(e) => setCc(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" placeholder="اكتب البريد أو عدة عناوين" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">تاريخ بداية التنفيذ</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">بيانات التاريخ التلقائية</label>
                        <input readOnly value={[formattedStartDate, weekLabel].filter(Boolean).join(' - ')} className="w-full rounded-xl border border-[#d6d7d4] bg-[#f8f9f9] px-3 py-2 text-[#016564]" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-600">طريقة إضافة الدورات</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'excel', label: 'Excel' },
                          { key: 'manual', label: 'يدوي' },
                          { key: 'paste', label: 'لصق ذكي' },
                        ].map((mode) => (
                          <button key={mode.key} type="button" onClick={() => setInputMode(mode.key as InputMode)} className={`rounded-xl border px-3 py-2 text-sm ${inputMode === mode.key ? 'border-[#016564] bg-[#016564] text-white' : 'border-[#d6d7d4] bg-white text-[#016564]'}`}>
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {inputMode === 'excel' && (
                      <div className="rounded-2xl border border-[#e6e9e9] p-4">
                        <label className="mb-1 block text-sm text-gray-600">ملف Excel الرئيسي</label>
                        <input type="file" accept=".xlsx,.xls" onChange={(e) => e.target.files?.[0] && handleExcelUpload(e.target.files[0])} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" />
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={downloadExcelTemplate} className="rounded-xl border border-[#d0b284] bg-white px-3 py-2 text-sm text-[#016564]">تنزيل نموذج Excel</button>
                          {fileName ? <div className="text-sm text-[#016564]">تم رفع: {fileName}</div> : null}
                        </div>
                        <div className="mt-2 text-xs text-[#8c6968]">الأعمدة التي تلتقطها المنصة تلقائيًا من LMS: اسم الدورة باللغة العربية | الفترة | عدد المتدربين | تاريخ البداية | تاريخ النهاية | مكان التنفيذ</div>
                      </div>
                    )}

                    {inputMode === 'paste' && (
                      <div className="rounded-2xl border border-[#e6e9e9] p-4">
                        <label className="mb-1 block text-sm text-gray-600">الصق البيانات</label>
                        <textarea value={pastedText} onChange={(e) => setPastedText(e.target.value)} rows={6} placeholder={`اسم الدورة باللغة العربية\tالفترة\tعدد المتدربين\tتاريخ البداية\tتاريخ النهاية\tمكان التنفيذ\nأو الصق السطر كما هو من الجدول`} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                        <button type="button" onClick={handlePasteConvert} className="mt-2 rounded-xl bg-[#016564] px-4 py-2 text-sm font-semibold text-white">تحويل إلى جدول</button>
                      </div>
                    )}

                    {inputMode === 'manual' && (
                      <div className="rounded-2xl border border-[#e6e9e9] p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm text-gray-600">عنوان الدورة</label>
                            <input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-600">نوع الفترة</label>
                            <select value={courseForm.period} onChange={(e) => setCourseForm({ ...courseForm, period: e.target.value })} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]">
                              <option>صباحية</option>
                              <option>مسائية</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-600">عدد المشاركين</label>
                            <input value={courseForm.participants} onChange={(e) => setCourseForm({ ...courseForm, participants: e.target.value })} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-600">تاريخ البداية</label>
                            <input type="date" value={courseForm.startDate} onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-600">تاريخ النهاية</label>
                            <input type="date" value={courseForm.endDate} onChange={(e) => setCourseForm({ ...courseForm, endDate: e.target.value })} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-600">مدة البرنامج</label>
                            <input readOnly value={buildDurationText(courseForm.startDate, courseForm.endDate)} className="w-full rounded-xl border border-[#d6d7d4] bg-[#f8f9f9] px-3 py-2 text-[#016564]" />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm text-gray-600">الموقع</label>
                            <select value={courseForm.location} onChange={(e) => setCourseForm({ ...courseForm, location: e.target.value })} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]">
                              {locations.map((location) => (
                                <option key={location} value={location}>{location}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button type="button" onClick={saveManualCourse} className="rounded-xl bg-[#016564] px-4 py-2 text-sm font-semibold text-white">{editingIndex === null ? 'إضافة دورة' : 'حفظ التعديل'}</button>
                          {editingIndex !== null ? <button type="button" onClick={resetCourseForm} className="rounded-xl border border-[#d6d7d4] bg-white px-4 py-2 text-sm font-semibold text-[#016564]">إلغاء</button> : null}
                        </div>
                      </div>
                    )}

                    {!!courses.length && (
                      <div className="rounded-2xl border border-[#e6e9e9] p-4">
                        <div className="mb-2 text-sm font-semibold text-[#016564]">جدول الدورات</div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-[#016564] text-white">
                                <th className="border border-[#d6d7d4] px-3 py-2">عنوان الدورة</th>
                                <th className="border border-[#d6d7d4] px-3 py-2">الفترة</th>
                                <th className="border border-[#d6d7d4] px-3 py-2">المشاركون</th>
                                <th className="border border-[#d6d7d4] px-3 py-2">المدة</th>
                                <th className="border border-[#d6d7d4] px-3 py-2">تاريخ البداية</th>
                                <th className="border border-[#d6d7d4] px-3 py-2">تاريخ النهاية</th>
                                <th className="border border-[#d6d7d4] px-3 py-2">الموقع</th>
                                <th className="border border-[#d6d7d4] px-3 py-2">إجراء</th>
                              </tr>
                            </thead>
                            <tbody>
                              {courses.map((course, index) => (
                                <tr key={`${course.title}-${index}`} className="bg-white">
                                  <td className="border border-[#d6d7d4] px-3 py-2">{course.title}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2">{course.period}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2">{course.participants}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2">{buildDurationText(course.startDate, course.endDate)}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2">{formatDisplayDate(course.startDate)}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2">{formatDisplayDate(course.endDate)}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2">{course.location}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2"><div className="flex gap-2"><button type="button" onClick={() => editCourse(index)} className="text-[#016564]">تعديل</button><button type="button" onClick={() => deleteCourse(index)} className="text-[#7c1e3e]">حذف</button></div></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedDepartment === 'hospitality' && (
                      <>
                        <div className="rounded-2xl border border-[#e6e9e9] p-4">
                          <div className="mb-3 text-sm font-semibold text-[#016564]">أوقات الاستراحة</div>
                          <div className="space-y-4">
                            <div className="rounded-2xl border border-[#eef1f1] p-3">
                              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#016564]"><input type="checkbox" checked={enableMorningBreaks} onChange={(e) => setEnableMorningBreaks(e.target.checked)} />دورات صباحية</label>
                              {enableMorningBreaks ? <div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-1 block text-sm text-gray-600">الاستراحة الأولى</label><input type="time" value={morningBreak1} onChange={(e) => setMorningBreak1(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" /></div><div><label className="mb-1 block text-sm text-gray-600">الاستراحة الثانية</label><input type="time" value={morningBreak2} onChange={(e) => setMorningBreak2(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" /></div></div> : null}
                            </div>
                            <div className="rounded-2xl border border-[#eef1f1] p-3">
                              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#016564]"><input type="checkbox" checked={enableEveningBreaks} onChange={(e) => setEnableEveningBreaks(e.target.checked)} />دورات مسائية</label>
                              {enableEveningBreaks ? <div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-1 block text-sm text-gray-600">الاستراحة الأولى</label><input type="time" value={eveningBreak1} onChange={(e) => setEveningBreak1(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" /></div><div><label className="mb-1 block text-sm text-gray-600">الاستراحة الثانية</label><input type="time" value={eveningBreak2} onChange={(e) => setEveningBreak2(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" /></div></div> : null}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#e6e9e9] p-4">
                          <div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-[#016564]">الطلبات المطلوب تأمينها خلال فترات الاستراحة</div><button type="button" onClick={addHospitalityRequest} className="rounded-xl border border-[#d0b284] px-3 py-2 text-xs font-semibold text-[#016564]">إضافة مكان</button></div>
                          <div className="space-y-4">
                            {hospitalityRequests.map((request, index) => {
                              const allSelected = hospitalityItems.every((item) => request.items.includes(item.key));
                              return (
                                <div key={request.id} className="rounded-2xl border border-[#eef1f1] p-3">
                                  <div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-[#8c6968]">المكان {index + 1}</div>{hospitalityRequests.length > 1 ? <button type="button" onClick={() => removeHospitalityRequest(request.id)} className="text-xs font-semibold text-[#7c1e3e]">حذف</button> : null}</div>
                                  <div className="mb-3"><label className="mb-1 block text-sm text-gray-600">المكان</label><select value={request.place} onChange={(e) => updateHospitalityRequest(request.id, { place: e.target.value })} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2">{hospitalityPlaces.map((place) => <option key={place} value={place}>{place}</option>)}</select></div>
                                  <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#016564]"><input type="checkbox" checked={allSelected} onChange={() => toggleAllHospitalityItems(request.id)} />تحديد جميع العناصر</label>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {hospitalityItems.map((item) => (
                                      <label key={item.key} className="rounded-xl border border-[#eef1f1] px-3 py-2 text-sm flex items-center justify-between gap-3">
                                        <span>{item.label}</span>
                                        <input type="checkbox" checked={request.items.includes(item.key)} onChange={() => toggleHospitalityItem(request.id, item.key)} />
                                      </label>
                                    ))}
                                  </div>
                                  {request.items.includes('vip') ? <div className="mt-3"><label className="mb-1 block text-sm text-gray-600">ضيافة VIP لعدد</label><input value={request.vipCount} onChange={(e) => updateHospitalityRequest(request.id, { vipCount: normalizeArabicDigits(e.target.value).replace(/[^\d]/g, '') })} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="اكتب العدد" /></div> : null}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">متطلبات تشغيلية إضافية</label>
                          <textarea value={hospitalityExtra} onChange={(e) => setHospitalityExtra(e.target.value)} rows={3} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="اكتب الطلب كما تريده فقط، والمنصة ستصوغه بصياغة احترافية." />
                        </div>
                      </>
                    )}

                    {selectedDepartment === 'security' && (
                      <>
                        <div>
                          <label className="mb-1 block text-sm text-gray-600">رقم البوابة</label>
                          <input value={securityGate} onChange={(e) => setSecurityGate(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" />
                        </div>
                        <div className="rounded-2xl border border-[#e6e9e9] p-4">
                          <div className="mb-2 text-sm font-semibold text-[#016564]">طلبات الأمن والسلامة</div>
                          <div className="grid gap-2 sm:grid-cols-2">{securityOptions.map((item) => <label key={item} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={securitySelections.includes(item)} onChange={() => toggleSelection(item, securitySelections, setSecuritySelections)} />{item}</label>)}</div>
                        </div>
                        {securitySelections.includes('أخرى') ? <div><label className="mb-1 block text-sm text-gray-600">طلب أمني إضافي</label><textarea value={securityOther} onChange={(e) => setSecurityOther(e.target.value)} rows={3} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="اكتب الطلب كما تريده فقط، والمنصة ستصوغه بصياغة احترافية." /></div> : null}
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#016564]"><input type="checkbox" checked={attachmentsRequired} onChange={(e) => setAttachmentsRequired(e.target.checked)} />توجد مرفقات تعريفية بالمشاركين مرفقة مع البريد</label>
                      </>
                    )}

                    {selectedDepartment === 'medical' ? (
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">ملاحظات طبية إضافية</label>
                        <textarea value={medicalExtra} onChange={(e) => setMedicalExtra(e.target.value)} rows={4} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="مثال: أريد من العيادة الطبية توفير سيارة إسعاف" />
                      </div>
                    ) : null}

                    {selectedDepartment === 'support' ? (
                      <>
                        <div className="rounded-2xl border border-[#e6e9e9] p-4">
                          <div className="mb-2 text-sm font-semibold text-[#016564]">طلبات الخدمات المساندة</div>
                          <div className="grid gap-2 sm:grid-cols-2">{supportOptions.map((item) => <label key={item} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={supportSelections.includes(item)} onChange={() => toggleSelection(item, supportSelections, setSupportSelections)} />{item}</label>)}</div>
                        </div>
                        {supportSelections.includes('أخرى') ? <div><label className="mb-1 block text-sm text-gray-600">طلب إضافي</label><textarea value={supportOther} onChange={(e) => setSupportOther(e.target.value)} rows={3} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="اكتب الطلب كما تريده فقط، والمنصة ستصوغه بصياغة احترافية." /></div> : null}
                      </>
                    ) : null}

                    <div className="grid gap-2 sm:grid-cols-4">
                      <button onClick={saveToArchive} type="button" className="rounded-xl bg-[#016564] px-4 py-3 text-sm font-semibold text-white">حفظ في الأرشيف</button>
                      <button onClick={copyEmail} type="button" className="rounded-xl border border-[#d0b284] bg-white px-4 py-3 text-sm font-semibold text-[#016564]">نسخ الرسالة</button>
                      <button onClick={openDraft} type="button" className="rounded-xl border border-[#d6d7d4] bg-[#f8f9f9] px-4 py-3 text-sm font-semibold text-[#016564]">فتح مسودة بريد</button>
                      <button onClick={() => setSystemNotice('تصدير JPG سيكون في المرحلة التالية بعد تثبيت الأرشفة والنسخ.')} type="button" className="rounded-xl border border-[#d6d7d4] bg-white px-4 py-3 text-sm font-semibold text-[#016564]">تصدير JPG لاحقًا</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl border border-[#e1e5e5] bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-[#016564]">المعاينة</h2>
                      {selectedDeptData ? <div className="text-xs text-[#8c6968]">إلى: {selectedDeptData.emailTo}</div> : null}
                    </div>
                    <div className="min-h-[600px] rounded-2xl border border-[#eef1f1] bg-[#fcfdfd] p-4" dangerouslySetInnerHTML={{ __html: previewHtml || '<div style="color:#8c6968; font-family:Cairo, Arial, sans-serif;">اختر الإدارة، حدّد تاريخ البداية، أضف الدورات، وستُحدَّث المعاينة تلقائيًا.</div>' }} />
                  </div>

                  <div className="rounded-3xl border border-[#e1e5e5] bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold text-[#016564]">أرشيف الرسائل</h2><div className="text-xs text-[#8c6968]">آخر 25 نسخة</div></div>
                    <div className="space-y-3">
                      {archiveRecords.length ? archiveRecords.map((record) => {
                        const dept = departments.find((item) => item.key === record.department);
                        return (
                          <div key={record.id} className="rounded-2xl border border-[#eef1f1] p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-[#016564]">{record.weekLabel}</div>
                                <div className="text-xs text-[#8c6968]">{dept?.title} - {record.subject}</div>
                              </div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => loadFromArchive(record)} className="text-sm font-semibold text-[#016564]">استدعاء</button>
                                <button type="button" onClick={() => deleteArchiveRecord(record.id)} className="text-sm font-semibold text-[#7c1e3e]">حذف</button>
                              </div>
                            </div>
                          </div>
                        );
                      }) : <div className="rounded-2xl border border-dashed border-[#d6d7d4] p-4 text-sm text-[#8c6968]">لا توجد رسائل محفوظة بعد.</div>}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
