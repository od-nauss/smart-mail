'use client';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe4e4] bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[78px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#e4e7e7] bg-white px-3 py-2 shadow-sm">
              <img
                src="/naif-logo.png"
                alt="شعار جامعة نايف"
                className="h-14 w-auto object-contain sm:h-16 lg:h-20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <h1 className="text-lg font-semibold text-[#016564] sm:text-xl lg:text-[1.45rem]">
                منصة المراسلات الذكية
              </h1>
              <p className="text-xs text-[#8c6968] sm:text-sm">
                واجهة سريعة لإنشاء المراسلات الرسمية
              </p>
            </div>

            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#d8c3a2] bg-gradient-to-br from-[#016564] to-[#498983] text-white sm:flex">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}