import { MessageTemplate } from '../types';
export const generalTemplates: MessageTemplate[] = [
  {
    id: 'general-reminder',
    type: 'reminder',
    group: 'general',
    title: 'تذكير',
    description: 'رسالة تذكير رسمية مختصرة',
    icon: 'bell',
    fields: [
      { id: 'subjectName', label: 'الموضوع', type: 'text', required: true },
      { id: 'details', label: 'نص التذكير', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `تذكير بشأن ${data.subjectName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نود التذكير بشأن ${data.subjectName}، وذلك وفق الآتي:
${data.details}

شاكرين لكم تعاونكم.`,
  },

  {
    id: 'general-followup',
    type: 'followup',
    group: 'general',
    title: 'متابعة',
    description: 'رسالة متابعة لموضوع سابق',
    icon: 'refresh',
    fields: [
      { id: 'subjectName', label: 'الموضوع', type: 'text', required: true },
      { id: 'followupText', label: 'نص المتابعة', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `متابعة - ${data.subjectName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

إلحاقًا بالموضوع المتعلق بـ ${data.subjectName}، نأمل إفادتنا بما تم حيال الآتي:
${data.followupText}

وتقبلوا خالص الشكر.`,
  },

  {
    id: 'general-thanks',
    type: 'thanks',
    group: 'general',
    title: 'شكر',
    description: 'رسالة شكر رسمية',
    icon: 'heart',
    fields: [
      { id: 'recipientName', label: 'الجهة أو الشخص', type: 'text', required: true },
      { id: 'reason', label: 'سبب الشكر', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `شكر وتقدير لـ ${data.recipientName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نتقدم لكم بخالص الشكر والتقدير لـ ${data.recipientName} نظير:
${data.reason}

مع أطيب التحيات.`,
  },

  {
    id: 'general-escalation',
    type: 'escalation',
    group: 'general',
    title: 'تصعيد',
    description: 'رسالة تصعيد لموضوع متأخر أو مؤثر',
    icon: 'alert',
    fields: [
      { id: 'subjectName', label: 'الموضوع', type: 'text', required: true },
      { id: 'issue', label: 'وصف الإشكال', type: 'textarea', required: true },
      { id: 'impact', label: 'الأثر', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `تصعيد بخصوص ${data.subjectName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نرفع لكم هذا التصعيد بخصوص ${data.subjectName} نظرًا إلى الإشكال التالي:
${data.issue}

الأثر المترتب:
${data.impact}

نأمل التوجيه بما يلزم بصورة عاجلة.`,
  },

  {
    id: 'general-open',
    type: 'open-message',
    group: 'general',
    title: 'رسالة مفتوحة',
    description: 'قالب عام لرسالة مرنة',
    icon: 'mail',
    fields: [
      { id: 'subjectName', label: 'الموضوع', type: 'text', required: true },
      { id: 'messageBody', label: 'نص الرسالة', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `${data.subjectName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

${data.messageBody}`,
  },

];
