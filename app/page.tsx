'use client';

import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type DepartmentKey = 'hospitality' | 'security' | 'medical' | 'support';

type CourseRow = {
  'عنوان الدورة': string;
  'نوع الفترة': string;
  'عدد المشاركين': string;
  'مدة البرنامج': string;
  'التاريخ': string;
  'الموقع': string;
};

const departments = [
  {
    key: 'hospitality' as DepartmentKey,
    title: 'المراسم والضيافة',
    emailTo: 'PRM@nauss.edu.sa; Hospitality@nauss.edu.sa',
    icon: '🍽️',
  },
  {
    key: 'security' as DepartmentKey,
    title: 'الأمن والسلامة',
    emailTo: 'SSN@nauss.edu.sa',
    icon: '🛡️',
  },
  {
    key: 'medical' as DepartmentKey,
    title: 'العيادة الطبية',
    emailTo: 'Medical@nauss.edu.sa',
    icon: '🩺',
  },
  {
    key: 'support' as DepartmentKey,
    title: 'الخدمات المساندة',
    emailTo: 'ssd@nauss.edu.sa',
    icon: '🧹',
  },
];

const expectedColumns = [
  'عنوان الدورة',
  'نوع الفترة',
  'عدد المشاركين',
  'مدة البرنامج',
  'التاريخ',
  'الموقع',
] as const;

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

function sumParticipants(rows: CourseRow[]) {
  return rows.reduce((sum, row) => {
    const n = Number(String(row['عدد المشاركين'] || '').replace(/[^\d]/g, ''));
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

function buildMainCoursesTable(rows: CourseRow[]) {
  const totalCourses = rows.length;
  const totalParticipants = sumParticipants(rows);

  const bodyRows = rows
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row['عنوان الدورة'] || '')}</td>
        <td>${escapeHtml(row['نوع الفترة'] || '')}</td>
        <td>${escapeHtml(row['عدد المشاركين'] || '')}</td>
        <td>${escapeHtml(row['مدة البرنامج'] || '')}</td>
        <td>${escapeHtml(row['التاريخ'] || '')}</td>
        <td>${escapeHtml(row['الموقع'] || '')}</td>
      </tr>
    `
    )
    .join('');

  return `
    <table dir="rtl" style="width:100%; border-collapse:collapse; margin-top:12px; font-family:Cairo, Arial, sans-serif; font-size:14px;">
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
        ${bodyRows}
        <tr style="background:#f6f8f8; font-weight:600;">
          <td style="border:1px solid #d6d7d4; padding:10px;">المجموع</td>
          <td style="border:1px solid #d6d7d4; padding:10px;">${totalCourses}</td>
          <td style="border:1px solid #d6d7d4; padding:10px;">${totalParticipants}</td>
          <td style="border:1px solid #d6d7d4; padding:10px;"></td>
          <td style="border:1px solid #d6d7d4; padding:10px;"></td>
          <td style="border:1px solid #d6d7d4; padding:10px;"></td>
        </tr>
      </tbody>
    </table>
  `;
}

function buildBreaksTable(title: string, rows: Array<[string, string]>) {
  return `
    <div style="margin-top:18px;">
      <div style="font-weight:700; color:#016564; margin-bottom:8px;">${escapeHtml(title)}</div>
      <table dir="rtl" style="width:100%; border-collapse:collapse; font-family:Cairo, Arial, sans-serif; font-size:14px;">
        <thead>
          <tr style="background:#016564; color:#ffffff;">
            <th style="border:1px solid #d6d7d4; padding:10px;">الفترة</th>
            <th style="border:1px solid #d6d7d4; padding:10px;">التوقيت</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([period, time]) => `
            <tr>
              <td style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(period)}</td>
              <td style="border:1px solid #d6d7d4; padding:10px;">${escapeHtml(time)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function buildSimpleRequestsTable(title: string, rows: Array<[string, string]>) {
  return `
    <div style="margin-top:18px;">
      <div style="font-weight:700; color:#016564; margin-bottom:8px;">${escapeHtml(title)}</div>
      <table dir="rtl" style="width:100%; border-collapse:collapse; font-family:Cairo, Arial, sans-serif; font-size:14px;">
        <thead>
          <tr style="background:#016564; color:#ffffff;">
            <th style="border:1px solid #d6d7d4; padding:10px;">الفئة / الموقع</th>
            <th style="border:1px solid #d6d7d4; padding:10px;">العناصر المطلوبة</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([place, items]) => `
            <tr>
              <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${nl2br(place)}</td>
              <td style="border:1px solid #d6d7d4; padding:10px; vertical-align:top;">${nl2br(items)}</td>
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
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey | null>(null);
  const [cc, setCc] = useState('');
  const [weekStartText, setWeekStartText] = useState('');
  const [periodText, setPeriodText] = useState('');
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  const [morningBreak1, setMorningBreak1] = useState('من 09:45 ص إلى 10:15 ص');
  const [morningBreak2, setMorningBreak2] = useState('من 11:45 ص إلى 12:15 م');
  const [eveningBreak1, setEveningBreak1] = useState('من 17:00 م إلى 17:10 م');
  const [eveningBreak2, setEveningBreak2] = useState('من 18:10 م إلى 18:25 م');
  const [eveningBreak3, setEveningBreak3] = useState('من 19:15 م إلى 19:25 م');

  const [hospitalityRequests, setHospitalityRequests] = useState(
    `صالة الاستقبال (مبنى التدريب)||وجبات إفطار فاخرة
القهوة السعودية
القهوة الأمريكية
العصائر
المشروبات الساخنة
المياه المعدنية

ماكينات القهوة||إعادة تعبئة عدد (2) ماكينة تابعة لإدارة الضيافة، موجودة في:
- الدور الأرضي
- الدور الرابع

ضيافة صحية||توفير جزء من الضيافة يتناسب مع الحالات المزمنة (مثل مرضى السكري والضغط)

داخل قاعات التدريب||تأمين مياه الشرب للمشاركين في جميع القاعات المخصصة`
  );

  const [vipNotes, setVipNotes] = useState(
    `ضيافة VIP لعدد 18 شخص في الطابق الرابع يوم الخميس + غداء في مطعم الجامعة لعدد 20 شخص`
  );

  const [securityGate, setSecurityGate] = useState('4');
  const [securityRequests, setSecurityRequests] = useState(
    `تسهيل دخول المشاركين عبر البوابة المحددة طيلة أيام انعقاد الدورات.
إبلاغ مشرفي الأمن بضرورة توجيه المشاركين إلى مقرات التدريب المحددة داخل مبنى التدريب.
المتابعة الدورية من قبل مشرفي الأمن في الممرات وقاعات التدريب للتأكد من السلامة العامة دون التأثير على سير البرنامج التدريبي.`
  );
  const [attachmentsNote, setAttachmentsNote] = useState(
    'وتجدون في المرفقات جميع المعلومات التفصيلية، بما في ذلك أسماء المشاركين ومشرف العمليات المسؤول عن كل دورة.'
  );

  const [medicalNote, setMedicalNote] = useState(
    'وذلك للتنبيه والاستعداد لأي حالة صحية طارئة – لا قدّر الله – خلال فترة التنفيذ.\nنأمل منكم التكرم بالتوجيه بما يلزم من ترتيبات طبية وقائية، وتحديد ما ترونه مناسبًا من جاهزية وفق ما تقتضيه الحاجة.'
  );

  const [supportRequests, setSupportRequests] = useState(
    `تنظيف شامل لجميع قاعات التدريب والممرات المحيطة.
تنظيف استراحات المتدربين خلال فترة تنفيذ البرامج.`
  );

  const selectedDeptData = useMemo(
    () => departments.find((d) => d.key === selectedDepartment) || null,
    [selectedDepartment]
  );

  async function handleExcelUpload(file: File) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

    const headers = Object.keys(rows[0] || {});
    const missing = expectedColumns.filter((col) => !headers.includes(col));

    if (missing.length) {
      alert(`أعمدة Excel غير مكتملة:\n${missing.join('\n')}`);
      return;
    }

    const normalized: CourseRow[] = rows.map((row) => ({
      'عنوان الدورة': String(row['عنوان الدورة'] ?? ''),
      'نوع الفترة': String(row['نوع الفترة'] ?? ''),
      'عدد المشاركين': String(row['عدد المشاركين'] ?? ''),
      'مدة البرنامج': String(row['مدة البرنامج'] ?? ''),
      'التاريخ': String(row['التاريخ'] ?? ''),
      'الموقع': String(row['الموقع'] ?? ''),
    }));

    setCourses(normalized);
    setFileName(file.name);
  }

  function parseHospitalityRows() {
    return hospitalityRequests
      .split('\n\n')
      .map((block) => block.split('||'))
      .filter((item) => item.length === 2) as Array<[string, string]>;
  }

  function generateEmail() {
    if (!selectedDepartment) {
      alert('اختر الإدارة أولًا');
      return;
    }

    if (!courses.length) {
      alert('ارفع ملف Excel أولًا');
      return;
    }

    const totalCourses = courses.length;
    const totalParticipants = sumParticipants(courses);
    const mainTable = buildMainCoursesTable(courses);

    let salutation = '';
    let intro = '';
    let extraSection = '';
    let closing = 'وتفضلوا بقبول وافر التحية والتقدير،،،';

    if (selectedDepartment === 'hospitality') {
      salutation = `
        <p style="margin:0 0 6px 0;">سعادة مدير إدارة المراسم بالجامعة سلّمه الله</p>
        <p style="margin:0 0 16px 0;">سعادة مدير إدارة الضيافة والإسكان سلّمه الله</p>
      `;

      intro = `
        <p style="margin:0 0 14px 0;">
          السلام عليكم ورحمة الله وبركاته، وبعد:
        </p>
        <p style="margin:0 0 14px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، ونود إشعاركم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد (${totalCourses}) دورات تدريبية في مقر الجامعة، وذلك ${periodText ? `خلال الفترة ${escapeHtml(periodText)}` : ''} ${weekStartText ? `ابتداءً من ${escapeHtml(weekStartText)}` : ''}، حسب البيانات التالية:
        </p>
      `;

      extraSection = `
        ${buildBreaksTable('أوقات الراحة للدورات الصباحية', [
          ['الراحة الأولى', morningBreak1],
          ['الراحة الثانية', morningBreak2],
        ])}
        ${buildBreaksTable('أوقات الراحة للدورات المسائية', [
          ['الراحة الأولى', eveningBreak1],
          ['الراحة الثانية', eveningBreak2],
          ['الراحة الثالثة', eveningBreak3],
        ])}
        ${buildSimpleRequestsTable('الطلبات المطلوب تأمينها خلال فترات الاستراحة', parseHospitalityRows())}
        <div style="margin-top:18px;">
          <div style="font-weight:700; color:#016564; margin-bottom:8px;">ملاحظات إضافية</div>
          <div style="border:1px solid #d6d7d4; padding:12px; background:#fff;">${nl2br(vipNotes)}</div>
        </div>
      `;
    }

    if (selectedDepartment === 'security') {
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير إدارة الأمن والسلامة سلّمه الله</p>`;
      intro = `
        <p style="margin:0 0 14px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 14px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، ونفيدكم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد (${totalCourses}) من الدورات التدريبية داخل مقر الجامعة ${weekStartText ? `ابتداءً من ${escapeHtml(weekStartText)}` : ''}. وفيما يلي ملخص المعلومات الأساسية حول الدورات المجدولة:
        </p>
      `;
      extraSection = `
        <div style="margin-top:18px; border:1px solid #d6d7d4; background:#fff; padding:12px;">
          ${attachmentsNote ? `<p style="margin:0 0 12px 0;">${escapeHtml(attachmentsNote)}</p>` : ''}
          <p style="margin:0 0 12px 0;">نأمل من سعادتكم التكرم بالتوجيه إلى من يلزم بـ:</p>
          <div style="white-space:pre-line;">${escapeHtml(securityRequests.replaceAll('البوابة المحددة', `البوابة رقم (${securityGate})`))}</div>
        </div>
      `;
    }

    if (selectedDepartment === 'medical') {
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير العيادة الطبية بالجامعة سلّمه الله</p>`;
      intro = `
        <p style="margin:0 0 14px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 14px 0;">
          تهديكم إدارة عمليات التدريب بوكالة الجامعة للتدريب أطيب التحايا، ونفيدكم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد من الدورات التدريبية داخل مقر الجامعة ${weekStartText ? `ابتداءً من ${escapeHtml(weekStartText)}` : ''}، موزعة على النحو التالي:
        </p>
      `;
      extraSection = `
        <div style="margin-top:18px; border:1px solid #d6d7d4; background:#fff; padding:12px; white-space:pre-line;">
          ${escapeHtml(medicalNote)}
        </div>
      `;
    }

    if (selectedDepartment === 'support') {
      salutation = `<p style="margin:0 0 16px 0;">سعادة مدير إدارة الخدمات المساندة سلّمه الله</p>`;
      intro = `
        <p style="margin:0 0 14px 0;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p style="margin:0 0 14px 0;">
          تهديكم إدارة عمليات التدريب في وكالة الجامعة للتدريب أطيب التحايا، ونفيدكم بأنه سيتم تنفيذ عدد من الدورات التدريبية بمقر الجامعة خلال الفترة القادمة، وذلك حسب التفصيل التالي:
        </p>
      `;
      extraSection = `
        <div style="margin-top:18px; border:1px solid #d6d7d4; background:#fff; padding:12px;">
          <p style="margin:0 0 12px 0;">وعليه، نأمل من سعادتكم التكرم بالتوجيه نحو:</p>
          <div style="white-space:pre-line;">${escapeHtml(supportRequests)}</div>
        </div>
      `;
      closing = 'شاكرين لكم تعاونكم الدائم، وتفضلوا بقبول أطيب التحايا والتقدير،،،';
    }

    const html = `
      <div dir="rtl" style="font-family:Cairo, Arial, sans-serif; color:#1f2937; line-height:1.9; font-size:15px;">
        ${salutation}
        ${intro}
        ${mainTable}
        ${extraSection}
        <p style="margin:18px 0 0 0;">${closing}</p>
        <br />
        <p style="margin:0;">فريق عمل إدارة عمليات التدريب</p>
        <p style="margin:0;">وكالة الجامعة للتدريب</p>
      </div>
    `;

    setPreviewHtml(html);
  }

  async function copyEmail() {
    if (!previewHtml) return;

    try {
      if (navigator.clipboard && 'write' in navigator && typeof window.ClipboardItem !== 'undefined') {
        const item = new window.ClipboardItem({
          'text/html': new Blob([previewHtml], { type: 'text/html' }),
          'text/plain': new Blob([toPlainText(previewHtml)], { type: 'text/plain' }),
        });
        await navigator.clipboard.write([item]);
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

    const subject = 'تنفيذ دورات تدريبية';
    const body = toPlainText(previewHtml);
    const url = `mailto:${encodeURIComponent(selectedDeptData.emailTo)}?subject=${encodeURIComponent(subject)}&cc=${encodeURIComponent(cc)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f9]">
      <Header />

      <main className="flex-1 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  <label className="mb-1 block text-sm text-gray-600">النسخة CC</label>
                  <input
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                    placeholder="اكتب البريد أو عدة عناوين"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">تاريخ بداية التنفيذ</label>
                  <input
                    value={weekStartText}
                    onChange={(e) => setWeekStartText(e.target.value)}
                    className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                    placeholder="مثال: الأحد 30 / 11 / 2025م"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">الفترة</label>
                  <input
                    value={periodText}
                    onChange={(e) => setPeriodText(e.target.value)}
                    className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                    placeholder="مثال: خلال الفترة من الأحد 30 / 11 / 2025م"
                  />
                </div>

                <div>
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
                  <div className="mt-2 text-xs text-[#8c6968]">
                    الأعمدة المطلوبة: {expectedColumns.join(' | ')}
                  </div>
                  {fileName ? <div className="mt-1 text-xs text-[#016564]">تم رفع: {fileName}</div> : null}
                </div>

                {selectedDepartment === 'hospitality' && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">الراحة الصباحية الأولى</label>
                        <input value={morningBreak1} onChange={(e) => setMorningBreak1(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">الراحة الصباحية الثانية</label>
                        <input value={morningBreak2} onChange={(e) => setMorningBreak2(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">الراحة المسائية الأولى</label>
                        <input value={eveningBreak1} onChange={(e) => setEveningBreak1(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">الراحة المسائية الثانية</label>
                        <input value={eveningBreak2} onChange={(e) => setEveningBreak2(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">الراحة المسائية الثالثة</label>
                      <input value={eveningBreak3} onChange={(e) => setEveningBreak3(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">طلبات الضيافة</label>
                      <textarea
                        value={hospitalityRequests}
                        onChange={(e) => setHospitalityRequests(e.target.value)}
                        rows={10}
                        className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                      />
                      <div className="mt-1 text-xs text-[#8c6968]">اكتب كل صف بهذا الشكل: الفئة || العناصر المطلوبة، وافصل بين الصفوف بسطر فارغ.</div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">ملاحظات VIP / الغداء / السكن</label>
                      <textarea
                        value={vipNotes}
                        onChange={(e) => setVipNotes(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                      />
                    </div>
                  </>
                )}

                {selectedDepartment === 'security' && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">رقم البوابة</label>
                      <input value={securityGate} onChange={(e) => setSecurityGate(e.target.value)} className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">وصف المرفقات</label>
                      <textarea
                        value={attachmentsNote}
                        onChange={(e) => setAttachmentsNote(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">طلبات الأمن</label>
                      <textarea
                        value={securityRequests}
                        onChange={(e) => setSecurityRequests(e.target.value)}
                        rows={6}
                        className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                      />
                    </div>
                  </>
                )}

                {selectedDepartment === 'medical' && (
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">النص الطبي</label>
                    <textarea
                      value={medicalNote}
                      onChange={(e) => setMedicalNote(e.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                    />
                  </div>
                )}

                {selectedDepartment === 'support' && (
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">طلبات الخدمات المساندة</label>
                    <textarea
                      value={supportRequests}
                      onChange={(e) => setSupportRequests(e.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-[#d6d7d4] px-3 py-2 outline-none focus:border-[#016564]"
                    />
                  </div>
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
                {selectedDeptData ? (
                  <div className="text-xs text-[#8c6968]">إلى: {selectedDeptData.emailTo}</div>
                ) : null}
              </div>

              <div
                className="min-h-[500px] rounded-2xl border border-[#eef1f1] bg-[#fcfdfd] p-4"
                dangerouslySetInnerHTML={{
                  __html:
                    previewHtml ||
                    '<div style="color:#8c6968; font-family:Cairo, Arial, sans-serif;">اختر الإدارة وارفع ملف Excel ثم اضغط توليد الرسالة.</div>',
                }}
              />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}