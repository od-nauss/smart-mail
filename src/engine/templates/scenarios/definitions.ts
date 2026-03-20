import type { Scenario, ScenarioCategory } from '@/core/types';

const now = new Date().toISOString();

const operationalScenarios: Scenario[] = [
  {
    id: 'vehicle-request',
    category: 'operational',
    title: 'طلب سيارة أمن للتطبيقات العملية',
    description: 'طلب توفير مركبة أمنية للتدريب العملي الميداني',
    icon: '🚗',
    color: 'blue',
    fields: [
      { id: 'programName', label: 'اسم البرنامج', type: 'text', required: true },
      { id: 'trainingDate', label: 'التاريخ', type: 'date', required: true },
      { id: 'trainingTime', label: 'التوقيت', type: 'text', required: true },
      { id: 'destination', label: 'الغرض / الموقع', type: 'text', required: true },
      { id: 'supervisorName', label: 'اسم المشرف', type: 'text', required: true },
      { id: 'contactNumber', label: 'رقم التواصل', type: 'text', required: false }
    ],
    subjectTemplate: 'طلب سيارة أمن - {programName}',
    templateKey: 'vehicle-request',
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
    tags: ['أمن', 'ميداني']
  },
  {
    id: 'accommodation-request',
    category: 'operational',
    title: 'طلب إقامة مدرب',
    description: 'طلب تأمين سكن للمدرب',
    icon: '🏨',
    color: 'purple',
    fields: [
      { id: 'trainerName', label: 'اسم المدرب', type: 'text', required: true },
      { id: 'programName', label: 'اسم البرنامج', type: 'text', required: true },
      { id: 'checkInDate', label: 'من', type: 'date', required: true },
      { id: 'checkOutDate', label: 'إلى', type: 'date', required: true },
      { id: 'roomType', label: 'نوع الغرفة', type: 'select', required: false, options: [
        { value: 'مفردة', label: 'مفردة' },
        { value: 'مزدوجة', label: 'مزدوجة' },
        { value: 'جناح', label: 'جناح' }
      ] },
      { id: 'specialRequests', label: 'طلبات خاصة', type: 'textarea', required: false }
    ],
    subjectTemplate: 'طلب إقامة مدرب - {trainerName}',
    templateKey: 'accommodation-request',
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
    tags: ['إسكان', 'مدرب']
  },
  {
    id: 'course-guide-modification',
    category: 'coordination',
    title: 'طلب تعديل دليل الدورة',
    description: 'تنسيق مع شؤون المدربين أو التصميم لتعديل الدليل',
    icon: '📘',
    color: 'indigo',
    fields: [
      { id: 'programName', label: 'اسم الدورة', type: 'text', required: true },
      { id: 'programDates', label: 'الفترة', type: 'text', required: true },
      { id: 'messageDetails', label: 'التعديل المطلوب', type: 'textarea', required: true }
    ],
    subjectTemplate: 'طلب تعديل دليل الدورة - {programName}',
    templateKey: 'support-dept-coordination',
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
    tags: ['دليل', 'تنسيق']
  }
];

const approvalScenarios: Scenario[] = [
  {
    id: 'supervisor-modification',
    category: 'approval',
    title: 'طلب تعديل ترشيح مشرف/منسق',
    description: 'طلب موافقة الوكيل على تعديل المرشح أو المنسق',
    icon: '🔄',
    color: 'amber',
    fields: [
      { id: 'programName', label: 'اسم النشاط التدريبي', type: 'text', required: true },
      { id: 'programLocation', label: 'مكان التنفيذ', type: 'text', required: true },
      { id: 'programDates', label: 'فترة التنفيذ', type: 'text', required: true },
      { id: 'currentSupervisor', label: 'المرشح الحالي', type: 'text', required: true },
      { id: 'newSupervisor', label: 'المرشح البديل', type: 'text', required: true },
      { id: 'modificationReason', label: 'سبب التعديل', type: 'textarea', required: true }
    ],
    subjectTemplate: 'طلب تعديل ترشيح - {programName}',
    templateKey: 'supervisor-modification',
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
    tags: ['وكيل', 'اعتماد']
  },
  {
    id: 'advance-request',
    category: 'approval',
    title: 'طلب اعتماد بنود سلفة',
    description: 'طلب اعتماد بنود السلفة أو المخصصات المالية',
    icon: '💰',
    color: 'emerald',
    fields: [
      { id: 'programName', label: 'اسم البرنامج', type: 'text', required: true },
      { id: 'programLocation', label: 'مكان التنفيذ', type: 'text', required: true },
      { id: 'programDates', label: 'الفترة', type: 'text', required: true },
      { id: 'requestedAmount', label: 'المبلغ المطلوب', type: 'text', required: true },
      { id: 'amountBreakdown', label: 'تفاصيل البنود', type: 'textarea', required: true },
      { id: 'justification', label: 'المبررات', type: 'textarea', required: true },
      { id: 'beneficiaryName', label: 'اسم المستفيد', type: 'text', required: true }
    ],
    subjectTemplate: 'طلب سلفة - {programName}',
    templateKey: 'advance-request',
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
    tags: ['سلفة', 'مالية']
  }
];

const coordinationScenarios: Scenario[] = [
  {
    id: 'trainer-coordination',
    category: 'coordination',
    title: 'تنسيق مع المدرب',
    description: 'مراسلة مباشرة مع المدرب',
    icon: '👨‍🏫',
    color: 'blue',
    fields: [
      { id: 'trainerName', label: 'اسم المدرب', type: 'text', required: true },
      { id: 'programName', label: 'اسم البرنامج', type: 'text', required: true },
      { id: 'programDates', label: 'الفترة', type: 'text', required: true },
      { id: 'coordinationTopic', label: 'موضوع التنسيق', type: 'textarea', required: true }
    ],
    subjectTemplate: 'تنسيق - {programName}',
    templateKey: 'trainer-coordination',
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
    tags: ['مدرب']
  }
];

export const allScenarios: Scenario[] = [...operationalScenarios, ...approvalScenarios, ...coordinationScenarios];
export function getScenariosByCategory(category: ScenarioCategory) { return allScenarios.filter((s) => s.category === category); }
export function getScenarioById(id: string) { return allScenarios.find((s) => s.id === id); }
