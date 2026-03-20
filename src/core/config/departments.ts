import type { DepartmentConfig, DepartmentType } from '@/core/types';

export const departmentList: DepartmentConfig[] = [
  { id: 'hospitality', title: 'الضيافة والإسكان', description: 'تجهيز الضيافة والإسكان والمراسم', icon: '☕', color: 'bg-gold-100' },
  { id: 'protocol', title: 'المراسم', description: 'مراسلات البروتوكول والاستقبال', icon: '🎖️', color: 'bg-primary-100' },
  { id: 'security', title: 'الأمن والسلامة', description: 'تأمين دخول المشاركين والإجراءات الأمنية', icon: '🛡️', color: 'bg-red-100' },
  { id: 'medical', title: 'العيادة الطبية', description: 'الاستعداد الطبي الوقائي', icon: '🩺', color: 'bg-emerald-100' },
  { id: 'support', title: 'الخدمات المساندة', description: 'النظافة والتجهيز والصيانة', icon: '🧹', color: 'bg-slate-100' },
  { id: 'trainers', title: 'المدربين', description: 'تنسيق مباشر مع المدربين', icon: '👨‍🏫', color: 'bg-indigo-100' }
];

export function getDepartmentConfig(id: DepartmentType) {
  return departmentList.find((d) => d.id === id)!;
}
