import * as React from 'react';
import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export default function Input({ label, error, hint, leftIcon, className, ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-slate-800">{label}</span>}
      <div className="relative">
        {leftIcon && <span className="absolute inset-y-0 left-3 grid place-items-center text-slate-400">{leftIcon}</span>}
        <input className={cn('w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200', leftIcon && 'pl-10', className)} {...props} />
      </div>
      {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
