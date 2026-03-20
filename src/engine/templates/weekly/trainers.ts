import type { Course, EmailTemplateConfig } from '@/core/types';
import { generateAttachmentNote, generateEmailHeader, generateEmailSignature, wrapInParagraph } from '@/engine/email';

export function generateTrainersEmail(courses: Course[], _config: EmailTemplateConfig, attachments: string[], additionalNotes: string) {
  let html = generateEmailHeader('المدربين', 'برامج تدريبية مسندة للمدربين');
  html += wrapInParagraph('نفيدكم بالبرامج التدريبية المسندة وما يتصل بها من معلومات تشغيلية على النحو التالي:');
  courses.forEach((course) => {
    html += `
      <div style="margin-bottom:16px;padding:14px;border:1px solid #e5e7eb;border-radius:12px;">
        <p><strong>البرنامج:</strong> ${course.title}</p>
        <p><strong>المدرب:</strong> ${course.trainerName || '—'}</p>
        <p><strong>عدد المتدربين:</strong> ${course.participantCount}</p>
        <p><strong>القطاع / الجهة:</strong> ${course.sector || '—'}</p>
        <p><strong>الفترة:</strong> ${course.startDate} - ${course.endDate}</p>
      </div>
    `;
  });
  if (additionalNotes) html += wrapInParagraph(`<strong>ملاحظات تشغيلية:</strong> ${additionalNotes}`);
  html += generateAttachmentNote(attachments);
  html += generateEmailSignature();
  return html;
}
