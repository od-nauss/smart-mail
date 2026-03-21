'use client';

type HeaderProps = {
  onArchiveClick?: () => void;
};

export function Header({ onArchiveClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7e7] bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[92px] grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="flex items-center gap-3">
            {onArchiveClick ? (
              <button
                type="button"
                onClick={onArchiveClick}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d0b284] bg-[#fbfaf7] text-[#016564] shadow-[0_14px_24px_-18px_rgba(1,101,100,0.35)] transition hover:border-[#016564]"
                title="الأرشيف المركزي"
                aria-label="الأرشيف المركزي"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2H4V7Z" />
                  <path d="M5 9h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Z" />
                  <path d="M10 13h4" />
                </svg>
              </button>
            ) : (
              <div />
            )}
          </div>

          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-[#016564] sm:text-2xl">
              منصة المراسلات الذكية
            </h1>
            <p className="mt-1 text-xs text-[#8c6968] sm:text-sm">
              واجهة ذكية لإنشاء المراسلات الرسمية
            </p>
          </div>

          <div className="flex justify-end">
            <img
              src="/naif-logo.png"
              alt="شعار جامعة نايف"
              className="h-14 w-auto object-contain sm:h-16 lg:h-20"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
