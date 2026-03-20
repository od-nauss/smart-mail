'use client';

import Button from '@/components/ui/Button';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-elevated">
        <h2 className="text-2xl font-bold text-slate-900">حدث خطأ غير متوقع</h2>
        <p className="mt-3 text-slate-600">تعذر إكمال العملية الحالية. حاول مرة أخرى.</p>
        <Button className="mt-6" onClick={reset}>إعادة المحاولة</Button>
      </div>
    </div>
  );
}
