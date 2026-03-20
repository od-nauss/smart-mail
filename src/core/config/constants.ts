import type { ScenarioCategory } from '@/core/types';

export const STORAGE_KEYS = {
  courses: 'nauss-smart-correspondence-courses',
  drafts: 'nauss-smart-correspondence-drafts',
  settings: 'nauss-smart-correspondence-settings'
} as const;

export const SCENARIO_CATEGORIES: { value: ScenarioCategory; label: string; icon: string }[] = [
  { value: 'operational', label: 'طلبات تشغيلية', icon: '⚙️' },
  { value: 'approval', label: 'طلبات اعتماد', icon: '✅' },
  { value: 'coordination', label: 'تنسيق داخلي', icon: '🤝' }
];
