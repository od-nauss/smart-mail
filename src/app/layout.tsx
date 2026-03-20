import type { Metadata } from 'next';
import './globals.css';
import { APP_CONFIG } from '@/core/config';
import { ToastProvider } from '@/contexts/ToastContext';
import { WeeklyProvider } from '@/contexts/WeeklyContext';

export const metadata: Metadata = {
  title: APP_CONFIG.appName,
  description: APP_CONFIG.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ToastProvider>
          <WeeklyProvider>{children}</WeeklyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
