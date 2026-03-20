import type { Course, EmailTemplateConfig } from '@/core/types';
import { generateAttachmentNote, generateBreakScheduleTable, generateBulletList, generateCoursesTable, generateEmailHeader, generateEmailSignature, wrapInParagraph } from '@/engine/email';

export function generateHospitalityEmail(courses: Course[], config: EmailTemplateConfig, attachments: string[], additionalNotes: string) {
  const requirements = [
    'وجبات إفطار فاخرة',
    'القهوة السعودية',
    'القهوة الأمريكية',
    'العصائر',
    'المشروبات الساخنة',
    'المياه المعدنية',
    'توفير جزء من الضيافة يتناسب مع الحالات المزمنة',
    'تأمين مياه الشرب للمشاركين في القاعات'
  ];
  if (config.includeVipHospitality) requirements.push(`ضيافة VIP لعدد ${config.vipCount || 15} شخص`);
  let html = generateEmailHeader('إدارة الضيافة والإسكان', 'تنفيذ دورات تدريبية');
  html += wrapInParagraph('تهديكم إدارة عمليات التدريب أطيب التحايا، ونود إشعاركم بأنه سيتم تنفيذ عدد من الدورات التدريبية خلال الأسبوع القادم حسب البيانات التالية:');
  html += generateCoursesTable(courses);
  html += '<p><strong>أوقات الاستراحات:</strong></p>' + generateBreakScheduleTable();
  html += '<p><strong>الطلبات المطلوب تأمينها خلال فترات الاستراحة:</strong></p>' + generateBulletList(requirements);
  if (config.includeFinalConfirmationNote) html += wrapInParagraph('نظرًا لعدم اعتماد بعض البرامج نهائيًا، يرجى الانتظار لحين التأكيد النهائي عند الحاجة.');
  if (additionalNotes) html += wrapInParagraph(`<strong>ملاحظات إضافية:</strong> ${additionalNotes}`);
  html += generateAttachmentNote(attachments);
  html += generateEmailSignature();
  return html;
}
