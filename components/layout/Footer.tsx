'use client';

import { APP_CONFIG } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-naif-white border-t border-naif-gray py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-naif-blueGray">
          <p>جميع الحقوق محفوظة © {currentYear} - {APP_CONFIG.universityName}</p>
          <p>الإصدار 1.0.0</p>
        </div>
      </div>
    </footer>
  );
}