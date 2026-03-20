import type { Course, EmailTemplateConfig } from '@/core/types';
import { generateCoursesTable, generateEmailHeader, generateEmailSignature, wrapInParagraph, generateAttachmentNote } from '@/engine/email';

export function generateMedicalEmail(courses: Course[], _config: EmailTemplateConfig, attachments: string[], additionalNotes: string) {
  let html = generateEmailHeader('العيادة الطبية', 'تنفيذ دورات تدريبية');
  html += wrapInParagraph('نفيدكم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد من الدورات التدريبية داخل مقر الجامعة، وذلك للتنبيه والاستعداد لأي حالة صحية طارئة – لا قدّر الله – خلال فترة التنفيذ.');
  html += generateCoursesTable(courses);
  html += wrapInParagraph('نأمل منكم التكرم بالتوجيه بما يلزم من ترتيبات طبية وقائية وتحديد ما ترونه مناسبًا من جاهزية وفق ما تقتضيه الحاجة.');
  if (additionalNotes) html += wrapInParagraph(`<strong>ملاحظات:</strong> ${additionalNotes}`);
  html += generateAttachmentNote(attachments);
  html += generateEmailSignature();
  return html;
}
