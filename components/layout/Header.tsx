import { APP_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

const MailIcon = () => (
  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-naif-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const UniversityIcon = () => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-naif-primary" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-l from-naif-primary via-naif-dark to-naif-primary shadow-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur', 'sm:h-14 sm:w-14')}>
            <MailIcon />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide text-white sm:text-xl">منصة المراسلات الذكية</h1>
            <p className="hidden text-xs text-naif-goldLight sm:block sm:text-sm">{APP_CONFIG.departmentName}</p>
          </div>
        </div>

        <div className={cn('flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white sm:h-10 sm:w-10">
            <UniversityIcon />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white/80">جامعة نايف العربية</p>
            <p className="text-xs text-naif-goldLight">للعلوم الأمنية</p>
          </div>
        </div>
      </div>
    </header>
  );
}
