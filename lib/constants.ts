import { AppConfig, MessageGroupInfo } from './types';

export const APP_CONFIG: AppConfig = {
  universityName: 'جامعة نايف العربية للعلوم الأمنية',
  departmentName: 'إدارة عمليات التدريب',
  defaultSignature: `فريق عمل إدارة عمليات التدريب
وكالة الجامعة للتدريب`,
  contactEmail: 'training@nauss.edu.sa',
};

export const UNIVERSITY_COLORS = {
  primary: '#016564',
  dark: '#014d4c',
  light: '#028a88',
  gold: '#d0b284',
  goldLight: '#e5d4b3',
  goldDark: '#b89a5e',
  cream: '#faf8f4',
} as const;

export const DEFAULT_SIGNATURE = APP_CONFIG.defaultSignature;

export const MESSAGE_GROUPS: MessageGroupInfo[] = [
  {
    id: 'weekly',
    title: 'المراسلات الأسبوعية',
    description: 'رسائل دورية للجهات المختلفة',
    icon: 'calendar',
    color: 'primary',
  },
  {
    id: 'operational',
    title: 'المراسلات التشغيلية',
    description: 'طلبات التنسيق والدعم',
    icon: 'settings',
    color: 'gold',
  },
  {
    id: 'leadership',
    title: 'المراسلات القيادية',
    description: 'طلبات الاعتماد والموافقات',
    icon: 'users',
    color: 'primary',
  },
  {
    id: 'general',
    title: 'المراسلات العامة',
    description: 'تذكيرات ومتابعات وشكر',
    icon: 'mail',
    color: 'gold',
  },
];
