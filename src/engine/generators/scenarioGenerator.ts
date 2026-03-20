import type { Scenario } from '@/core/types';
import { createSimpleKeyValueTable } from './table-builder';
import { generateAttachmentNote, generateEmailHeader, generateEmailSignature, wrapInParagraph } from '@/engine/email';

export function generateScenarioEmail(scenario: Scenario, values: Record<string, string | number | boolean>, attachments: string[]) {
  const subject = Object.entries(values).reduce((acc, [key, value]) => acc.replace(`{${key}}`, String(value)), scenario.subjectTemplate);
  let recipient = 'القسم المختص';
  if (scenario.category === 'approval') recipient = 'وكيل الجامعة للتدريب';
  if (scenario.id === 'vehicle-request') recipient = 'إدارة الأمن والسلامة';
  if (scenario.id === 'accommodation-request') recipient = 'إدارة الضيافة والإسكان';
  if (scenario.id === 'trainer-coordination') recipient = 'المدرب المعني';

  let html = generateEmailHeader(recipient, subject);

  if (scenario.id === 'trainer-coordination') {
    html += wrapInParagraph(`إشارة إلى البرنامج التدريبي ${values.programName || ''} خلال الفترة ${values.programDates || ''}.`);
    html += wrapInParagraph(String(values.coordinationTopic || ''));
  } else if (scenario.id === 'supervisor-modification') {
    html += wrapInParagraph('إشارة إلى الموافقة السابقة على التنفيذ، آمل التكرم بالموافقة على تعديل المرشح حسب التفاصيل الآتية:');
    html += createSimpleKeyValueTable([
      { label: 'النشاط التدريبي', value: String(values.programName || '') },
      { label: 'مكان التنفيذ', value: String(values.programLocation || '') },
      { label: 'الفترة', value: String(values.programDates || '') },
      { label: 'المرشح الحالي', value: String(values.currentSupervisor || '') },
      { label: 'المرشح البديل', value: String(values.newSupervisor || '') },
      { label: 'سبب التعديل', value: String(values.modificationReason || '') }
    ]);
  } else {
    html += wrapInParagraph('نأمل التكرم باتخاذ ما يلزم وفق التفاصيل التالية:');
    html += createSimpleKeyValueTable(
      Object.entries(values)
        .filter(([_, v]) => v !== false && v !== '')
        .map(([key, value]) => ({ label: key, value: String(value) }))
    );
  }

  html += generateAttachmentNote(attachments);
  html += generateEmailSignature();
  return html;
}
