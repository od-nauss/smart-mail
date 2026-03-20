export const appConfig = {
  name: 'منصة المراسلات الذكية',
  shortName: 'SMART-MAIL',
  description:
    'منصة عربية ذكية لصياغة المراسلات المؤسسية والتشغيلية لإدارة عمليات التدريب بجامعة نايف العربية للعلوم الأمنية.',
  appName: 'منصة المراسلات الذكية',
  defaultDirection: 'rtl',
  defaultLanguage: 'ar',
  locale: 'ar-SA',
  organization: {
    department: 'إدارة عمليات التدريب',
    training: 'وكالة الجامعة للتدريب',
    name: 'جامعة نايف العربية للعلوم الأمنية',
  },
  signature:
    process.env.NEXT_PUBLIC_DEFAULT_SIGNATURE ||
    `فريق عمل إدارة عمليات التدريب
وكالة الجامعة للتدريب`,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'OD@nauss.edu.sa',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'OD@nauss.edu.sa',
  features: {
    weeklyWorkflow: true,
    scenarioLibrary: true,
    excelImport: true,
    outlookIntegration: false,
    directSend: false,
    draftMode: true,
  },
} as const;

export const APP_CONFIG = appConfig;
export type AppConfig = typeof appConfig;
