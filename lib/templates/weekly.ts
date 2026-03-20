import { MessageTemplate } from '../types';
export const weeklyTemplates: MessageTemplate[] = [
  {
    id: 'weekly-hospitality',
    type: 'hospitality',
    group: 'weekly',
    title: 'الضيافة والإسكان',
    description: 'طلب تجهيزات الضيافة والإسكان للدورات التدريبية',
    icon: 'hotel',
    fields: [
      { id: 'weekNumber', label: 'رقم الأسبوع', type: 'text', placeholder: 'الأسبوع الأول', required: true },
      { id: 'dateFrom', label: 'من تاريخ', type: 'date', required: true },
      { id: 'dateTo', label: 'إلى تاريخ', type: 'date', required: true },
      { id: 'courses', label: 'الدورات التدريبية', type: 'table', columns: ['اسم الدورة', 'المدرب', 'المكان', 'عدد المتدربين'], required: true },
    ],
    generateSubject: (data) => `إفادة بخصوص الدورات التدريبية لـ${data.weekNumber} (${data.dateFrom} - ${data.dateTo})`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نفيدكم بأن الدورات التدريبية المزمع تنفيذها خلال ${data.weekNumber} ستكون في الفترة من ${data.dateFrom} إلى ${data.dateTo}، ونأمل التكرم بالتنسيق بشأن متطلبات الضيافة والإسكان وفق البيانات الآتية:

{coursesTable}

شاكرين لكم تعاونكم.`,
  },

  {
    id: 'weekly-protocol',
    type: 'protocol',
    group: 'weekly',
    title: 'المراسم',
    description: 'تنسيق الاستقبال والمراسم للمدربين أو الضيوف',
    icon: 'calendar',
    fields: [
      { id: 'weekNumber', label: 'رقم الأسبوع', type: 'text', required: true },
      { id: 'dateFrom', label: 'من تاريخ', type: 'date', required: true },
      { id: 'dateTo', label: 'إلى تاريخ', type: 'date', required: true },
      { id: 'courses', label: 'الدورات والضيوف', type: 'table', columns: ['اسم الدورة', 'اسم المدرب/الضيف', 'موعد الوصول', 'موعد المغادرة'], required: true },
    ],
    generateSubject: (data) => `التنسيق مع إدارة المراسم للأسبوع ${data.weekNumber}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نأمل التكرم بالتنسيق مع إدارة المراسم بشأن البرامج التدريبية والضيوف المدرجة أدناه خلال الفترة من ${data.dateFrom} إلى ${data.dateTo}:

{coursesTable}

وتقبلوا خالص التقدير.`,
  },

  {
    id: 'weekly-security',
    type: 'security',
    group: 'weekly',
    title: 'الأمن والسلامة',
    description: 'طلب تنسيق أمني وسلامة للموقع التدريبي',
    icon: 'shield',
    fields: [
      { id: 'courseName', label: 'اسم الدورة', type: 'text', required: true },
      { id: 'date', label: 'التاريخ', type: 'date', required: true },
      { id: 'time', label: 'الوقت', type: 'time', required: true },
      { id: 'location', label: 'المكان', type: 'text', required: true },
      { id: 'attendees', label: 'عدد المتدربين', type: 'number', required: true },
    ],
    generateSubject: (data) => `طلب تنسيق أمني - ${data.courseName}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نأمل التكرم بالتنسيق الأمني اللازم للدورة التالية:
اسم الدورة: ${data.courseName}
التاريخ: ${data.date}
الوقت: ${data.time}
المكان: ${data.location}
عدد المتدربين: ${data.attendees}

ولكم جزيل الشكر.`,
  },

  {
    id: 'weekly-clinic',
    type: 'clinic',
    group: 'weekly',
    title: 'العيادة الطبية',
    description: 'طلب دعم طبي أو متابعة صحية للبرنامج',
    icon: 'medical',
    fields: [
      { id: 'courseName', label: 'اسم الدورة', type: 'text', required: true },
      { id: 'date', label: 'التاريخ', type: 'date', required: true },
      { id: 'duration', label: 'مدة الدورة', type: 'text', placeholder: '3 أيام', required: true },
      { id: 'location', label: 'المكان', type: 'text', required: true },
    ],
    generateSubject: (data) => `التنسيق مع العيادة الطبية بشأن ${data.courseName}`,
    generateBody: (data) => `سعادة مدير العيادة الطبية بالجامعة سلمه الله

نأمل التكرم بالاطلاع والتنسيق بشأن الدورة التالية:
اسم الدورة: ${data.courseName}
التاريخ: ${data.date}
المدة: ${data.duration}
المكان: ${data.location}

وتقبلوا تحياتنا.`,
  },

  {
    id: 'weekly-services',
    type: 'services',
    group: 'weekly',
    title: 'الخدمات المساندة',
    description: 'طلب خدمات مساندة وتشغيلية للدورات',
    icon: 'support',
    fields: [
      { id: 'weekNumber', label: 'رقم الأسبوع', type: 'text', required: true },
      { id: 'courses', label: 'الطلبات', type: 'table', columns: ['اسم الدورة', 'الخدمة المطلوبة', 'الموقع', 'التاريخ'], required: true },
    ],
    generateSubject: (data) => `طلبات الخدمات المساندة للأسبوع ${data.weekNumber}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نفيدكم بالاحتياج إلى الخدمات المساندة الموضحة أدناه خلال ${data.weekNumber}:

{coursesTable}

شاكرين لكم تعاونكم المعتاد.`,
  },

  {
    id: 'weekly-trainers',
    type: 'trainers',
    group: 'weekly',
    title: 'المدربين',
    description: 'متابعة متطلبات المدربين وجدولة الدعم',
    icon: 'user',
    fields: [
      { id: 'weekNumber', label: 'رقم الأسبوع', type: 'text', required: true },
      { id: 'courses', label: 'بيانات البرامج والمدربين', type: 'table', columns: ['اسم الدورة', 'اسم المدرب', 'التخصص', 'الملاحظة'], required: true },
    ],
    generateSubject: (data) => `متابعة متطلبات المدربين - ${data.weekNumber}`,
    generateBody: (data) => `السلام عليكم ورحمة الله وبركاته،

نأمل الاطلاع على البرامج التالية وما يرتبط بها من متطلبات للمدربين خلال ${data.weekNumber}:

{coursesTable}

ولكم خالص الشكر.`,
  },

];
