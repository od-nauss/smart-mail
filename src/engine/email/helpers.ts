import type { Course } from '@/core/types';
import { APP_CONFIG } from '@/core/config';
import { formatDateRange, formatNumber } from '@/core/utils';

export function generateEmailHeader(recipient: string, subject: string) {
  return `
    <p style="margin-bottom:16px;">السلام عليكم ورحمة الله وبركاته، وبعد:</p>
    <p style="margin-bottom:8px;">سعادة مدير ${recipient} سلّمه الله</p>
    <p style="margin-bottom:16px;"><strong>الموضوع:</strong> ${subject}</p>
  `;
}

export function generateEmailSignature() {
  return `
    <p style="margin-top:24px;">وتفضلوا بقبول وافر التحية والتقدير،،،</p>
    <p style="margin-top:16px; font-weight:700;">فريق عمل ${APP_CONFIG.organization.department}</p>
    <p>${APP_CONFIG.organization.training}</p>
  `;
}

export function generateCoursesTable(courses: Course[]) {
  if (!courses.length) return '<p>لا توجد دورات محددة.</p>';
  const rows = courses.map((course, index) => `
    <tr>
      <td style="padding:10px;border:1px solid #d1d5db;text-align:center;">${index + 1}</td>
      <td style="padding:10px;border:1px solid #d1d5db;">${course.title}</td>
      <td style="padding:10px;border:1px solid #d1d5db;">${course.scheduleType}</td>
      <td style="padding:10px;border:1px solid #d1d5db;text-align:center;">${formatNumber(course.participantCount)}</td>
      <td style="padding:10px;border:1px solid #d1d5db;">${course.duration}</td>
      <td style="padding:10px;border:1px solid #d1d5db;">${formatDateRange(course.startDate, course.endDate)}</td>
      <td style="padding:10px;border:1px solid #d1d5db;">${course.location}</td>
    </tr>
  `).join('');

  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-family:Cairo,sans-serif;">
      <thead>
        <tr style="background:#016564;color:#fff;">
          <th style="padding:10px;border:1px solid #d1d5db;">م</th>
          <th style="padding:10px;border:1px solid #d1d5db;">عنوان الدورة</th>
          <th style="padding:10px;border:1px solid #d1d5db;">نوع الفترة</th>
          <th style="padding:10px;border:1px solid #d1d5db;">عدد المشاركين</th>
          <th style="padding:10px;border:1px solid #d1d5db;">مدة البرنامج</th>
          <th style="padding:10px;border:1px solid #d1d5db;">التاريخ</th>
          <th style="padding:10px;border:1px solid #d1d5db;">الموقع</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

export function generateBreakScheduleTable() {
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-family:Cairo,sans-serif;">
      <thead>
        <tr style="background:#016564;color:#fff;">
          <th style="padding:10px;border:1px solid #d1d5db;">الفترة</th>
          <th style="padding:10px;border:1px solid #d1d5db;">التوقيت</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="padding:10px;border:1px solid #d1d5db;">الراحة الأولى صباحي</td><td style="padding:10px;border:1px solid #d1d5db;">09:45 ص - 10:15 ص</td></tr>
        <tr><td style="padding:10px;border:1px solid #d1d5db;">الراحة الثانية صباحي</td><td style="padding:10px;border:1px solid #d1d5db;">11:45 ص - 12:15 م</td></tr>
        <tr><td style="padding:10px;border:1px solid #d1d5db;">الراحة الأولى مسائي</td><td style="padding:10px;border:1px solid #d1d5db;">17:00 م - 17:10 م</td></tr>
        <tr><td style="padding:10px;border:1px solid #d1d5db;">الراحة الثانية مسائي</td><td style="padding:10px;border:1px solid #d1d5db;">18:10 م - 18:25 م</td></tr>
        <tr><td style="padding:10px;border:1px solid #d1d5db;">الراحة الثالثة مسائي</td><td style="padding:10px;border:1px solid #d1d5db;">19:15 م - 19:25 م</td></tr>
      </tbody>
    </table>
  `;
}

export function generateAttachmentNote(attachments: string[]) {
  if (!attachments.length) return '';
  const items = attachments.map((item) => `<li>${item}</li>`).join('');
  return `<p><strong>المرفقات:</strong></p><ul style="margin-right:20px;">${items}</ul>`;
}

export function generateBulletList(items: string[]) {
  const list = items.map((item) => `<li style="margin-bottom:4px;">${item}</li>`).join('');
  return `<ul style="margin-right:20px;">${list}</ul>`;
}

export function wrapInParagraph(text: string) {
  return `<p style="margin-bottom:16px;">${text}</p>`;
}
