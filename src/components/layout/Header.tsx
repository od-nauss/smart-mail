import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-sand-200 bg-white/80 backdrop-blur">
      <div className="container-app flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-500 text-white">✉️</div>
          <div>
            <div className="font-black text-slate-900">منصة المراسلات الذكية</div>
            <div className="text-xs text-slate-500">جامعة نايف العربية للعلوم الأمنية</div>
          </div>
        </Link>
        <nav className="hidden gap-2 md:flex">
          <Link href="/weekly" className="rounded-xl px-3 py-2 text-sm hover:bg-slate-100">البيانات الأسبوعية</Link>
          <Link href="/weekly/emails" className="rounded-xl px-3 py-2 text-sm hover:bg-slate-100">البريد الأسبوعي</Link>
          <Link href="/scenarios" className="rounded-xl px-3 py-2 text-sm hover:bg-slate-100">السيناريوهات</Link>
          <Link href="/about" className="rounded-xl px-3 py-2 text-sm hover:bg-slate-100">حول المنصة</Link>
        </nav>
      </div>
    </header>
  );
}
