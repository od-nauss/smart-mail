export function Header() {
  return (
    <header className="border-b border-[#e9e1d5] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <img
            src="/naif-logo.png"
            alt="شعار جامعة نايف"
            className="h-16 w-auto object-contain sm:h-20"
          />

          <div>
            <h1 className="text-lg font-medium text-[#016564] sm:text-xl">
              منصة المراسلات الذكية
            </h1>
          </div>
        </div>

        <div className="hidden rounded-lg border border-[#e9e1d5] bg-[#faf8f4] px-4 py-2 md:block">
          <span className="text-sm text-[#016564]">اختيار سريع للقوالب</span>
        </div>
      </div>
    </header>
  );
}