import Image from 'next/image';
import { APP_CONFIG } from '@/lib/constants';

const MailIcon = () => (
  <svg
    className="h-5 w-5 text-naif-primary sm:h-6 sm:w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-naif-gold/20 glass-header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[78px] items-center justify-between gap-4 py-3 sm:min-h-[92px]">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-naif-gold/30 bg-white shadow-[0_10px_30px_-18px_rgba(1,101,100,0.55)] sm:h-16 sm:w-16">
              <Image
                src="/naif-logo.png"
                alt="شعار جامعة نايف العربية للعلوم الأمنية"
                fill
                className="object-contain p-2"
                sizes="64px"
                priority
              />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-semibold tracking-[0.18em] text-naif-goldDark sm:text-xs">
                {APP_CONFIG.universityName}
              </p>
              <h1 className="truncate text-base font-extrabold text-naif-primary sm:text-xl lg:text-2xl">
                منصة المراسلات الذكية
              </h1>
              <p className="truncate text-xs text-gray-500 sm:text-sm">
                {APP_CONFIG.departmentName}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 rounded-2xl border border-naif-gold/25 bg-white/85 px-4 py-3 shadow-[0_14px_34px_-22px_rgba(1,101,100,0.45)] md:flex">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-naif-gold/25 to-naif-primary/10">
              <MailIcon />
            </div>
            <div>
              <p className="text-sm font-bold text-naif-primary">مراسلات أسرع</p>
              <p className="text-xs text-gray-500">صياغة رسمية جاهزة خلال دقائق</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}