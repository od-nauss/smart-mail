export function Header() {
  return (
    <header className="border-b border-[#e7dfd2] bg-white/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/naif-logo.png"
            alt="شعار جامعة نايف"
            className="h-12 w-12 rounded-md object-contain sm:h-14 sm:w-14"
          />
          <div className="min-w-0">
            <p className="text-[11px] text-[#b89a5e] sm:text-xs">
              جامعة نايف العربية للعلوم الأمنية
            </p>
            <h1 className="truncate text-lg font-medium text-[#016564] sm:text-xl">
              منصة المراسلات الذكية
            </h1>
            <p className="text-xs text-gray-500 sm:text-sm">
              إدارة عمليات التدريب
            </p>
          </div>
        </div>

        <div className="hidden rounded-xl border border-[#ece4d7] bg-[#faf8f4] px-4 py-2 md:block">
          <p className="text-sm text-[#016564]">منصة عملية وسريعة</p>
        </div>
      </div>
    </header>
  );
}