'use client';

import { useEffect } from 'react';
import { ModalProps } from '@/lib/types';
import { cn } from '@/lib/utils';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw]',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'w-full rounded-3xl bg-white shadow-2xl overflow-hidden slide-up',
            sizes[size]
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg sm:text-xl font-bold text-naif-primary">{title}</h2>
            {showClose ? (
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                onClick={onClose}
                aria-label="إغلاق النافذة"
              >
                ✕
              </button>
            ) : null}
          </div>
          <div className="max-h-[80vh] overflow-y-auto scrollbar-thin p-5 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
