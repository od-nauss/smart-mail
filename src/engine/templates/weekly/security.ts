import type { Course, EmailTemplateConfig } from '@/core/types';
import { generateAttachmentNote, generateBulletList, generateCoursesTable, generateEmailHeader, generateEmailSignature, wrapInParagraph } from '@/engine/email';

export function generateSecurityEmail(courses: Course[], config: EmailTemplateConfig, attachments: string[], additionalNotes: string) {
  const req = [
    'تسهيل دخول المشاركين عبر البوابة المخصصة طيلة أيام انعقاد الدورات',
    'توجيه المشاركين إلى مقرات التدريب داخل الجامعة',
    'المتابعة الدورية في الممرات والقاعات للتأكد من السلامة العامة'
  ];
  if (config.securityLevel === 'مُعزز' || config.securityLevel === 'خاص') {
    req.push('تكثيف الإجراءات الأمنية وفق مستوى التأمين المعتمد');
  }
  const merged = [...attachments];
  if (config.includeParticipantList && !merged.includes('قائمة أسماء المشاركين')) merged.push('قائمة أسماء المشاركين');
  let html = generateEmailHeader('إدارة الأمن والسلامة', 'دخول مشاركين');
  html += wrapInParagraph('نفيدكم بأنه سيتم خلال الأسبوع القادم تنفيذ عدد من الدورات التدريبية داخل مقر الجامعة، وفيما يلي ملخص المعلومات الأساسية:');
  html += generateCoursesTable(courses);
  html += wrapInParagraph('نأمل من سعادتكم التكرم بالتوجيه إلى من يلزم بما يضمن سلامة التنفيذ وانسيابية الدخول.');
  html += generateBulletList(req);
  if (additionalNotes) html += wrapInParagraph(`<strong>تعليمات خاصة:</strong> ${additionalNotes}`);
  html += generateAttachmentNote(merged);
  html += generateEmailSignature();
  return html;
}
