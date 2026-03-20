import type { Course, EmailTemplateConfig } from '@/core/types';
import { generateCoursesTable, generateEmailHeader, generateEmailSignature, wrapInParagraph, generateAttachmentNote } from '@/engine/email';

export function generateProtocolEmail(courses: Course[], _config: EmailTemplateConfig, attachments: string[], additionalNotes: string) {
  let html = generateEmailHeader('إدارة المراسم', 'تنفيذ دورات تدريبية');
  html += wrapInParagraph('نفيدكم بأنه سيتم خلال الأسبوع القادم تنفيذ الدورات الموضحة أدناه، ونأمل التكرم بما يلزم من ترتيبات مراسم عند الحاجة.');
  html += generateCoursesTable(courses);
  if (additionalNotes) html += wrapInParagraph(`<strong>ملاحظات:</strong> ${additionalNotes}`);
  html += generateAttachmentNote(attachments);
  html += generateEmailSignature();
  return html;
}
