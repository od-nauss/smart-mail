'use client';

import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type HomeModuleKey = 'weekly' | 'operational' | 'leadership' | 'general';
type DepartmentKey = 'hospitality' | 'security' | 'medical' | 'support';
type WeeklyView = 'home' | 'form';
type InputMode = 'excel' | 'manual' | 'paste';
type BreakPeriod = 'صباحية' | 'مسائية';

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
  items: string[];
  vipCount: string;
};

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
    description: 'الاعتمادات والموافقات والرفع للادارة العليا',
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
  { key: 'hospitality' as DepartmentKey, title: 'المراسم والضيافة', emailTo: 'PRM@nauss.edu.sa; Hospitality@nauss.edu.sa', icon: '🍽️' },
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

const hospitalityItems = [
  'وجبات إفطار فاخرة',
  'القهوة السعودية',
  'القهوة الأمريكية',
  'العصائر',
  'المشروبات الساخنة',
  'المياه المعدنية',
  'ضيافة صحية لمرضى الضغط والسكر',
  'ضيافة VIP',
];

const securityOptions = [
  'تسهيل دخول المشاركين عبر البوابة المحددة',
  'توجيه المشاركين إلى مقرات التدريب',
  'المتابعة الدورية في الممرات',
  'المتابعة الدورية في القاعات',
  'التنسيق مع مشرف العمليات عند الحاجة',
  'ضبط الدخول للمواقع الحساسة',
  'متابعة السلامة العامة أثناء التنفيذ',
  'أخرى',
];

const supportOptions = [
  'تنظيف قاعات التدريب',
  'تنظيف الممرات المحيطة',
  'تنظيف استراحات المتدربين',
  'متابعة النظافة اليومية',
  'تجهيز المستهلكات الأساسية',
  'تفقد دورات المياه',
  'متابعة النفايات وإزالتها',
  'تنسيق الطاولات والكراسي',
  'نظافة مداخل المبنى',
  'نظافة النوافير',
  'أخرى',
];

const excelTemplateHeaders = [
  'عنوان الدورة',
  'نوع الفترة',
  'عدد المشاركين',
  'مدة البرنامج',
  'تاريخ البداية',
  'تاريخ النهاية',
  'الموقع',
];

const arabicMonths = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const arabicWeekdays = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

const periodAliases: Record<string, string> = {
  صباحي: 'صباحية',
  صباحية: 'صباحية',
  morning: 'صباحية',
  am: 'صباحية',
  مسائي: 'مسائية',
  مسائية: 'مسائية',
  evening: 'مسائية',
  pm: 'مسائية',
};

const headerAliases = {
  title: ['عنوان الدورة', 'اسم الدورة', 'الدورة', 'program title', 'course title', 'course name', 'title'],
  period: ['نوع الفترة', 'الفترة', 'period', 'session', 'time period'],
  participants: ['عدد المشاركين', 'المشاركين', 'عدد المتدربين', 'participants', 'trainees', 'count'],
  startDate: ['تاريخ البداية', 'بداية الدورة', 'من', 'start date', 'start', 'from'],
  endDate: ['تاريخ النهاية', 'نهاية الدورة', 'إلى', 'end date', 'end', 'to'],
  location: ['الموقع', 'مقر التنفيذ', 'القاعة', 'location', 'venue', 'site', 'room'],
};

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function getWeekLabelFromDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const weekNumber = Math.ceil(date.getDate() / 7);
  const weekText = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس'][weekNumber - 1] || String(weekNumber);
  const month = arabicMonths[date.getMonth()];
  return `الأسبوع ${weekText} - ${month}`;
}

function getFormattedStartDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const weekday = arabicWeekdays[date.getDay()];
  return `${weekday} ${pad2(date.getDate())} / ${pad2(date.getMonth() + 1)} / ${date.getFullYear()}م`;
}

function getAutoSubject(dateStr: string) {
  const weekLabel = getWeekLabelFromDate(dateStr);
  return weekLabel ? `تنفيذ دورات تدريبية - ${weekLabel}` : 'تنفيذ دورات تدريبية';
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
  if (days === 1) return '1 يوم';
  if (days === 2) return '2 يوم';
  return `${days} أيام`;
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

function toPlainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, '\t')
    .replace(/<\/th>/gi, '\t')
    .replace(/<[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeHeader(value: string) {
  return String(value)
    .toLowerCase()
    .replace(/[\u200f\u200e]/g, '')
    .replace(/[\s_\-\/\\]+/g, '')
    .trim();
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

function excelSerialToDate(value: number) {
  const utcDays = Math.floor(value - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  return `${dateInfo.getUTCFullYear()}-${pad2(dateInfo.getUTCMonth() + 1)}-${pad2(dateInfo.getUTCDate())}`;
}

function parseDateValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return excelSerialToDate(value);
  }

  const raw = String(value).trim();
  if (!raw) return '';

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(raw)) {
    const [year, month, day] = raw.split('-');
    return `${year}-${pad2(Number(month))}-${pad2(Number(day))}`;
  }

  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(raw)) {
    const [day, month, year] = raw.split('/');
    return `${year}-${pad2(Number(month))}-${pad2(Number(day))}`;
  }

  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(raw)) {
    const [day, month, year] = raw.split('-');
    return `${year}-${pad2(Number(month))}-${pad2(Number(day))}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
  }

  return '';
}

function normalizePeriod(value: unknown) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const key = raw.toLowerCase();
  return periodAliases[key] || raw;
}

function normalizeLocation(value: unknown) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const matched = locations.find((item) => normalizeHeader(item) === normalizeHeader(raw));
  return matched || raw;
}

function sanitizeParticipants(value: unknown) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const digits = raw.replace(/[^0-9]/g, '');
  return digits || raw;
}

function sanitizeCourseRecord(record: Partial<CourseRecord>): CourseRecord | null {
  const title = String(record.title ?? '').trim();
  const period = normalizePeriod(record.period);
  const participants = sanitizeParticipants(record.participants);
  const startDate = parseDateValue(record.startDate);
  const endDate = parseDateValue(record.endDate);
  const location = normalizeLocation(record.location);

  const nonEmptyCount = [title, period, participants, startDate, endDate, location].filter(Boolean).length;
  if (nonEmptyCount < 2) return null;

  return {
    title,
    period,
    participants,
    startDate,
    endDate,
    location,
  };
}

function mapRowToCourse(row: Record<string, unknown>) {
  const titleKey = findHeader(row, headerAliases.title);
  const periodKey = findHeader(row, headerAliases.period);
  const participantsKey = findHeader(row, headerAliases.participants);
  const startKey = findHeader(row, headerAliases.startDate);
  const endKey = findHeader(row, headerAliases.endDate);
  const locationKey = findHeader(row, headerAliases.location);

  return sanitizeCourseRecord({
    title: String(row[titleKey] ?? ''),
    period: String(row[periodKey] ?? ''),
    participants: String(row[participantsKey] ?? ''),
    startDate: String(row[startKey] ?? ''),
    endDate: String(row[endKey] ?? ''),
    location: String(row[locationKey] ?? ''),
  });
}

function parseRowsFromPastedText(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [] as CourseRecord[];

  const splitLine = (line: string) => {
    if (line.includes('\t')) return line.split('\t').map((item) => item.trim());
    if (line.includes('|')) return line.split('|').map((item) => item.trim());
    return line.split(',').map((item) => item.trim());
  };

  const headerCells = splitLine(lines[0]);
  const headerMap: Record<string, number> = {};

  headerCells.forEach((cell, index) => {
    const normalized = normalizeHeader(cell);
    if (headerAliases.title.some((alias) => normalizeHeader(alias) === normalized)) headerMap.title = index;
    if (headerAliases.period.some((alias) => normalizeHeader(alias) === normalized)) headerMap.period = index;
    if (headerAliases.participants.some((alias) => normalizeHeader(alias) === normalized)) headerMap.participants = index;
    if (headerAliases.startDate.some((alias) => normalizeHeader(alias) === normalized)) headerMap.startDate = index;
    if (headerAliases.endDate.some((alias) => normalizeHeader(alias) === normalized)) headerMap.endDate = index;
    if (headerAliases.location.some((alias) => normalizeHeader(alias) === normalized)) headerMap.location = index;
  });

  const hasHeaderMap = Object.keys(headerMap).length >= 3;
  const dataLines = hasHeaderMap ? lines.slice(1) : lines;

  const rows: CourseRecord[] = [];

  for (const line of dataLines) {
    const parts = splitLine(line);
    if (parts.length < 2) continue;

    const record = hasHeaderMap
      ? sanitizeCourseRecord({
          title: parts[headerMap.title ?? -1] ?? '',
          period: parts[headerMap.period ?? -1] ?? '',
          participants: parts[headerMap.participants ?? -1] ?? '',
          startDate: parts[headerMap.startDate ?? -1] ?? '',
          endDate: parts[headerMap.endDate ?? -1] ?? '',
          location: parts[headerMap.location ?? -1] ?? '',
        })
      : sanitizeCourseRecord({
          title: parts[0] ?? '',
          period: parts[1] ?? '',
          participants: parts[2] ?? '',
          startDate: parts[3] ?? '',
          endDate: parts[4] ?? '',
          location: parts[5] ?? '',
        });

    if (record) rows.push(record);
  }

  return rows.filter((item) => item.title || item.startDate || item.location);
}

function buildCoursesTable(courses: CourseRecord[]) {
  const totalParticipants = courses.reduce((sum, item) => sum + Number(item.participants || 0), 0);

  return `
    <table dir="rtl" border="1" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; margin-top:12px; font-family:Cairo, Arial, sans-serif; font-size:14px; border:1px solid #d6d7d4;">
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
            <td style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(item.title)}</td>
            <td style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(item.period)}</td>
            <td style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(item.participants)}</td>
            <td style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(buildDurationText(item.startDate, item.endDate))}</td>
            <td style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(formatCourseDateRange(item.startDate, item.endDate))}</td>
            <td style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(item.location)}</td>
          </tr>
        `
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
  return `
    <div style="margin-top:16px;">
      <div style="font-weight:700; color:#016564; margin-bottom:8px;">${escapeHtml(title)}</div>
      <table dir="rtl" border="1" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; font-family:Cairo, Arial, sans-serif; font-size:14px; border:1px solid #d6d7d4;">
        <thead>
          <tr style="background:#eef5f5;">
            <th style="border:1px solid #d6d7d4; padding:10px; width:32%;">${escapeHtml(headers[0])}</th>
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
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function formatTimeWithMeridiem(value: string) {
  if (!value) return '';
  const [hourStr, minuteStr] = value.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;
  const suffix = hour >= 12 ? 'م' : 'ص';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${pad2(displayHour)}:${pad2(minute)} ${suffix}`;
}

function buildBreakRange(start: string, end: string) {
  if (!start && !end) return '';
  if (start && !end) return formatTimeWithMeridiem(start);
  if (!start && end) return formatTimeWithMeridiem(end);
  return `من ${formatTimeWithMeridiem(start)} إلى ${formatTimeWithMeridiem(end)}`;
}

function createHospitalityRequest(): HospitalityRequest {
  return {
    id: `hr-${Math.random().toString(36).slice(2, 9)}`,
    place: hospitalityPlaces[0],
    items: [],
    vipCount: '',
  };
}

function buildWordCompatibleHtml(content: string) {
  return `
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body dir="rtl" style="margin:0; padding:0; font-family:Cairo, Arial, sans-serif;">
        ${content}
      </body>
    </html>
  `;
}

export default function HomePage() {
  const [weeklyView, setWeeklyView] = useState<WeeklyView>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey>('hospitality');

  const [cc, setCc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [fileName, setFileName] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('excel');
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

  const [hospitalityBreakPeriod, setHospitalityBreakPeriod] = useState<BreakPeriod>('صباحية');
  const [break1Start, setBreak1Start] = useState('09:45');
  const [break1End, setBreak1End] = useState('10:15');
  const [break2Start, setBreak2Start] = useState('11:45');
  const [break2End, setBreak2End] = useState('12:15');
  const [hospitalityRequests, setHospitalityRequests] = useState<HospitalityRequest[]>([createHospitalityRequest()]);
  const [hospitalityExtra, setHospitalityExtra] = useState('');

  const [securitySelections, setSecuritySelections] = useState<string[]>([]);
  const [securityOther, setSecurityOther] = useState('');
  const [securityGate, setSecurityGate] = useState('4');

  const [medicalExtra, setMedicalExtra] = useState('');
  const [supportSelections, setSupportSelections] = useState<string[]>([]);
  const [supportOther, setSupportOther] = useState('');

  const selectedDeptData = useMemo(
    () => departments.find((item) => item.key === selectedDepartment) || null,
    [selectedDepartment]
  );

  const autoSubject = useMemo(() => getAutoSubject(startDate), [startDate]);
  const weekLabel = useMemo(() => getWeekLabelFromDate(startDate), [startDate]);
  const formattedStartDate = useMemo(() => getFormattedStartDate(startDate), [startDate]);

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
    const sanitized = sanitizeCourseRecord(courseForm);
    if (!sanitized?.title || !sanitized.participants || !sanitized.startDate || !sanitized.endDate || !sanitized.location) {
      alert('أكمل بيانات الدورة');
      return;
    }

    if (editingIndex === null) {
      setCourses((prev) => [...prev, sanitized]);
    } else {
      setCourses((prev) => prev.map((item, index) => (index === editingIndex ? sanitized : item)));
    }

    resetCourseForm();
  }

  function editCourse(index: number) {
    setCourseForm(courses[index]);
    setEditingIndex(index);
    setInputMode('manual');
  }

  function deleteCourse(index: number) {
    setCourses((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) resetCourseForm();
  }

  async function handleExcelUpload(file: File) {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

      if (!rows.length) {
        alert('ملف Excel فارغ');
        return;
      }

      const parsedRows = rows.map(mapRowToCourse).filter(Boolean) as CourseRecord[];
      const validRows = parsedRows.filter(
        (item) => item.title || item.period || item.participants || item.startDate || item.endDate || item.location
      );

      if (!validRows.length) {
        alert('لم يتم التعرف على الأعمدة المطلوبة في ملف Excel');
        return;
      }

      setCourses(validRows);
      setFileName(file.name);
      alert(`تم استيراد ${validRows.length} دورة`);
    } catch {
      alert('تعذر قراءة ملف Excel');
    }
  }

  function handlePasteConvert() {
    const rows = parseRowsFromPastedText(pastedText);
    if (!rows.length) {
      alert('تعذر قراءة النص الملصوق');
      return;
    }
    setCourses(rows);
    alert(`تم تحويل النص إلى جدول دورات بعدد ${rows.length}`);
  }

  function downloadExcelTemplate() {
    const worksheet = XLSX.utils.aoa_to_sheet([
      excelTemplateHeaders,
      ['تحليل بيانات الجرائم للجهات الأمنية', 'صباحية', '14', '', '2026-03-23', '2026-03-27', 'مركز الأمن السيبراني'],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses Template');
    XLSX.writeFile(workbook, 'weekly-courses-template.xlsx');
  }

  function addHospitalityRequest() {
    setHospitalityRequests((prev) => {
      if (prev.length >= 4) return prev;
      return [...prev, createHospitalityRequest()];
    });
  }

  function removeHospitalityRequest(id: string) {
    setHospitalityRequests((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== id)));
  }

  function updateHospitalityRequest(id: string, updates: Partial<HospitalityRequest>) {
    setHospitalityRequests((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...updates };
        if (updates.items && !updates.items.includes('ضيافة VIP')) {
          next.vipCount = '';
        }
        return next;
      })
    );
  }

  function toggleHospitalityItem(requestId: string, item: string) {
    setHospitalityRequests((prev) =>
      prev.map((request) => {
        if (request.id !== requestId) return request;
        const items = request.items.includes(item)
          ? request.items.filter((current) => current !== item)
          : [...request.items, item];
        return {
          ...request,
          items,
          vipCount: items.includes('ضيافة VIP') ? request.vipCount : '',
        };
      })
    );
  }

  function toggleAllHospitalityItems(requestId: string) {
    setHospitalityRequests((prev) =>
      prev.map((request) => {
        if (request.id !== requestId) return request;
        const allSelected = hospitalityItems.every((item) => request.items.includes(item));
        return {
          ...request,
          items: allSelected ? [] : [...hospitalityItems],
          vipCount: allSelected ? '' : request.vipCount,
        };
      })
    );
  }

  function toggleMultiValue(value: string, current: string[], setCurrent: (items: string[]) => void) {
    if (current.includes(value)) {
      setCurrent(current.filter((item) => item !== value));
    } else {
      setCurrent([...current, value]);
    }
  }

  function buildHospitalityTableRows() {
    const rows: Array<[string, string]> = hospitalityRequests
      .filter((request) => request.place && request.items.length)
      .map((request) => {
        const items = request.items.map((item) => {
          if (item === 'ضيافة VIP' && request.vipCount.trim()) {
            return `ضيافة VIP لعدد ${request.vipCount.trim()}`;
          }
          return item;
        });

        return [request.place, items.join('\n')] as [string, string];
      });

    if (hospitalityExtra.trim()) {
      rows.push(['ملاحظات تشغيلية إضافية', hospitalityExtra.trim()]);
    }

    return rows.length ? rows : ([['لا يوجد', 'لا توجد طلبات إضافية محددة']] as Array<[string, string]>);
  }

  function buildSecurityText() {
    const chosen = securitySelections
      .filter((item) => item !== 'أخرى')
      .map((item) => item.replace('البوابة المحددة', `البوابة رقم (${securityGate})`));

    if (securitySelections.includes('أخرى') && securityOther.trim()) {
      chosen.push(securityOther.trim());
    }

    return chosen.length ? chosen.join('\n') : 'حسب ما تقتضيه الحاجة التشغيلية.';
  }

  function buildSupportText() {
    const chosen = supportSelections.filter((item) => item !== 'أخرى');

    if (supportSelections.includes('أخرى') && supportOther.trim()) {
      chosen.push(supportOther.trim());
    }

    return chosen.length ? chosen.join('\n') : 'حسب ما تقتضيه الحاجة التشغيلية.';
  }

  const livePreviewHtml = useMemo(() => {
    if (!selectedDepartment) {
      return '<div style="color:#8c6968; font-family:Cairo, Arial, sans-serif;">اختر الإدارة المطلوبة.</div>';
    }

    if (!courses.length) {
      return '<div style="color:#8c6968; font-family:Cairo, Arial, sans-serif;">أضف الدورات أولًا، ثم ستظهر المعاينة مباشرة حسب الإدارة المختارة.</div>';
    }

    const coursesTable = buildCoursesTable(courses);
    let salutation = '';
    let intro = '';
    let extra = '';
    let closing = 'وتفضلوا بقبول وافر التحية والتقدير،،،';

    if (selectedDepartment === 'hospitality') {
      salutation = `
        <p style="margin:0 0 6px 0;">سعادة مدير إدارة المراسم بالجامعة سلّمه الله</p>
        <p style="margin:0 0 16px 0;">سعادة مدير إدارة الضيافة والإسكان سلّمه الله</p>
      `;

      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، ونود إشعاركم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد (${courses.length}) دورات تدريبية في مقر الجامعة ${formattedStartDate ? `ابتداءً من ${escapeHtml(formattedStartDate)}` : ''}، حسب البيانات التالية:
        </p>
      `;

      extra = `
        ${buildSimpleTable('أوقات الاستراحة', ['الفترة', 'التوقيت'], [
          ['الاستراحة الأولى', buildBreakRange(break1Start, break1End)],
          ['الاستراحة الثانية', buildBreakRange(break2Start, break2End)],
          ['نوع الفترة المعتمدة', hospitalityBreakPeriod],
        ])}
        ${buildSimpleTable('الطلبات المطلوب تأمينها خلال فترات الاستراحة', ['المكان', 'العناصر المطلوبة'], buildHospitalityTableRows())}
      `;
    }

    if (selectedDepartment === 'security') {
      salutation = '<p style="margin:0 0 16px 0;">سعادة مدير إدارة الأمن والسلامة سلّمه الله</p>';

      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، وتفيدكم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد (${courses.length}) من الدورات التدريبية داخل مقر الجامعة ${formattedStartDate ? `وتبدأ من ${escapeHtml(formattedStartDate)}` : ''}.
        </p>
      `;

      extra = `
        <div style="margin-top:16px; border:1px solid #d6d7d4; padding:12px; background:#fff; white-space:pre-line;">${escapeHtml(buildSecurityText())}</div>
      `;
    }

    if (selectedDepartment === 'medical') {
      salutation = '<p style="margin:0 0 16px 0;">سعادة مدير العيادة الطبية بالجامعة سلّمه الله</p>';

      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، ونفيدكم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد من الدورات التدريبية داخل مقر الجامعة ${formattedStartDate ? `ابتداءً من ${escapeHtml(formattedStartDate)}` : ''}، موزعة على النحو التالي:
        </p>
      `;

      extra = `
        <div style="margin-top:16px; white-space:pre-line; border:1px solid #d6d7d4; padding:12px; background:#fff;">
          ${escapeHtml(
            medicalExtra.trim() ||
              'وذلك للتنبيه والاستعداد لأي حالة صحية طارئة – لا قدّر الله – خلال فترة التنفيذ.\nنأمل منكم التكرم بالتوجيه بما يلزم من ترتيبات طبية وقائية، وتحديد ما ترونه مناسبًا من جاهزية وفق ما تقتضيه الحاجة.'
          )}
        </div>
      `;
    }

    if (selectedDepartment === 'support') {
      salutation = '<p style="margin:0 0 16px 0;">سعادة مدير إدارة الخدمات المساندة سلّمه الله</p>';

      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب في وكالة الجامعة للتدريب أطيب التحايا، ونفيدكم بأنه سيتم تنفيذ عدد من الدورات التدريبية بمقر الجامعة خلال الفترة القادمة، وذلك حسب التفصيل التالي:
        </p>
      `;

      extra = `
        <div style="margin-top:16px; border:1px solid #d6d7d4; padding:12px; background:#fff;">
          <p style="margin:0 0 10px 0;">وعليه، نأمل من سعادتكم التكرم بالتوجيه نحو:</p>
          <div style="white-space:pre-line;">${escapeHtml(buildSupportText())}</div>
        </div>
      `;

      closing = 'شاكرين لكم تعاونكم الدائم، وتفضلوا بقبول أطيب التحايا والتقدير،،،';
    }

    return `
      <div dir="rtl" style="font-family:Cairo, Arial, sans-serif; color:#1f2937; line-height:1.9; font-size:15px;">
        <p style="margin:0 0 10px 0; font-weight:700;">الموضوع: ${escapeHtml(autoSubject)}</p>
        ${salutation}
        ${intro}
        ${coursesTable}
        ${extra}
        <p style="margin:18px 0 0 0;">${closing}</p>
        <br />
        <p style="margin:0;">فريق عمل إدارة عمليات التدريب</p>
        <p style="margin:0;">وكالة الجامعة للتدريب</p>
      </div>
    `;
  }, [
    selectedDepartment,
    courses,
    formattedStartDate,
    autoSubject,
    hospitalityBreakPeriod,
    break1Start,
    break1End,
    break2Start,
    break2End,
    hospitalityRequests,
    hospitalityExtra,
    securitySelections,
    securityOther,
    securityGate,
    medicalExtra,
    supportSelections,
    supportOther,
  ]);

  function generateEmail() {
    if (!selectedDepartment) {
      alert('اختر الإدارة');
      return;
    }

    if (!courses.length) {
      alert('أدخل الدورات أولًا');
      return;
    }

    alert('تم تحديث المعاينة وفق البيانات الحالية');
  }

  async function copyEmail() {
    if (!livePreviewHtml) return;

    try {
      const htmlDocument = buildWordCompatibleHtml(livePreviewHtml);
      if (navigator.clipboard && 'write' in navigator && (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem) {
        const item = new ClipboardItem({
          'text/html': new Blob([htmlDocument], { type: 'text/html' }),
          'text/plain': new Blob([toPlainText(livePreviewHtml)], { type: 'text/plain' }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(toPlainText(livePreviewHtml));
      }
      alert('تم نسخ الرسالة. ملاحظة: Outlook قد يغيّر بعض التنسيق عند اللصق، لذلك سنجهز لاحقًا حل الأرشفة/التصدير والصورة كمرحلة ثانية.');
    } catch {
      alert('تعذر نسخ الرسالة');
    }
  }

  function openDraft() {
    if (!selectedDeptData || !livePreviewHtml) return;
    const url = `mailto:${encodeURIComponent(selectedDeptData.emailTo)}?subject=${encodeURIComponent(autoSubject)}&cc=${encodeURIComponent(cc)}&body=${encodeURIComponent(toPlainText(livePreviewHtml))}`;
    window.location.href = url;
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
                  <h2 className="text-2xl font-semibold text-[#016564] sm:text-3xl">
                    اختر نوع المراسلة
                  </h2>
                  <p className="mt-2 text-sm text-[#8c6968] sm:text-base">
                    واجهة رئيسية منظمة للوصول السريع إلى القوالب والمراسلات.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {homeModules.map((module) => (
                  <div
                    key={module.key}
                    className="rounded-[22px] border border-[#e1e5e5] bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl"
                          style={{ backgroundColor: `${module.accent}12` }}
                        >
                          {module.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-[#016564]">
                            {module.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-[#8c6968]">
                            {module.description}
                          </p>
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
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#016564]/10 text-xl">
                              📅
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-[#016564]">
                                تنفيذ الدورات التدريبية
                              </div>
                              <div className="mt-0.5 text-xs text-[#8c6968]">
                                نموذج موحد لتبليغ ادارات المراسم والضيافة والأمن والعيادة الطبية بالدورات القادمة
                              </div>
                            </div>
                          </div>

                          <div className="text-[#d0b284] transition group-hover:translate-x-[-4px]">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
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

                <button
                  type="button"
                  onClick={() => setWeeklyView('home')}
                  className="rounded-xl border border-[#d6d7d4] bg-white px-4 py-2 text-sm font-semibold text-[#016564]"
                >
                  العودة للرئيسية
                </button>
              </div>

              <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {departments.map((dept) => {
                  const active = selectedDepartment === dept.key;
                  return (
                    <button
                      key={dept.key}
                      type="button"
                      onClick={() => setSelectedDepartment(dept.key)}
                      className={`rounded-2xl border p-4 text-right transition ${
                        active
                          ? 'border-[#016564] bg-white shadow-sm'
                          : 'border-[#e1e5e5] bg-white/80 hover:border-[#d0b284]'
                      }`}
                    >
                      <div className="mb-2 text-2xl">{dept.icon}</div>
                      <div className="text-sm font-semibold text-[#016564]">{dept.title}</div>
                    </button>
                  );
                })}
              </section>

              <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
                <div className="rounded-3xl border border-[#e1e5e5] bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-[#016564]">النموذج الأسبوعي</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">الموضوع</label>
                      <input
                        value={autoSubject}
                        readOnly
                        className="w-full rounded-xl border border-[#d6d7d4] bg-[#f8f9f9] px-3 py-2 text-[#016564]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">النسخة CC</label>
                      <input
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                        placeholder="اكتب البريد أو عدة عناوين"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">تاريخ بداية التنفيذ</label>
                        <input
                          type="date"
                          dir="rtl"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm text-gray-600">بيانات التاريخ التلقائية</label>
                        <input
                          readOnly
                          value={[formattedStartDate, weekLabel].filter(Boolean).join(' - ')}
                          className="w-full rounded-xl border border-[#d6d7d4] bg-[#f8f9f9] px-3 py-2 text-[#016564]"
                        />
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
                          <button
                            key={mode.key}
                            type="button"
                            onClick={() => setInputMode(mode.key as InputMode)}
                            className={`rounded-xl border px-3 py-2 text-sm ${
                              inputMode === mode.key
                                ? 'border-[#016564] bg-[#016564] text-white'
                                : 'border-[#d6d7d4] bg-white text-[#016564]'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {inputMode === 'excel' && (
                      <div className="rounded-2xl border border-[#e6e9e9] p-4">
                        <label className="mb-1 block text-sm text-gray-600">ملف Excel الرئيسي</label>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleExcelUpload(file);
                          }}
                          className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={downloadExcelTemplate}
                            className="rounded-xl border border-[#d0b284] bg-white px-3 py-2 text-sm text-[#016564]"
                          >
                            تنزيل نموذج Excel
                          </button>
                          {fileName ? <div className="text-sm text-[#016564]">تم رفع: {fileName}</div> : null}
                        </div>
                        <div className="mt-2 text-xs text-[#8c6968]">
                          الأعمدة المطلوبة ذكيًا: {excelTemplateHeaders.join(' | ')}
                        </div>
                      </div>
                    )}

                    {inputMode === 'paste' && (
                      <div className="rounded-2xl border border-[#e6e9e9] p-4">
                        <label className="mb-1 block text-sm text-gray-600">الصق البيانات</label>
                        <textarea
                          value={pastedText}
                          onChange={(e) => setPastedText(e.target.value)}
                          rows={7}
                          placeholder={`عنوان الدورة\tنوع الفترة\tعدد المشاركين\tتاريخ البداية\tتاريخ النهاية\tالموقع\nأو الصق جدولًا أكبر وسيأخذ النظام الأعمدة المهمة فقط`}
                          className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                        />
                        <button
                          type="button"
                          onClick={handlePasteConvert}
                          className="mt-2 rounded-xl bg-[#016564] px-4 py-2 text-sm font-semibold text-white"
                        >
                          تحويل إلى جدول
                        </button>
                      </div>
                    )}

                    {inputMode === 'manual' && (
                      <div className="rounded-2xl border border-[#e6e9e9] p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm text-gray-600">عنوان الدورة</label>
                            <input
                              value={courseForm.title}
                              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                              className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm text-gray-600">نوع الفترة</label>
                            <select
                              value={courseForm.period}
                              onChange={(e) => setCourseForm({ ...courseForm, period: e.target.value })}
                              className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                            >
                              <option>صباحية</option>
                              <option>مسائية</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm text-gray-600">عدد المشاركين</label>
                            <input
                              value={courseForm.participants}
                              onChange={(e) => setCourseForm({ ...courseForm, participants: e.target.value })}
                              className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm text-gray-600">تاريخ البداية</label>
                            <input
                              type="date"
                              value={courseForm.startDate}
                              onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })}
                              className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm text-gray-600">تاريخ النهاية</label>
                            <input
                              type="date"
                              value={courseForm.endDate}
                              onChange={(e) => setCourseForm({ ...courseForm, endDate: e.target.value })}
                              className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm text-gray-600">مدة البرنامج</label>
                            <input
                              value={buildDurationText(courseForm.startDate, courseForm.endDate)}
                              readOnly
                              className="w-full rounded-xl border border-[#d6d7d4] bg-[#f8f9f9] px-3 py-2 text-[#016564]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm text-gray-600">الموقع</label>
                            <select
                              value={courseForm.location}
                              onChange={(e) => setCourseForm({ ...courseForm, location: e.target.value })}
                              className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                            >
                              {locations.map((location) => (
                                <option key={location} value={location}>
                                  {location}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={saveManualCourse}
                            className="rounded-xl bg-[#016564] px-4 py-2 text-sm font-semibold text-white"
                          >
                            {editingIndex === null ? 'إضافة دورة' : 'حفظ التعديل'}
                          </button>
                          {editingIndex !== null ? (
                            <button
                              type="button"
                              onClick={resetCourseForm}
                              className="rounded-xl border border-[#d6d7d4] bg-white px-4 py-2 text-sm font-semibold text-[#016564]"
                            >
                              إلغاء
                            </button>
                          ) : null}
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
                                <th className="border border-[#d6d7d4] px-3 py-2">التاريخ</th>
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
                                  <td className="border border-[#d6d7d4] px-3 py-2">{formatCourseDateRange(course.startDate, course.endDate)}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2">{course.location}</td>
                                  <td className="border border-[#d6d7d4] px-3 py-2">
                                    <div className="flex gap-2">
                                      <button type="button" onClick={() => editCourse(index)} className="rounded-lg border border-[#d0b284] px-3 py-1 text-xs font-semibold text-[#016564]">
                                        تعديل
                                      </button>
                                      <button type="button" onClick={() => deleteCourse(index)} className="rounded-lg border border-[#e6d2d2] px-3 py-1 text-xs font-semibold text-[#7c1e3e]">
                                        حذف
                                      </button>
                                    </div>
                                  </td>
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
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-sm text-gray-600">نوع الفترة</label>
                              <select
                                value={hospitalityBreakPeriod}
                                onChange={(e) => setHospitalityBreakPeriod(e.target.value as BreakPeriod)}
                                className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2"
                              >
                                <option value="صباحية">صباحية</option>
                                <option value="مسائية">مسائية</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm text-gray-600">بداية الاستراحة الأولى</label>
                              <input type="time" value={break1Start} onChange={(e) => setBreak1Start(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm text-gray-600">نهاية الاستراحة الأولى</label>
                              <input type="time" value={break1End} onChange={(e) => setBreak1End(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm text-gray-600">بداية الاستراحة الثانية</label>
                              <input type="time" value={break2Start} onChange={(e) => setBreak2Start(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm text-gray-600">نهاية الاستراحة الثانية</label>
                              <input type="time" value={break2End} onChange={(e) => setBreak2End(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2" />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#e6e9e9] p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm font-semibold text-[#016564]">الطلبات المطلوب تأمينها خلال فترات الاستراحة</div>
                            <button
                              type="button"
                              onClick={addHospitalityRequest}
                              className="rounded-xl border border-[#d0b284] px-3 py-2 text-xs font-semibold text-[#016564]"
                            >
                              إضافة مكان آخر
                            </button>
                          </div>

                          <div className="space-y-4">
                            {hospitalityRequests.map((request, index) => {
                              const allSelected = hospitalityItems.every((item) => request.items.includes(item));
                              return (
                                <div key={request.id} className="rounded-2xl border border-[#edf0f0] p-4">
                                  <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-[#016564]">الموقع {index + 1}</div>
                                    {hospitalityRequests.length > 1 ? (
                                      <button
                                        type="button"
                                        onClick={() => removeHospitalityRequest(request.id)}
                                        className="rounded-lg border border-[#e6d2d2] px-3 py-1 text-xs font-semibold text-[#7c1e3e]"
                                      >
                                        حذف الموقع
                                      </button>
                                    ) : null}
                                  </div>

                                  <div className="mb-3">
                                    <label className="mb-1 block text-sm text-gray-600">المكان</label>
                                    <select
                                      value={request.place}
                                      onChange={(e) => updateHospitalityRequest(request.id, { place: e.target.value })}
                                      className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2"
                                    >
                                      {hospitalityPlaces.map((place) => (
                                        <option key={place} value={place}>
                                          {place}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#016564]">
                                    <input type="checkbox" checked={allSelected} onChange={() => toggleAllHospitalityItems(request.id)} />
                                    تحديد جميع العناصر
                                  </label>

                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {hospitalityItems.map((item) => {
                                      const checked = request.items.includes(item);
                                      return (
                                        <div key={`${request.id}-${item}`} className="rounded-xl border border-[#edf0f0] px-3 py-2">
                                          <label className="flex items-center gap-2 text-sm">
                                            <input
                                              type="checkbox"
                                              checked={checked}
                                              onChange={() => toggleHospitalityItem(request.id, item)}
                                            />
                                            {item}
                                          </label>

                                          {item === 'ضيافة VIP' && checked ? (
                                            <input
                                              value={request.vipCount}
                                              onChange={(e) => updateHospitalityRequest(request.id, { vipCount: e.target.value })}
                                              placeholder="لعدد ..."
                                              className="mt-2 w-full rounded-lg border border-[#d6d7d4] px-3 py-2 text-sm"
                                            />
                                          ) : null}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">ملاحظات تشغيلية إضافية</label>
                          <textarea
                            value={hospitalityExtra}
                            onChange={(e) => setHospitalityExtra(e.target.value)}
                            rows={4}
                            className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2"
                          />
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
                          <div className="mb-2 text-sm font-semibold text-[#016564]">طلبات الأمن</div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {securityOptions.map((item) => (
                              <label key={item} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={securitySelections.includes(item)}
                                  onChange={() => toggleMultiValue(item, securitySelections, setSecuritySelections)}
                                />
                                {item}
                              </label>
                            ))}
                          </div>
                        </div>

                        {securitySelections.includes('أخرى') && (
                          <div>
                            <label className="mb-1 block text-sm text-gray-600">طلب أمني إضافي</label>
                            <textarea
                              value={securityOther}
                              onChange={(e) => setSecurityOther(e.target.value)}
                              rows={3}
                              className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {selectedDepartment === 'medical' && (
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">ملاحظات طبية إضافية</label>
                        <textarea
                          value={medicalExtra}
                          onChange={(e) => setMedicalExtra(e.target.value)}
                          rows={4}
                          className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2"
                        />
                      </div>
                    )}

                    {selectedDepartment === 'support' && (
                      <>
                        <div className="rounded-2xl border border-[#e6e9e9] p-4">
                          <div className="mb-2 text-sm font-semibold text-[#016564]">طلبات الخدمات المساندة</div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {supportOptions.map((item) => (
                              <label key={item} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={supportSelections.includes(item)}
                                  onChange={() => toggleMultiValue(item, supportSelections, setSupportSelections)}
                                />
                                {item}
                              </label>
                            ))}
                          </div>
                        </div>

                        {supportSelections.includes('أخرى') && (
                          <div>
                            <label className="mb-1 block text-sm text-gray-600">طلب إضافي</label>
                            <textarea
                              value={supportOther}
                              onChange={(e) => setSupportOther(e.target.value)}
                              rows={3}
                              className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="grid gap-2 sm:grid-cols-3">
                      <button onClick={generateEmail} type="button" className="rounded-xl bg-[#016564] px-4 py-3 text-sm font-semibold text-white">
                        تحديث المعاينة
                      </button>
                      <button onClick={copyEmail} type="button" className="rounded-xl border border-[#d0b284] bg-white px-4 py-3 text-sm font-semibold text-[#016564]">
                        نسخ الرسالة
                      </button>
                      <button onClick={openDraft} type="button" className="rounded-xl border border-[#d6d7d4] bg-[#f8f9f9] px-4 py-3 text-sm font-semibold text-[#016564]">
                        فتح مسودة بريد
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#e1e5e5] bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#016564]">المعاينة</h2>
                    {selectedDeptData ? <div className="text-xs text-[#8c6968]">إلى: {selectedDeptData.emailTo}</div> : null}
                  </div>

                  <div
                    className="min-h-[600px] rounded-2xl border border-[#eef1f1] bg-[#fcfdfd] p-4"
                    dangerouslySetInnerHTML={{
                      __html: livePreviewHtml,
                    }}
                  />
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
