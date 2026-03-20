import { MessageTemplate } from '../types';
export const operationalTemplates: MessageTemplate[] = [
  {
    id: 'op-security-car',
    type: 'security-car',
    group: 'operational',
    title: 'طلب سيارة أمن للتطبيقات العملية',
    description: 'طلب سيارة أمن ومرافقة للتطبيقات العملية',
    icon: 'car',
    fields: [
      { id: 'courseName', label: 'اسم الدورة', type: 'text', required: true },
      { id: 'applicationDate', label: 'تاريخ التطبيق', type: 'date', required: true },
      { id: 'departureTime', label: 'وقت الانطلاق', type: 'time', required: true },
      { id: 'destination', label: 'جهة التطبيق', type: 'text', required: true },
      { id: 'participants', label: 'عدد المشاركين', type: 'number', required: true },
    ],
    generateSubject: (data) => `طلب سيارة أمن للتطبيق العملي - ${data.courseName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نأمل التكرم بتأمين سيارة أمن للتطبيق العملي الخاص بالدورة التالية:
اسم الدورة: ${data.courseName}
تاريخ التطبيق: ${data.applicationDate}
وقت الانطلاق: ${data.departureTime}
جهة التطبيق: ${data.destination}
عدد المشاركين: ${data.participants}

وتقبلوا خالص التقدير.`,
  },

  {
    id: 'op-trainer-housing',
    type: 'trainer-housing',
    group: 'operational',
    title: 'طلب سكن مدرب',
    description: 'طلب حجز سكن للمدرب خلال مدة التنفيذ',
    icon: 'hotel',
    fields: [
      { id: 'trainerName', label: 'اسم المدرب', type: 'text', required: true },
      { id: 'courseName', label: 'اسم الدورة', type: 'text', required: true },
      { id: 'checkIn', label: 'تاريخ الدخول', type: 'date', required: true },
      { id: 'checkOut', label: 'تاريخ الخروج', type: 'date', required: true },
      { id: 'notes', label: 'ملاحظات', type: 'textarea' },
    ],
    generateSubject: (data) => `طلب سكن للمدرب ${data.trainerName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نأمل التكرم بتأمين سكن للمدرب ${data.trainerName} المرتبط بالدورة ${data.courseName} خلال الفترة من ${data.checkIn} إلى ${data.checkOut}.

ملاحظات إضافية:
${data.notes || 'لا يوجد'}

شاكرين لكم تعاونكم.`,
  },

  {
    id: 'op-guide-update',
    type: 'guide-update',
    group: 'operational',
    title: 'طلب تعديل دليل دورة',
    description: 'طلب تعديل محتوى أو بيانات دليل الدورة',
    icon: 'book',
    fields: [
      { id: 'courseName', label: 'اسم الدورة', type: 'text', required: true },
      { id: 'requestedUpdate', label: 'نوع التعديل المطلوب', type: 'textarea', required: true },
      { id: 'urgency', label: 'درجة الأولوية', type: 'select', required: true, options: [
        { value: 'high', label: 'عالية' },
        { value: 'medium', label: 'متوسطة' },
        { value: 'low', label: 'منخفضة' }
      ]},
    ],
    generateSubject: (data) => `طلب تعديل دليل دورة - ${data.courseName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نأمل التكرم بإجراء التعديلات التالية على دليل الدورة ${data.courseName}:
${data.requestedUpdate}

درجة الأولوية: ${data.urgency}

وتقبلوا التقدير.`,
  },

  {
    id: 'op-schedule-update',
    type: 'schedule-update',
    group: 'operational',
    title: 'طلب تعديل خطة زمنية',
    description: 'طلب تعديل الجدول الزمني للدورة',
    icon: 'clock',
    fields: [
      { id: 'courseName', label: 'اسم الدورة', type: 'text', required: true },
      { id: 'currentPlan', label: 'الوضع الحالي', type: 'textarea', required: true },
      { id: 'requestedPlan', label: 'التعديل المطلوب', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `طلب تعديل الخطة الزمنية - ${data.courseName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

بخصوص الدورة ${data.courseName}، نأمل اعتماد التعديل التالي على الخطة الزمنية.

الوضع الحالي:
${data.currentPlan}

التعديل المطلوب:
${data.requestedPlan}

شاكرين تعاونكم.`,
  },

  {
    id: 'op-support-request',
    type: 'support-request',
    group: 'operational',
    title: 'طلب دعم أو تنسيق مع إدارة أخرى',
    description: 'طلب دعم تشغيلي أو تنسيق من جهة داخلية',
    icon: 'link',
    fields: [
      { id: 'department', label: 'الإدارة المعنية', type: 'text', required: true },
      { id: 'courseName', label: 'اسم الدورة أو الموضوع', type: 'text', required: true },
      { id: 'requestDetails', label: 'تفاصيل الطلب', type: 'textarea', required: true },
    ],
    generateSubject: (data) => `طلب دعم/تنسيق مع ${data.department}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نأمل دعمنا والتنسيق معنا بخصوص ${data.courseName}، وذلك وفق التفاصيل التالية:
${data.requestDetails}

شاكرين لكم حسن التعاون.`,
  },

];
