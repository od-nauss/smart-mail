import { MessageTemplate } from '../types';

export const leadershipTemplates: MessageTemplate[] = [
  {
    id: 'leadership-nomination-change-pro',
    type: 'leadership_nomination_change',
    group: 'leadership',
    title: 'تعديل ترشيح المشرفين',
    description: 'اعتماد تعديل ترشيح المشرفين للدورات التدريبية',
    icon: 'edit',
    fields: [
      { id: 'recipient', label: 'المرسل إليه', type: 'text', required: true, defaultValue: 'سعادة وكيل الجامعة للتدريب' },
      { id: 'subjectLine', label: 'الموضوع', type: 'text', required: true, defaultValue: 'اعتماد تعديل ترشيح المشرفين للدورات التدريبية' },
      { id: 'introNote', label: 'مقدمة إضافية', type: 'textarea', placeholder: 'أي توضيح مختصر قبل الجدول' },
      { id: 'rows', label: 'الجدول', type: 'table', required: true, columns: ['اسم الدورة','تاريخ البداية','تاريخ النهاية','اسم المكلف السابق','اسم البديل','ملاحظات'] },
    ],
    generateSubject: (data) => String(data.subjectLine || 'اعتماد تعديل ترشيح المشرفين للدورات التدريبية'),
    generateBody: (data) => `سعادة وكيل الجامعة للتدريب سلمه الله

السلام عليكم ورحمة الله وبركاته

${String(data.introNote || 'نأمل من سعادتكم اعتماد الأسماء الواردة في الجدول أدناه لتولي مهام الإشراف والتنفيذ للدورات المذكورة، وذلك وفق التعديل المقترح على الترشيحات السابقة.')}

[rows]

وتفضلوا بقبول خالص التحية والتقدير.`,
  },
  {
    id: 'leadership-external-supervisors-pro',
    type: 'leadership_external_supervisors',
    group: 'leadership',
    title: 'اعتماد مشرفين لدورات خارجية',
    description: 'رفع طلب اعتماد ترشيح مشرفين للدورات الخارجية',
    icon: 'plane',
    fields: [
      { id: 'recipient', label: 'المرسل إليه', type: 'text', required: true, defaultValue: 'سعادة وكيل الجامعة للتدريب' },
      { id: 'subjectLine', label: 'الموضوع', type: 'text', required: true, defaultValue: 'اعتماد ترشيح مشرفين لدورات خارجية' },
      { id: 'introNote', label: 'مقدمة إضافية', type: 'textarea', placeholder: 'أي توضيح مختصر قبل الجدول' },
      { id: 'rows', label: 'الجدول', type: 'table', required: true, columns: ['اسم الدورة','المدينة أو الدولة','تاريخ البداية','تاريخ النهاية','اسم المشرف المرشح','صفة التكليف','ملاحظات'] },
    ],
    generateSubject: (data) => String(data.subjectLine || 'اعتماد ترشيح مشرفين لدورات خارجية'),
    generateBody: (data) => `سعادة وكيل الجامعة للتدريب سلمه الله

السلام عليكم ورحمة الله وبركاته

${String(data.introNote || 'نأمل من سعادتكم التكرم بالموافقة على اعتماد ترشيح المشرفين الواردة أسماؤهم في الجدول أدناه للإشراف على الدورات الخارجية المشار إليها، وفق ما تقتضيه متطلبات التنفيذ والمتابعة.')}

[rows]

وتفضلوا بقبول خالص التحية والتقدير.`,
  },
  {
    id: 'leadership-eid-duty-pro',
    type: 'leadership_eid_duty',
    group: 'leadership',
    title: 'تكليف موظفي دوام العيد',
    description: 'طلب الموافقة على تكليف موظفين خلال فترة العيد',
    icon: 'calendar',
    fields: [
      { id: 'recipient', label: 'المرسل إليه', type: 'text', required: true, defaultValue: 'سعادة وكيل الجامعة للتدريب' },
      { id: 'subjectLine', label: 'الموضوع', type: 'text', required: true, defaultValue: 'الموافقة على تكليف الموظفين لدوام العيد' },
      { id: 'introNote', label: 'مقدمة إضافية', type: 'textarea', placeholder: 'أي توضيح مختصر قبل الجدول' },
      { id: 'rows', label: 'الجدول', type: 'table', required: true, columns: ['اسم الموظف','الفترة','المهام','ملاحظات'] },
    ],
    generateSubject: (data) => String(data.subjectLine || 'الموافقة على تكليف الموظفين لدوام العيد'),
    generateBody: (data) => `سعادة وكيل الجامعة للتدريب سلمه الله

السلام عليكم ورحمة الله وبركاته

${String(data.introNote || 'نظرًا لوجود أعمال تشغيلية تتطلب المتابعة خلال فترة إجازة العيد، نأمل من سعادتكم التكرم بالموافقة على تكليف الموظفين الواردة أسماؤهم في الجدول أدناه للقيام بالمهام المحددة خلال الفترة المشار إليها.')}

[rows]

وتفضلوا بقبول خالص التحية والتقدير.`,
  },
];
