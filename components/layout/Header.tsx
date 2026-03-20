'use client';

import { APP_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="bg-naif-primary border-b border-naif-primary/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* الشعار والعنوان */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-naif-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-white tracking-wide">
                منصة المراسلات الذكية
              </h1>
              <p className="text-xs text-white/60 hidden sm:block">
                {APP_CONFIG.departmentName}
              </p>
            </div>
          </div>
          
          {/* شارة الجامعة */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-naif-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-white/70">جامعة نايف العربية</p>
              <p className="text-xs text-white/50">للعلوم الأمنية</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}