'use client';

import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type HomeModuleKey = 'weekly' | 'operational' | 'leadership' | 'general';
type DepartmentKey = 'hospitality' | 'security' | 'medical' | 'support';
type WeeklyView = 'home' | 'form';

type CourseRecord = {
  title: string;
  period: string;
  participants: string;
  startDate: string;
  endDate: string;
  location: string;
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
  'النادي الرياضي',
];

const hospitalityItems = [
  'وجبات إفطار فاخرة',
  'القهوة السعودية',
  'القهوة الأمريكية',
  'العصائر',
  'المشروبات الساخنة',
  'المياه المعدنية',
  'شاي متنوع',
  'حلويات خفيفة',
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
  'أخرى',
];

const excelTemplateHeaders = [
  'عنوان الدورة',
  'نوع الفترة',
  'عدد المشاركين',
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
  if (!start && !end) return '';
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
  return String(value).replace(/\s+/g, '').trim();
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

function parseRowsFromPastedText(text: string) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const rows: CourseRecord[] = [];

  for (const line of lines) {
    const parts = line.includes('\t')
      ? line.split('\t')
      : line.includes('|')
        ? line.split('|')
        : line.split(',');

    if (parts.length < 6) continue;

    rows.push({
      title: String(parts[0] || '').trim(),
      period: String(parts[1] || '').trim(),
      participants: String(parts[2] || '').trim(),
      startDate: String(parts[3] || '').trim(),
      endDate: String(parts[4] || '').trim(),
      location: String(parts[5] || '').trim(),
    });
  }

  return rows;
}

function buildCoursesTable(courses: CourseRecord[]) {
  const totalParticipants = courses.reduce((sum, item) => sum + Number(item.participants || 0), 0);

  return `
    <table dir="rtl" style="width:100%; border-collapse:collapse; margin-top:12px; font-family:Cairo, Arial, sans-serif; font-size:14px;">
      <thead>
        <tr style="background:#016564; color:#ffffff;">
          <th style="border:1px solid #d6d7d4; padding:10px;">عنوان الدورة</th>
          <th style="border:1px solid #d6d7d4; padding:10px;">نوع الفترة</th>
          <th style="border:1px solid #d6d7d4; padding:10px;">عدد المشاركين</th>
          <th style="border:1px solid #d6d7d4; padding:10px;">مدة البرامج</th>
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
      <table dir="rtl" style="width:100%; border-collapse:collapse; font-family:Cairo, Arial, sans-serif; font-size:14px;">
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
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

export default function HomePage() {
  const [weeklyView, setWeeklyView] = useState<WeeklyView>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey | null>(null);

  const [cc, setCc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [fileName, setFileName] = useState('');
  const [inputMode, setInputMode] = useState<'excel' | 'manual' | 'paste'>('excel');
  const [pastedText, setPastedText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');

  const [courseForm, setCourseForm] = useState<CourseRecord>({
    title: '',
    period: 'صباحية',
    participants: '',
    startDate: '',
    endDate: '',
    location: locations[0],
  });

  const [morningBreak1, setMorningBreak1] = useState('من 09:45 ص إلى 10:15 ص');
  const [morningBreak2, setMorningBreak2] = useState('من 11:45 ص إلى 12:15 م');
  const [eveningBreak1, setEveningBreak1] = useState('من 17:00 م إلى 17:10 م');
  const [eveningBreak2, setEveningBreak2] = useState('من 18:10 م إلى 18:25 م');
  const [eveningBreak3, setEveningBreak3] = useState('من 19:15 م إلى 19:25 م');

  const [selectedHospitalityPlaces, setSelectedHospitalityPlaces] = useState<string[]>([]);
  const [selectedHospitalityItems, setSelectedHospitalityItems] = useState<string[]>([]);
  const [hospitalityExtra, setHospitalityExtra] = useState('');

  const [securitySelections, setSecuritySelections] = useState<string[]>([]);
  const [securityOther, setSecurityOther] = useState('');
  const [securityGate, setSecurityGate] = useState('4');
  const [attachmentsRequired, setAttachmentsRequired] = useState(true);

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

  function toggleMultiValue(value: string, current: string[], setCurrent: (items: string[]) => void) {
    if (current.includes(value)) {
      setCurrent(current.filter((item) => item !== value));
    } else {
      setCurrent([...current, value]);
    }
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
    if (!courseForm.title || !courseForm.participants || !courseForm.startDate || !courseForm.endDate || !courseForm.location) {
      alert('أكمل بيانات الدورة');
      return;
    }

    if (editingIndex === null) {
      setCourses((prev) => [...prev, courseForm]);
    } else {
      setCourses((prev) => prev.map((item, index) => (index === editingIndex ? courseForm : item)));
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
      const workbook = XLSX.read(buffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

      if (!rows.length) {
        alert('ملف Excel فارغ');
        return;
      }

      const normalizedRows: CourseRecord[] = rows.map((row) => {
        const titleKey = findHeader(row, ['عنوان الدورة', 'اسم الدورة', 'الدورة']);
        const periodKey = findHeader(row, ['نوع الفترة', 'الفترة']);
        const participantsKey = findHeader(row, ['عدد المشاركين', 'المشاركين']);
        const startKey = findHeader(row, ['تاريخ البداية', 'بداية الدورة', 'من']);
        const endKey = findHeader(row, ['تاريخ النهاية', 'نهاية الدورة', 'إلى']);
        const locationKey = findHeader(row, ['الموقع', 'مقر التنفيذ']);

        return {
          title: String(row[titleKey] ?? '').trim(),
          period: String(row[periodKey] ?? '').trim(),
          participants: String(row[participantsKey] ?? '').trim(),
          startDate: String(row[startKey] ?? '').trim(),
          endDate: String(row[endKey] ?? '').trim(),
          location: String(row[locationKey] ?? '').trim(),
        };
      });

      const validRows = normalizedRows.filter(
        (item) => item.title && item.period && item.participants && item.startDate && item.endDate && item.location
      );

      if (!validRows.length) {
        alert('لم يتم التعرف على الأعمدة المطلوبة في ملف Excel');
        return;
      }

      setCourses(validRows);
      setFileName(file.name);
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
    alert('تم تحويل النص إلى جدول دورات');
  }

  function downloadExcelTemplate() {
    const worksheet = XLSX.utils.aoa_to_sheet([
      excelTemplateHeaders,
      ['تحليل بيانات الجرائم للجهات الأمنية', 'صباحية', '14', '2025-11-30', '2026-01-01', 'مركز الأمن السيبراني'],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses Template');
    XLSX.writeFile(workbook, 'weekly-courses-template.xlsx');
  }

  function buildHospitalityTableRows() {
    const items = selectedHospitalityItems.length ? selectedHospitalityItems.join('\n') : 'لا يوجد';
    const rows = selectedHospitalityPlaces.map((place) => [place, items] as [string, string]);

    if (hospitalityExtra.trim()) {
      rows.push(['خدمات إضافية', hospitalityExtra]);
    }

    return rows;
  }

  function buildSecurityText() {
    const chosen = securitySelections
      .filter((item) => item !== 'أخرى')
      .map((item) => item.replace('البوابة المحددة', `البوابة رقم (${securityGate})`));

    if (securitySelections.includes('أخرى') && securityOther.trim()) {
      chosen.push(securityOther.trim());
    }

    return chosen.join('\n');
  }

  function buildSupportText() {
    const chosen = supportSelections.filter((item) => item !== 'أخرى');

    if (supportSelections.includes('أخرى') && supportOther.trim()) {
      chosen.push(supportOther.trim());
    }

    return chosen.join('\n');
  }

  function generateEmail() {
    if (!selectedDepartment) {
      alert('اختر الإدارة');
      return;
    }

    if (!courses.length) {
      alert('أدخل الدورات أولًا');
      return;
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
        ${buildSimpleTable('أوقات الراحة للدورات الصباحية', ['الفترة', 'التوقيت'], [
          ['الراحة الأولى', morningBreak1],
          ['الراحة الثانية', morningBreak2],
        ])}
        ${buildSimpleTable('أوقات الراحة للدورات المسائية', ['الفترة', 'التوقيت'], [
          ['الراحة الأولى', eveningBreak1],
          ['الراحة الثانية', eveningBreak2],
          ['الراحة الثالثة', eveningBreak3],
        ])}
        ${buildSimpleTable('الطلبات المطلوب تأمينها', ['الفئة / الموقع', 'العناصر المطلوبة'], buildHospitalityTableRows())}
      `;
    }

    if (selectedDepartment === 'security') {
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير إدارة الأمن والسلامة سلّمه الله</p>`;

      intro = `
        <p style="margin:0 0 12px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 12px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، وتفيدكم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد (${courses.length}) من الدورات التدريبية داخل مقر الجامعة ${formattedStartDate ? `وتبدأ من ${escapeHtml(formattedStartDate)}` : ''}.
        </p>
      `;

      extra = `
        ${attachmentsRequired ? `<p style="margin:16px 0 12px 0;">وتجدون في المرفقات جميع المعلومات التفصيلية ذات العلاقة.</p>` : ''}
        <div style="white-space:pre-line; border:1px solid #d6d7d4; padding:12px; background:#fff;">${escapeHtml(buildSecurityText())}</div>
      `;
    }

    if (selectedDepartment === 'medical') {
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير العيادة الطبية بالجامعة سلّمه الله</p>`;

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
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير إدارة الخدمات المساندة سلّمه الله</p>`;

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

    const html = `
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

    setPreviewHtml(html);
    alert('تم توليد الرسالة');
  }

  async function copyEmail() {
    if (!previewHtml) return;

    try {
      if (navigator.clipboard && 'write' in navigator && (window as any).ClipboardItem) {
        const item = new (window as any).ClipboardItem({
          'text/html': new Blob([previewHtml], { type: 'text/html' }),
          'text/plain': new Blob([toPlainText(previewHtml)], { type: 'text/plain' }),
        });
        await (navigator.clipboard as any).write([item]);
      } else {
        await navigator.clipboard.writeText(toPlainText(previewHtml));
      }
      alert('تم نسخ الرسالة');
    } catch {
      alert('تعذر نسخ الرسالة');
    }
  }

  function openDraft() {
    if (!selectedDeptData || !previewHtml) return;
    const url = `mailto:${encodeURIComponent(selectedDeptData.emailTo)}?subject=${encodeURIComponent(autoSubject)}&cc=${encodeURIComponent(cc)}&body=${encodeURIComponent(toPlainText(previewHtml))}`;
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
                                نموذج أسبوعي موحد لتبليغ الإدارات المعنية
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
                            onClick={() => setInputMode(mode.key as 'excel' | 'manual' | 'paste')}
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
                        <div className="mt-2 flex gap-2">
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
                          الأعمدة المقترحة: {excelTemplateHeaders.join(' | ')}
                        </div>
                      </div>
                    )}

                    {inputMode === 'paste' && (
                      <div className="rounded-2xl border border-[#e6e9e9] p-4">
                        <label className="mb-1 block text-sm text-gray-600">الصق البيانات</label>
                        <textarea
                          value={pastedText}
                          onChange={(e) => setPastedText(e.target.value)}
                          rows={6}
                          placeholder={`عنوان الدورة\tنوع الفترة\tعدد المشاركين\tتاريخ البداية\tتاريخ النهاية\tالموقع`}
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

                          <div className="sm:col-span-2">
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
                                      <button type="button" onClick={() => editCourse(index)} className="text-[#016564]">
                                        تعديل
                                      </button>
                                      <button type="button" onClick={() => deleteCourse(index)} className="text-[#7c1e3e]">
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
                          <div className="mb-2 text-sm font-semibold text-[#016564]">أوقات الراحة</div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input value={morningBreak1} onChange={(e) => setMorningBreak1(e.target.value)} className="rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="الراحة الصباحية الأولى" />
                            <input value={morningBreak2} onChange={(e) => setMorningBreak2(e.target.value)} className="rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="الراحة الصباحية الثانية" />
                            <input value={eveningBreak1} onChange={(e) => setEveningBreak1(e.target.value)} className="rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="الراحة المسائية الأولى" />
                            <input value={eveningBreak2} onChange={(e) => setEveningBreak2(e.target.value)} className="rounded-xl border border-[#d6d7d4] px-3 py-2" placeholder="الراحة المسائية الثانية" />
                            <input value={eveningBreak3} onChange={(e) => setEveningBreak3(e.target.value)} className="rounded-xl border border-[#d6d7d4] px-3 py-2 sm:col-span-2" placeholder="الراحة المسائية الثالثة" />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#e6e9e9] p-4">
                          <div className="mb-2 text-sm font-semibold text-[#016564]">أماكن الضيافة</div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {hospitalityPlaces.map((item) => (
                              <label key={item} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selectedHospitalityPlaces.includes(item)}
                                  onChange={() => toggleMultiValue(item, selectedHospitalityPlaces, setSelectedHospitalityPlaces)}
                                />
                                {item}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#e6e9e9] p-4">
                          <div className="mb-2 text-sm font-semibold text-[#016564]">العناصر المطلوبة</div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {hospitalityItems.map((item) => (
                              <label key={item} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selectedHospitalityItems.includes(item)}
                                  onChange={() => toggleMultiValue(item, selectedHospitalityItems, setSelectedHospitalityItems)}
                                />
                                {item}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">خدمات إضافية</label>
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

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={attachmentsRequired}
                            onChange={(e) => setAttachmentsRequired(e.target.checked)}
                          />
                          توجد مرفقات
                        </label>
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
                        توليد الرسالة
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
                      __html:
                        previewHtml ||
                        '<div style="color:#8c6968; font-family:Cairo, Arial, sans-serif;">اختر الإدارة، حدّد تاريخ البداية، أضف الدورات، ثم اضغط توليد الرسالة.</div>',
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