export const APP_CONFIG = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'منصة المراسلات الذكية',
  organization: {
    name: process.env.NEXT_PUBLIC_ORGANIZATION || 'جامعة نايف العربية للعلوم الأمنية',
    training: 'وكالة الجامعة للتدريب',
    department: 'إدارة عمليات التدريب'
  },
  signature: process.env.NEXT_PUBLIC_DEFAULT_SIGNATURE || 'فريق عمل إدارة عمليات التدريب
وكالة الجامعة للتدريب',
  locale: 'ar-SA'
} as const;
