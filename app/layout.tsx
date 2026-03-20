import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import { APP_CONFIG } from '@/lib/constants';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'منصة المراسلات الذكية | جامعة نايف العربية للعلوم الأمنية',
    template: '%s | منصة المراسلات الذكية',
  },
  description: `منصة المراسلات الذكية - أداة ويب عربية تساعد موظفي إدارة عمليات التدريب على إنشاء الإيميلات الرسمية المتكررة بسرعة وسهولة - ${APP_CONFIG.universityName}`,
  keywords: ['مراسلات', 'تدريب', 'جامعة نايف', 'العلوم الأمنية', 'إيميلات رسمية', 'إدارة التدريب', 'مراسلات إدارية'],
  authors: [{ name: APP_CONFIG.departmentName, url: 'https://nauss.edu.sa' }],
  creator: APP_CONFIG.universityName,
  publisher: APP_CONFIG.universityName,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'منصة المراسلات الذكية',
    title: 'منصة المراسلات الذكية | جامعة نايف العربية للعلوم الأمنية',
    description: 'أداة ويب عربية لإنشاء الإيميلات الرسمية المتكررة بسرعة وسهولة',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#016564' },
    { media: '(prefers-color-scheme: dark)', color: '#014d4c' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body
        className={`${cairo.className} antialiased bg-naif-cream text-gray-800 selection:bg-naif-gold selection:text-naif-dark`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-naif-primary focus:px-4 focus:py-2 focus:text-white"
        >
          انتقل إلى المحتوى الرئيسي
        </a>

        <div className="min-h-screen flex flex-col">{children}</div>
        <ToastContainer />
      </body>
    </html>
  );
}
