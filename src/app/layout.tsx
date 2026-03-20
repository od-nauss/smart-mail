import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { APP_CONFIG } from '@/core/config';
import { ToastProvider } from '@/contexts/ToastContext';
import { WeeklyProvider } from '@/contexts/WeeklyContext';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: APP_CONFIG.appName,
  description: 'منصة عربية ذكية لصياغة المراسلات الرسمية والتشغيلية',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.variable}>
        <ToastProvider>
          <WeeklyProvider>{children}</WeeklyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
