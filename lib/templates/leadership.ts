import { MessageTemplate } from '../types';
export const leadershipTemplates: MessageTemplate[] = [
  {
    id: 'leadership-nomination',
    type: 'nomination-update',
    group: 'leadership',
    title: 'طلب تعديل ترشيح',
    description: 'طلب تعديل بيانات المرشحين أو اعتماد التعديل',
    icon: 'edit',
    fields: [
      { id: 'courseName', label: 'اسم الدورة', type: 'text', required: true },
      { id: 'entityName', label: 'الجهة', type: 'text', required: true },
      { id: 'changeDetails', label: 'تفاصيل التعديل', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `طلب تعديل ترشيح - ${data.courseName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نرفع لسعادتكم طلب تعديل الترشيح للدورة ${data.courseName} الخاصة بجهة ${data.entityName} وفق التفاصيل الآتية:
${data.changeDetails}

نأمل التكرم بالاطلاع والتوجيه.`,
  },

  {
    id: 'leadership-approval',
    type: 'approval-request',
    group: 'leadership',
    title: 'طلب موافقة',
    description: 'طلب موافقة على إجراء أو تنظيم أو تنفيذ',
    icon: 'check',
    fields: [
      { id: 'requestTitle', label: 'عنوان الطلب', type: 'text', required: true },
      { id: 'background', label: 'الخلفية', type: 'textarea', required: true },
      { id: 'requestedAction', label: 'المطلوب اعتماده', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `طلب موافقة - ${data.requestTitle}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

إشارة إلى الموضوع أعلاه، نرفع لسعادتكم خلفية الطلب كما يلي:
${data.background}

والمطلوب:
${data.requestedAction}

نأمل التكرم بالموافقة.`,
  },

  {
    id: 'leadership-accreditation',
    type: 'accreditation-request',
    group: 'leadership',
    title: 'طلب اعتماد',
    description: 'طلب اعتماد نهائي أو رسمي',
    icon: 'stamp',
    fields: [
      { id: 'subjectName', label: 'موضوع الاعتماد', type: 'text', required: true },
      { id: 'justification', label: 'المبررات', type: 'textarea', required: true },
      { id: 'impact', label: 'الأثر المتوقع', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `طلب اعتماد - ${data.subjectName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نأمل التكرم باعتماد ${data.subjectName}، وذلك استنادًا إلى المبررات التالية:
${data.justification}

الأثر المتوقع:
${data.impact}

وتقبلوا وافر التقدير.`,
  },

];
