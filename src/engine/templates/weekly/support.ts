import type { Course, EmailTemplateConfig } from '@/core/types';
import { generateCoursesTable, generateEmailHeader, generateEmailSignature, wrapInParagraph, generateAttachmentNote } from '@/engine/email';

export function generateSupportEmail(courses: Course[], _config: EmailTemplateConfig, attachments: string[], additionalNotes: string) {
  const total = courses.reduce((sum, c) => sum + c.participantCount, 0);
  let html = generateEmailHeader('إدارة الخدمات المساندة', 'تبليغ إدارة الخدمات المساندة بالدورات التدريبية المنفذة');
  html += wrapInParagraph('تهديكم إدارة عمليات التدريب أطيب التحايا، ونفيدكم بأنه سيتم تنفيذ عدد من الدورات التدريبية بمقر الجامعة خلال الفترة القادمة، وذلك حسب التفصيل التالي:');
  html += generateCoursesTable(courses);
  html += wrapInParagraph(`إجمالي عدد المشاركين المتوقع: <strong>${total}</strong> مشارك.`);
  html += wrapInParagraph('وعليه، نأمل التكرم بالتوجيه نحو تنظيف القاعات والممرات المحيطة واستراحات المتدربين، واستكمال أعمال الصيانة والنظافة والتجهيز والتحضير اللازمة.');
  if (additionalNotes) html += wrapInParagraph(`<strong>ملاحظات:</strong> ${additionalNotes}`);
  html += generateAttachmentNote(attachments);
  html += generateEmailSignature();
  return html;
}
