'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
};

export default function Select({ label, error, hint, options, className, placeholder, inputSize = 'md', ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-slate-800">{label}</span>}
      <select
        className={cn('w-full rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:bg-slate-100', sizeClasses[inputSize], className)}
        {...props}
      >
        <option value="">{placeholder || 'اختر...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
