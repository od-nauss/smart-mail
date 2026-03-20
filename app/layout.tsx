import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import { APP_CONFIG } from '@/lib/constants';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'منصة المراسلات الذكية | جامعة نايف العربية للعلوم الأمنية',
    template: '%s | منصة المراسلات الذكية',
  },
  description: `منصة المراسلات الذكية - ${APP_CONFIG.universityName}`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#016564',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} font-cairo bg-[#f8f9f9] text-gray-800 antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}