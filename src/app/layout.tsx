import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { APP_CONFIG } from '@/core/config';
import { ToastProvider } from '@/contexts/ToastContext';
import { WeeklyProvider } from '@/contexts/WeeklyContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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