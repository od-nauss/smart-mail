'use client';

import Button from './Button';

export default function Modal({ isOpen, onClose, title, subtitle, children, size = 'xl' }: { isOpen: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode; size?: 'xl' | '2xl' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className={`mx-auto max-h-[92vh] overflow-auto rounded-[2rem] bg-white shadow-elevated ${size === '2xl' ? 'max-w-5xl' : 'max-w-4xl'}`}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <Button variant="ghost" onClick={onClose}>إغلاق</Button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
